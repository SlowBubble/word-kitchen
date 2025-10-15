import { buildDialogues, introDialogue, outroDialogue } from "./dialogue.js";
  
export class WordsMgr {
  constructor(wordCard, words, level) {
    this.wordCard = wordCard;
    this.level = level;
    this.dialogues = words.flatMap((word, idx) => {
      return buildDialogues(word, level, idx === 0);
    });
    this.dialogues.unshift(introDialogue);
    this.dialogues.push(outroDialogue);
    this.dialogueIdx = 0;
    this.stuck = false;
    this.isBusyActing = false;
  }

  render(word, startHighlightIdx=-1, endHighlightIdx=-1) {
    const hash = Math.abs(hashCode(word))
    const hue = (hash % 360) + 220;
    const saturation = (hash % 23) + 50;
    const lightness = (hash % 3) + 95;
    const hideAfterHighlight = this.level === 4;
    this.wordCard.render(word, startHighlightIdx, endHighlightIdx, hue, saturation, lightness, hideAfterHighlight);
  }

  async execute(inputKey, normalFlow=true) {
    if (normalFlow && this.isBusyActing) {
      return;
    }
    this.isBusyActing = true;

    const dialogue = this.dialogues[this.dialogueIdx];
    if (dialogue.expectedKey) {
      console.log('input: ', inputKey, ', expected: ', dialogue.expectedKey);
    }
    if (!dialogue.expectedKey || inputKey === dialogue.expectedKey) {
      this.dialogueIdx = (this.dialogueIdx + 1) % this.dialogues.length;
      const nextDialogue = this.dialogues[this.dialogueIdx];
      let goodVoices = window.speechSynthesis.getVoices().filter(voice => voice.lang === 'en-US')
      goodVoices = goodVoices.slice(0, 2);
      goodVoices.reverse();
      const voice = goodVoices[nextDialogue.voiceIdx % goodVoices.length];
      const renderFunc = _ => this.render(nextDialogue.display, nextDialogue.startHighlightIdx, nextDialogue.endHighlightIdx);
      const utterFunc = async _ => await utter(nextDialogue.speech, nextDialogue.delayMs, nextDialogue.speechRate || 0.8, voice);
      if (nextDialogue.renderAfterUttering) {
        await utterFunc();
        renderFunc();
      } else {
        renderFunc();
        await utterFunc();
      }
      
      if (!nextDialogue.stop) {
        await this.execute(nextDialogue.expectedKey, false);
      }
    } else {
      await utter(dialogue.speechForUnexpectedKey || generateWrongLetterMessage());
    }

    this.isBusyActing = false;
  }
}

async function utter(sentence, delayMs = 0, rate = 0.8, voice = null) {
  return new Promise(resolve => {
    const speechSynthesisUtterance = new SpeechSynthesisUtterance(sentence);
    if (voice) {
      speechSynthesisUtterance.voice = voice;
    }
    speechSynthesisUtterance.rate = rate;
    speechSynthesisUtterance.onend = function(evt) {
      window.setTimeout(_ => {
        resolve();
      }, delayMs);
    }
    window.speechSynthesis.speak(speechSynthesisUtterance);
  });
}

function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

const wrongLetterFirstParts = [
  "",
  "Oops!",
  "Not quite!",
  "Nope! ",
  "Incorrect!",
  "Incorrect choice!",
  "Incorrect key!",
  "Incorrect letter!",
  "Wrong choice!",
  "Wrong key!",
  "Wrong letter!",
  "Wrong character!",
  "Don't give up!",
  "Don't lose hope!",
  "That's not the one!",
  "Don't be discouraged!",
  "Stop rushing!"
];

const wrongLetterSecondParts = [
  "Give it another go!",
  "Almost there!",
  "Keep trying!",
  "Try a different key.",
  "You're close!",
  "Keep searching!",
  "You can do it!",
  "Keep at it!",
  "Take a deep breath and try again.",
  "Stay positive and try again.",
  "Believe in yourself and keep trying.",
  "Think before you act!",
  "You will get there!",
  "You may want to hire a tutor.",
  "You may want to hire a coach.",
  "If you want to hire a tutor, my rate is $99 an hour.",
];

function generateWrongLetterMessage() {
  const firstPart = wrongLetterFirstParts[Math.floor(Math.random() * wrongLetterFirstParts.length)];
  const secondPart = wrongLetterSecondParts[Math.floor(Math.random() * wrongLetterSecondParts.length)];
  return `${firstPart} ${secondPart}`;
}

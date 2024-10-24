import { buildDialogues, introDialogue, outroDialogue } from "./dialogue.js";
  
export class WordsMgr {
  constructor(wordCard, words, level) {
    this.wordCard = wordCard;
    this.dialogues = words.flatMap(word => {
      return buildDialogues(word, level);
    });
    this.dialogues.unshift(introDialogue);
    this.dialogues.push(outroDialogue);
    this.dialogueIdx = 0;
    this.stuck = false;
    this.isBusyActing = false;
    this.level = level;
  }

  render(word, startHighlightIdx=-1, endHighlightIdx=-1) {
    const hash = Math.abs(hashCode(word))
    const hue = (hash % 360) + 220;
    const saturation = (hash % 23) + 50;
    const lightness = (hash % 3) + 95;
    this.wordCard.render(word, startHighlightIdx, endHighlightIdx, hue, saturation, lightness);
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
      await utter(dialogue.speechForUnexpectedKey);
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


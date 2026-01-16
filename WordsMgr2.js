import { buildDialogues, introDialogue, outroDialogue } from "./dialogue.js";
  
export class WordsMgr {
  constructor(wordCard, words, level, showFingers = true, sentenceMode = false, caseSensitive = true) {
    this.wordCard = wordCard;
    this.level = level;
    this.showFingers = showFingers;
    this.sentenceMode = sentenceMode;
    this.caseSensitive = caseSensitive;
    this.dialogues = words.flatMap((word, idx) => {
      const dialogues = buildDialogues(word, level, idx === 0, caseSensitive, sentenceMode);
      // Mark the first dialogue of each word/sentence for score reset
      if (dialogues.length > 0) {
        dialogues[0].isFirstOfWord = true;
      }
      return dialogues;
    });
    this.dialogues.unshift(introDialogue);
    this.dialogues.push(outroDialogue);
    this.dialogueIdx = 0;
    this.stuck = false;
    this.isBusyActing = false;
    
    // Score tracking for sentence mode
    this.correctAttempts = 0;
    this.totalAttempts = 0;
    
    // Create score banner if in sentence mode
    if (this.sentenceMode) {
      this.createScoreBanner();
    }
  }
  
  createScoreBanner() {
    const banner = document.createElement('div');
    banner.id = 'scoreBanner';
    banner.style.position = 'fixed';
    banner.style.bottom = '0';
    banner.style.left = '0';
    banner.style.width = '100%';
    banner.style.backgroundColor = '#f0f0f0';
    banner.style.padding = '10px';
    banner.style.textAlign = 'center';
    banner.style.fontSize = '96px';
    banner.style.fontFamily = 'sans-serif';
    banner.style.fontWeight = 'bold';
    banner.style.borderTop = '2px solid #ccc';
    banner.style.zIndex = '1000';
    document.body.appendChild(banner);
    this.updateScoreBanner();
  }
  
  updateScoreBanner() {
    const banner = document.getElementById('scoreBanner');
    if (!banner) return;
    
    if (this.totalAttempts === 0) {
      banner.textContent = '';
      return;
    }
    
    const percentage = Math.round((this.correctAttempts / this.totalAttempts) * 100);
    
    // Determine grade based on percentage
    let grade;
    if (percentage >= 90) grade = 'A';
    else if (percentage >= 80) grade = 'B';
    else if (percentage >= 70) grade = 'C';
    else if (percentage >= 60) grade = 'D';
    else grade = 'F';
    
    banner.textContent = `${this.correctAttempts} / ${this.totalAttempts} = ${percentage}% [${grade}]`;
  }

  render(word, startHighlightIdx=-1, endHighlightIdx=-1, expectedChar=null) {
    const hash = Math.abs(hashCode(word))
    const hue = (hash % 360) + 220;
    const saturation = (hash % 23) + 50;
    const lightness = (hash % 3) + 95;
    const hideAfterHighlight = this.level === 4;
    this.wordCard.render(word, startHighlightIdx, endHighlightIdx, hue, saturation, lightness, hideAfterHighlight, this.level, expectedChar, this.showFingers, this.sentenceMode);
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
      // Reset score at the start of each new word/sentence
      if (this.sentenceMode && dialogue.isFirstOfWord) {
        this.correctAttempts = 0;
        this.totalAttempts = 0;
        this.updateScoreBanner();
      }
      
      // Track correct attempt in sentence mode
      if (this.sentenceMode && dialogue.expectedKey && normalFlow) {
        this.correctAttempts++;
        this.totalAttempts++;
        this.updateScoreBanner();
      }
      
      this.dialogueIdx = (this.dialogueIdx + 1) % this.dialogues.length;
      const nextDialogue = this.dialogues[this.dialogueIdx];
      
      // Set up voices: first voice is default, second voice is male
      const allVoices = window.speechSynthesis.getVoices();
      const defaultVoice = allVoices[0]; // First voice as default
      
      // Try to find a good male voice
      const maleVoice = allVoices.find(v =>
        v.name.includes("Google US English") ||
        v.name.includes("David") ||
        v.name.includes("Daniel") ||
        v.name.toLowerCase().includes("male")
      );
      
      // Fallback to en-AU voices if no male voice found
      let secondVoice = maleVoice;
      if (!secondVoice) {
        let fallbackVoices = allVoices.filter(voice => voice.lang === 'en-AU');
        if (fallbackVoices.length === 0) {
          fallbackVoices = allVoices.filter(voice => voice.lang === 'en-US');
        }
        if (fallbackVoices.length > 0) {
          secondVoice = fallbackVoices[1] || fallbackVoices[0];
        } else {
          secondVoice = defaultVoice;
        }
      }
      
      const goodVoices = [secondVoice, defaultVoice];
      const voice = goodVoices[nextDialogue.voiceIdx % goodVoices.length];
      const renderFunc = _ => {
        const expectedChar = (this.level === 3 || this.level === 4) && nextDialogue.expectedKey ? nextDialogue.expectedKey : null;
        this.render(nextDialogue.display, nextDialogue.startHighlightIdx, nextDialogue.endHighlightIdx, expectedChar);
      };
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
      // Track incorrect attempt in sentence mode
      if (this.sentenceMode && dialogue.expectedKey && normalFlow) {
        this.totalAttempts++;
        this.updateScoreBanner();
      }
      
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

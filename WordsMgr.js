
const scriptTypes = [
  'what_question',
  'what_answer',
  'spell_question',
  'spell_answer',
];


export class WordsMgr {
  constructor(wordCard, words) {
    this.wordCard = wordCard;
    this.words = words;
    this.charIdx = 0;
    this.wordIdx = 0;
    this.scriptIdx = 0;
    this.isBusyActing = false;
  }
  async act() {
    this.isBusyActing = true;

    const word = this.words[this.wordIdx];
    const hash = Math.abs(hashCode(word))
    const hue = (hash % 360) + 220;
    const saturation = (hash % 23) + 50;
    const lightness = (hash % 3) + 95;
    let highlightedCharIdx = -1;
    
    let utterance = '';
    switch(scriptTypes[this.scriptIdx]) {
      case 'what_question':
        utterance = 'What is this?';
        break;
      case 'what_answer':
        utterance = word;
        break;
      case 'spell_question':
        utterance = `How do you spell, ${word}?`;
        break;
      case 'spell_answer':
        utterance = word.split('').join(', ') + `; ${word}`;
        break;
    }
    this.wordCard.render(word, highlightedCharIdx, hue, saturation, lightness);

    let goodVoices = window.speechSynthesis.getVoices().filter(voice => voice.lang === 'en-US')
    goodVoices = goodVoices.slice(0, 2);
    await utter(utterance, 0, 0.7, goodVoices[this.scriptIdx % goodVoices.length]);
    this.isBusyActing = false;
  }
  async move() {
    if (this.isBusyActing) {
      return;
    }

    await this.act();

    if (this.scriptIdx + 1 >= scriptTypes.length) {
      this.scriptIdx = 0;
      this.wordIdx = (this.wordIdx + 1) % this.words.length;
    } else {
      this.scriptIdx += 1;
    }
  }
}

async function utter(sentence, delayMs = 0, rate = 0.4, voice = null) {
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


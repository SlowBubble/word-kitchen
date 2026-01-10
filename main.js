import { WordCard } from './WordCardComponent.js';
import { getUrlParamsMap } from "./url.js";
import { sanitizeName } from "./sanitizeName.js";
import { WordsMgr } from './WordsMgr2.js';

main();

function main() {
  const paramsMap = getUrlParamsMap();
  let lowerCase = false;
  let gameLevel = 1;
  let showFingers = true; // Default to true
  let sentenceMode = false;
  let caseSensitive = true; // Default to true
  let words = [];
  paramsMap.forEach((value, key) => {
    const possName = sanitizeName(value);
    if (!possName || !key) {
      return;
    }
    if (key === 'lower_case') {
      lowerCase = true;
      return;
    }
    if (key === 'game_level') {
      gameLevel = parseInt(value) || 1;
      return;
    }
    if (key === 'show_fingers') {
      showFingers = value.toLowerCase() !== 'false'; // false only if explicitly set to 'false'
      return;
    }
    if (key === 'sentence') {
      sentenceMode = value === '1';
      return;
    }
    if (key === 'case_sensitive') {
      caseSensitive = value !== 'false'; // false only if explicitly set to 'false'
      return;
    }
    words.push(key);
  });
  
  // Create sentence mode toggle checkbox
  createSentenceModeToggle(sentenceMode);
  
  // Create case sensitive toggle checkbox
  createCaseSensitiveToggle(caseSensitive);
  
  const wordCard = new WordCard();
  document.body.appendChild(wordCard);

  if (words.length === 0) {
    if (sentenceMode) {
      words = [
        'This is my school.',
        'I love music class.',
        'I love art class.',
        'I love math centers.',
        'I love stories.',
        'I played with my friends.',
      ];
    } else {
      words = [
        'Car',
        'Mom',
        'Dad',
        'Mama',
        'Papa',
        'Dog',
        'Cat',
        'Bingo',
      ];
    }
  }
  words = words.map(word => {
    if (lowerCase) {
      return word.toLowerCase();
    }
    return capitalizeFirstLetter(word);
  })

  shuffleArray(words);
  const wordsMgr = new WordsMgr(wordCard, words, gameLevel, showFingers, sentenceMode, caseSensitive);

  setupKeyboardControl(wordsMgr);
}

function setupKeyboardControl(wordsMgr) {
  const pressedKeys = new Set();
  document.body.onkeydown = evt => {
    if (evt.ctrlKey || evt.altKey || evt.metaKey) {
      return;
    }
    // Ignore modifier keys like Shift, Control, Alt, etc.
    if (evt.key === 'Shift' || evt.key === 'Control' || evt.key === 'Alt' || evt.key === 'Meta' || evt.key === 'CapsLock' || evt.key === 'Tab') {
      return;
    }
    if (pressedKeys.has(evt.key)) {
      return;
    }
    pressedKeys.add(evt.key);
    wordsMgr.execute(evt.key);
  };
  document.body.onkeyup = evt => {
    pressedKeys.delete(evt.key);
  };
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createCaseSensitiveToggle(initialState) {
  const toggleContainer = document.createElement('div');
  toggleContainer.style.position = 'fixed';
  toggleContainer.style.top = '60px'; // Position below sentence mode toggle
  toggleContainer.style.right = '10px';
  toggleContainer.style.zIndex = '1000';
  toggleContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  toggleContainer.style.padding = '8px 12px';
  toggleContainer.style.borderRadius = '6px';
  toggleContainer.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
  toggleContainer.style.fontFamily = 'Arial, sans-serif';
  toggleContainer.style.fontSize = '14px';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'caseSensitiveToggle';
  checkbox.checked = initialState;
  checkbox.style.marginRight = '6px';
  
  const label = document.createElement('label');
  label.htmlFor = 'caseSensitiveToggle';
  label.textContent = 'Case Sensitive';
  label.style.cursor = 'pointer';
  label.style.userSelect = 'none';
  
  toggleContainer.appendChild(checkbox);
  toggleContainer.appendChild(label);
  
  checkbox.addEventListener('change', function() {
    const currentUrl = new URL(window.location);
    if (this.checked) {
      currentUrl.searchParams.set('case_sensitive', 'true');
    } else {
      currentUrl.searchParams.set('case_sensitive', 'false');
    }
    window.location.href = currentUrl.toString();
  });
  
  document.body.appendChild(toggleContainer);
}

function createSentenceModeToggle(initialState) {
  const toggleContainer = document.createElement('div');
  toggleContainer.style.position = 'fixed';
  toggleContainer.style.top = '10px';
  toggleContainer.style.right = '10px';
  toggleContainer.style.zIndex = '1000';
  toggleContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  toggleContainer.style.padding = '8px 12px';
  toggleContainer.style.borderRadius = '6px';
  toggleContainer.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
  toggleContainer.style.fontFamily = 'Arial, sans-serif';
  toggleContainer.style.fontSize = '14px';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'sentenceModeToggle';
  checkbox.checked = initialState;
  checkbox.style.marginRight = '6px';
  
  const label = document.createElement('label');
  label.htmlFor = 'sentenceModeToggle';
  label.textContent = 'Sentence Mode';
  label.style.cursor = 'pointer';
  label.style.userSelect = 'none';
  
  toggleContainer.appendChild(checkbox);
  toggleContainer.appendChild(label);
  
  checkbox.addEventListener('change', function() {
    const currentUrl = new URL(window.location);
    if (this.checked) {
      currentUrl.searchParams.set('sentence', '1');
    } else {
      currentUrl.searchParams.delete('sentence');
    }
    window.location.href = currentUrl.toString();
  });
  
  document.body.appendChild(toggleContainer);
}


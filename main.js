import { WordCard } from './WordCardComponent.js';
import { getUrlParamsMap } from "./url.js";
import { sanitizeName } from "./sanitizeName.js";
import { WordsMgr } from './WordsMgr2.js';

main();

function main() {
  const paramsMap = getUrlParamsMap();
  let lowerCase = false;
  let gameLevel = 1;
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
    words.push(key);
  });
  const wordCard = new WordCard();
  document.body.appendChild(wordCard);

  if (words.length === 0) {
    words = [
    'Car',
    'Mom',
    'Dad',
    // 'Daddy',
    'Mommy',
    'Over',
    'Mama',
    'Papa',
    // 'Papaya',
    'Dog',
    'Cat',
    'Emma',
    // 'Jacob',
    'Bingo',
    ];
  }
  words = words.map(word => {
    if (lowerCase) {
      return word.toLowerCase();
    }
    return capitalizeFirstLetter(word);
  })

  shuffleArray(words);
  const wordsMgr = new WordsMgr(wordCard, words, gameLevel);

  setupKeyboardControl(wordsMgr);
}

function setupKeyboardControl(wordsMgr) {
  const pressedKeys = new Set();
  document.body.onkeydown = evt => {
    if (evt.ctrlKey || evt.altKey || evt.metaKey) {
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


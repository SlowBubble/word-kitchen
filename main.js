import { WordCard } from './WordCardComponent.js';
import { getUrlParamsMap } from "./url.js";
import { sanitizeName } from "./sanitizeName.js";
import { WordsMgr } from './WordsMgr.js';

main();

function main() {
  const paramsMap = getUrlParamsMap();
  let shouldCapitalize = false;
  let words = [];
  paramsMap.forEach((value, key) => {
    const possName = sanitizeName(value);
    if (!possName || !key) {
      return;
    }
    if (key === 'capitalize') {
      shouldCapitalize = true;
      return;
    }
    words.push(key);
  });
  const wordCard = new WordCard();
  document.body.appendChild(wordCard);

  if (words.length === 0) {
    words = [
    'baby',
    'Google',
    'mom',
    'dad',
    'grandpa',
    'wolf',
    'pig',
    ];
  }
  words = words.map(word => {
    if (shouldCapitalize) {
      return capitalizeFirstLetter(word);
    }
    return word;
  })

  shuffleArray(words);
  const wordsMgr = new WordsMgr(wordCard, words);

  setupKeyboardControl(wordsMgr);
}

function setupKeyboardControl(wordsMgr) {
  document.body.onkeyup = evt => {
    if (evt.key == " ") {
      wordsMgr.move();
    }
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

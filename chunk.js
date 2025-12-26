main();

function main() {
  // Combined word list
  const allWords = [
    'Ba|na|na',
    'Ma|ma',
    'Pa|pa',
    'Pa|pa|ya',
    'So|fa',
    'Ro|sa',
    'Ba|by',
    'La|dy',
    'Po|ny',
    'Si|ri',
    'Ca|fe',
    'To|ma|to',
    'Po|ta|to',
    'Ge|la|to',
    'Ai|ki|do',
    'A|vo|ca|do',
    'To|fu',
    'Ti|ra|mi|su',
    'Ta|ble',
    'Ca|ble',
    'Ap|ple',
    'Ma|ple',
    'Hip|po',
    'Wa|ter',
    'La|ter',
    'Loi|ter',
    'Mo|tor',
  ];
  
  // Create randomize checkbox
  const checkboxContainer = document.createElement('div');
  checkboxContainer.style.position = 'absolute';
  checkboxContainer.style.top = '20px';
  checkboxContainer.style.right = '20px';
  checkboxContainer.style.fontSize = '18px';
  checkboxContainer.style.fontFamily = 'sans-serif';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'randomizeCheckbox';
  checkbox.style.marginRight = '8px';
  
  const label = document.createElement('label');
  label.htmlFor = 'randomizeCheckbox';
  label.textContent = 'Randomize';
  
  checkboxContainer.appendChild(checkbox);
  checkboxContainer.appendChild(label);
  document.body.appendChild(checkboxContainer);
  
  // Get initial randomize state from URL
  const urlParams = new URLSearchParams(window.location.search);
  const shouldRandomize = urlParams.get('randomize') === 'true';
  checkbox.checked = shouldRandomize;
  
  function getWords() {
    const words = [...allWords]; // Create a copy
    if (checkbox.checked) {
      // Randomize word order using Fisher-Yates shuffle
      for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
      }
    }
    return words;
  }
  
  // Initial setup
  let gameInstance = setupGame(getWords());
  
  // Handle checkbox change
  checkbox.addEventListener('change', () => {
    // Reset the game with new word order
    gameInstance = setupGame(getWords());
  });
}

// Game logic:
// 1. When the user press space, the game will display the first word (with no space in between the letters, even across chunks) and underline each chunk of the word, and ask the user: `How do you spell the word, ${word}?`
// 2. When the user press space again, the game will spell the word in chunks and then utter the word (e.g. "B", "A", pause 900ms, "B" "Y", pause 900ms, "Baby").
// 3. When the user press space again, the game will display the next word and repeats.
// Implementation details:
// - Use Canvas to display the word with font size 120px.
function setupGame(words) {
  // Clear any existing canvas
  const existingCanvas = document.querySelector('canvas');
  if (existingCanvas) {
    existingCanvas.remove();
  }
  
  let currentWordIndex = 0;
  let spellingState = 'initial'; // states: 'initial', 'whatIsThis', 'display', 'spell', 'gameOver'
  let isSpeaking = false; // Add speaking state
  
  // Create Canvas
  const canvas = document.createElement('canvas');
  canvas.width = 1000;
  canvas.height = 200;
  canvas.style.position = 'absolute';
  canvas.style.top = '300px';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  ctx.font = '120px sans-serif';
  
  function displayWord(word, highlightChunkIndex = -1, highlightAll = false) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const chunks = word.split('|');
    let xPos = 50;
    
    // Measure total width to center the word
    const totalWidth = ctx.measureText(word.replace(/\|/g, '')).width;
    xPos = (canvas.width - totalWidth) / 2;
    
    chunks.forEach((chunk, i) => {
      // Draw text
      const chunkWidth = ctx.measureText(chunk).width;
      ctx.fillStyle = highlightAll ? 'blue' : (i === highlightChunkIndex ? 'blue' : 'black');
      ctx.fillText(chunk, xPos, 100);
      
      // Draw underline with gaps
      ctx.beginPath();
      ctx.moveTo(xPos + 5, 120);
      ctx.lineTo(xPos + chunkWidth - 5, 120);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 4;
      ctx.stroke();
      
      xPos += chunkWidth + 15; // Add 15px spacing between chunks
    });
  }

  async function speak(text, rate=0.5) {
    isSpeaking = true;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
    return new Promise(resolve => {
      utterance.onend = () => {
        isSpeaking = false;
        resolve();
      };
    });
  }

  async function spellWord(word) {
    const chunks = word.split('|');
    
    for (let i = 0; i < chunks.length; i++) {
      displayWord(word, i);
      let letters = chunks[i].toUpperCase().split('')
      if (letters.length === 1) {
        letters = letters.map(char => {
          return char === 'A' ? 'eh' : char;
        });
      }
      console.log(letters)
      await speak(letters.join(' '));
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    
    displayWord(word, -1, true); // Highlight full word
    await speak(word.replace(/\|/g, ''));
    displayWord(word, -1, false); // Reset highlight
  }

  function displayInstructions() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    const originalFont = ctx.font;
    ctx.font = '48px sans-serif';
    ctx.fillText('Press space to play', canvas.width/2 - 150, 100);
    ctx.font = originalFont;
  }

  function displayGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    const originalFont = ctx.font;
    ctx.font = '96px sans-serif';
    ctx.fillText('Game Over', canvas.width/2 - 100, 100);
    ctx.font = originalFont;
  }

  displayInstructions(); // Show initial instructions

  // Remove existing event listener if any
  if (window.gameKeyHandler) {
    document.removeEventListener('keydown', window.gameKeyHandler);
  }

  // Create new event handler
  window.gameKeyHandler = async (event) => {
    if (event.code === 'Space' && !isSpeaking) {
      if (currentWordIndex >= words.length) {
        if (spellingState !== 'gameOver') {
          spellingState = 'gameOver';
          displayGameOver();
          await speak('Game time is over. Go take a break!');
        }
        return;
      }

      const currentWord = words[currentWordIndex];
      
      if (spellingState === 'initial') {
        spellingState = 'whatIsThis';
        displayWord(currentWord);
        await speak(`What word is this?`);
      } else if (spellingState === 'whatIsThis') {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Hide the word
        await speak(`How do you spell the word, ${currentWord.replace(/\|/g, '')}?`);
        spellingState = 'spell';
      } else if (spellingState === 'display') {
        spellingState = 'whatIsThis';
        displayWord(currentWord);
        await speak(`What word is this?`);
      } else if (spellingState === 'spell') {
        await spellWord(currentWord);
        currentWordIndex++;
        spellingState = 'display';
      }
    }
  };
  
  // Add the new event listener
  document.addEventListener('keydown', window.gameKeyHandler);
}

import { getFingerForChar } from './fingerMapping.js';

export class WordCard extends HTMLElement {
  constructor() {
    super();
  }

  render(word, startHighlightIdx = -1, endHighlightIdx = -1, hue = 100, saturation = 100, lightness = 100, hideAfterHighlight = false, gameLevel = 1, expectedChar = null, showFingers = true, sentenceMode = false) {
    let annotatedChars;
    if (hideAfterHighlight && endHighlightIdx >= 0) {
      annotatedChars = word.split('').map((char, idx) => {
        if (idx >= endHighlightIdx) return '<span style="visibility:hidden">_</span>';
        if (startHighlightIdx <= idx && idx < endHighlightIdx) return `<span style='color:red'>${char}</span>`;
        return char;
      });
    } else {
      annotatedChars = word.split('').map((char, idx) => startHighlightIdx <= idx && idx <= endHighlightIdx ? `<span style='color:red'>${char}</span>` : char);
    }
    
    // Show finger guidance for levels 3 and 4 when expecting a character and showFingers is true
    const showFingerGuidance = (gameLevel === 3 || gameLevel === 4) && expectedChar && showFingers;
    let fingerGuidanceHtml = '';
    
    if (showFingerGuidance) {
      fingerGuidanceHtml = generateFingerGuidanceHtml(expectedChar);
    }
    
    this.innerHTML = genHtml(annotatedChars.join(''), hue, saturation, lightness, fingerGuidanceHtml, sentenceMode);
  }
}

function generateFingerGuidanceHtml(expectedChar) {
  const fingerInfo = getFingerForChar(expectedChar);
  if (!fingerInfo) return '';
  
  const leftFingers = [];
  const rightFingers = [];
  
  // Generate 5 fingers for each hand
  for (let i = 0; i < 5; i++) {
    const isLeftActive = fingerInfo.hand === 'left' && fingerInfo.finger === i;
    const isRightActive = fingerInfo.hand === 'right' && fingerInfo.finger === i;
    
    leftFingers.push(`
      <div class="finger ${isLeftActive ? 'active' : ''}" data-finger="${i}">
        <div class="finger-tip"></div>
        <div class="finger-body"></div>
      </div>
    `);
    
    rightFingers.push(`
      <div class="finger ${isRightActive ? 'active' : ''}" data-finger="${i}">
        <div class="finger-tip"></div>
        <div class="finger-body"></div>
      </div>
    `);
  }
  
  // Reverse left hand fingers to show pinky to thumb (left to right)
  leftFingers.reverse();
  
  return `
    <div class="finger-guidance">
      <div class="hand left-hand">
        <div class="fingers">
          ${leftFingers.join('')}
        </div>
      </div>
      <div class="hand right-hand">
        <div class="fingers">
          ${rightFingers.join('')}
        </div>
      </div>
    </div>
  `;
}

// 20-220 are boys color
// 60-100
// 80-95
const genHtml = (sentenceHtml, hue = 100, saturation = 100, lightness = 100, fingerGuidanceHtml = '', sentenceMode = false) => `
<style>
#story-card {
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsl(${hue}, ${saturation}%, ${lightness}%);
  width: 990px;
  height: 500px;
  font-family: Verdana, sans-serif;
  font-size: ${sentenceMode ? '80px' : '160px'};
  border: solid 2px black;
  position: relative;
}

.word-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.finger-guidance {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.9);
  border-top: 2px solid #333;
  font-size: 16px;
}

.hand {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fingers {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.finger {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.finger-tip {
  width: 32px;
  height: 35px;
  background: #ddd;
  border-radius: 16px 16px 8px 8px;
  border: 3px solid #999;
}

.finger-body {
  width: 28px;
  height: 40px;
  background: #ddd;
  border: 3px solid #999;
  border-top: none;
  border-radius: 0 0 8px 8px;
}

.finger[data-finger="0"] .finger-tip { width: 28px; height: 18px; opacity: 0.3; } /* thumb - fatter but low */
.finger[data-finger="0"] .finger-body { width: 24px; height: 15px; opacity: 0.3; } /* thumb - fatter but low */
.finger[data-finger="1"] .finger-body { height: 45px; } /* index */
.finger[data-finger="2"] .finger-body { height: 50px; } /* middle */
.finger[data-finger="3"] .finger-body { height: 45px; } /* ring */
.finger[data-finger="4"] .finger-body { height: 35px; } /* pinky */

.finger.active .finger-tip,
.finger.active .finger-body {
  background: #ff6b6b;
  border-color: #d63031;
  animation: pulse 1s infinite;
  opacity: 1 !important; /* Override thumb opacity when active */
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
</style>
<div id='story-card'>
  <div class='word-content'>
    <div>${sentenceHtml}</div>
  </div>
  ${fingerGuidanceHtml}
</div>
`;

customElements.define('word-card', WordCard);

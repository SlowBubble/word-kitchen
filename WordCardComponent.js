export class WordCard extends HTMLElement {
  constructor() {
    super();
  }

  render(word, startHighlightIdx = -1, endHighlightIdx = -1, hue = 100, saturation = 100, lightness = 100, hideAfterHighlight = false) {
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
    this.innerHTML = genHtml(annotatedChars.join(''), hue, saturation, lightness);
  }
}

// 20-220 are boys color
// 60-100
// 80-95
const genHtml = (sentenceHtml, hue = 100, saturation = 100, lightness = 100) => `
<style>
#story-card {
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsl(${hue}, ${saturation}%, ${lightness}%);
  width: 990px;
  height: 500px;
  font-family: Verdana, sans-serif;
  font-size: 160px;
  border: solid 2px black;
}
</style>
<div id='story-card'>
 <div>${sentenceHtml}</div>
</div>
`;

customElements.define('word-card', WordCard);

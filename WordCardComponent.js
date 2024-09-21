
export class WordCard extends HTMLElement {
  constructor() {
    super();
  }

  render(word, highlightedCharIdx = -1, hue = 100, saturation = 100, lightness = 100) {
    const annotatedChars = word.split('').map((char, idx) => idx === highlightedCharIdx ? `<span style='color:red'>${word}</span>` : char);
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

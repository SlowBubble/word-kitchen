// Finger mapping for QWERTY keyboard layout
// Each letter maps to: { hand: 'left'|'right', finger: 0-4 (thumb to pinky) }

export const fingerMapping = {
  // Left hand
  'q': { hand: 'left', finger: 4 },   // pinky
  'w': { hand: 'left', finger: 3 },   // ring
  'e': { hand: 'left', finger: 2 },   // middle
  'r': { hand: 'left', finger: 1 },   // index
  't': { hand: 'left', finger: 1 },   // index
  
  'a': { hand: 'left', finger: 4 },   // pinky
  's': { hand: 'left', finger: 3 },   // ring
  'd': { hand: 'left', finger: 2 },   // middle
  'f': { hand: 'left', finger: 1 },   // index
  'g': { hand: 'left', finger: 1 },   // index
  
  'z': { hand: 'left', finger: 3 },   // ring
  'x': { hand: 'left', finger: 2 },   // middle
  'c': { hand: 'left', finger: 1 },   // index
  'v': { hand: 'left', finger: 1 },   // index
  'b': { hand: 'left', finger: 1 },   // index
  
  // Right hand
  'y': { hand: 'right', finger: 1 },  // index
  'u': { hand: 'right', finger: 1 },  // index
  'i': { hand: 'right', finger: 2 },  // middle
  'o': { hand: 'right', finger: 3 },  // ring
  'p': { hand: 'right', finger: 4 },  // pinky
  
  'h': { hand: 'right', finger: 1 },  // index
  'j': { hand: 'right', finger: 1 },  // index
  'k': { hand: 'right', finger: 2 },  // middle
  'l': { hand: 'right', finger: 3 },  // ring
  
  'n': { hand: 'right', finger: 1 },  // index
  'm': { hand: 'right', finger: 1 },  // index
  
  // Space bar (both thumbs, but we'll default to right)
  ' ': { hand: 'right', finger: 0 },  // thumb
};

// Get finger info for a character
export function getFingerForChar(char) {
  const lowerChar = char.toLowerCase();
  return fingerMapping[lowerChar] || null;
}
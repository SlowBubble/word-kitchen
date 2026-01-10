
# m2c

# m2b
- for sentence mode, when highlighting the letter you need to type in red, also highlight all previous things in red.
- for space, highlight it only when you need to type it, by using a 0.5 opaque red rectangle that fills that space.

# m2a
- In main.js, add a query param for sentence=1 and a checkbox on the upper right to toggle it
  - When enabled, instead of the default word list, let's use this list of sentences
    - "This is my school"
    - "I love music class"
    - "I love art class"
    - "I love math centers"
    - "I love stories"

# m1a

- For game level 3 and 4, when a certain letter is expected to be typed, I would like to display 5 fingers on the left side and 5 fingers on the right side at the bottom of the card, and then show which finger the user is supposed to use to type that letter.

# m1b
- In chunk.js, ask "What is this?" as the question, before following up with "How do you spell ...".

# m1c
- In chunk.js, add a few more stages between "What word is this?" and "How do you spell ...".
- E.g. If the word is "ma-ple", add these stages
  - When space is pressed, utter "ma"
  - When space is pressed, utter "ple"
  - When space is pressed, utter "maple".
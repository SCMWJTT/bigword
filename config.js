// Bigword settings. Edit this file while testing.
// Board: T = triple word, D = double word, t = triple letter, d = double letter,
// * = centre star (double word), . = plain square. Row 0 is the top.
window.CONFIG = {
  name: "Bigword",
  rackSize: 8,
  bingo: 50,
  board: [
    "T...t...T...t...T",
    ".D...d.....d...D.",
    "..D...t...t...D..",
    "...D...d.d...D...",
    "t...D...d...D...t",
    ".d...D.....D...d.",
    "..t...t...t...t..",
    "...d...d.d...d...",
    "T...d...*...d...T",
    "...d...d.d...d...",
    "..t...t...t...t..",
    ".d...D.....D...d.",
    "t...D...d...D...t",
    "...D...d.d...D...",
    "..D...t...t...D..",
    ".D...d.....d...D.",
    "T...t...T...t...T"
  ],
  // Tiles in the bag. ? = blank.
  bag: {
    A:12, B:2, C:3, D:7, E:16, F:2, G:3, H:3, I:9, J:1, K:1, L:5, M:3,
    N:9, O:8, P:3, Q:1, R:9, S:9, T:9, U:3, V:2, W:2, X:1, Y:2, Z:1, "?":4
  },
  // Letter values. A blank scores 0.
  values: {
    A:1, B:3, C:3, D:2, E:1, F:4, G:2, H:4, I:1, J:8, K:5, L:1, M:3,
    N:1, O:1, P:3, Q:10, R:1, S:1, T:1, U:1, V:4, W:4, X:8, Y:4, Z:10
  }
};

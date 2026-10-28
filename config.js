// Bigword settings. Edit this file while testing.
// Board: T = triple word, D = double word, t = triple letter, d = double letter,
// * = centre star (double word), . = plain square. Row 0 is the top.
window.CONFIG = {
  name: "Bigword",
  rackSize: 8,
  bingo: 100,
  // Help my luck. pairs = pairs of the same letter always allowed in a rack, pairChance = % chance a draw may allow one pair,
  // vmin/vmax = hard limits on vowels in a rack (a blank counts as either), vowelPct = soft target share of vowels (0 = off),
  // tierW = draw weight for tile tiers 1-4 (see tiers below), maxHigh = most tier 3-4 tiles allowed in a rack.
  luck: { pairs: 0, pairChance: 10, vmin: 3, vmax: 4, vowelPct: 44, tierW: [1, 1, 1, 1], maxHigh: 8 },
  // Testing options (also on the developer page).
  dev: { confirmRestart: false, noSBlank: false },
  // Tile tiers: 1 = super common, 2 = common, 3 = mid, 4 = rare.
  tiers: { R:1, S:1, T:1, N:1, E:1, A:1, D:2, G:2, I:2, L:2, O:2, U:2, C:2, M:2, H:2, B:3, F:3, P:3, W:3, Y:3, K:3, V:3, J:4, X:4, Q:4, Z:4 },
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

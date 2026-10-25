# Bigword skins (themed boards)

A skin is a folder inside `skins/` with one file, `skin.json`, plus optional picture files.
The game never needs new code for a new skin.

## To add a skin
1. Make a folder: `skins/<id>/` (for example `skins/trinidad/`). Use lowercase letters, no spaces.
2. Put `skin.json` in it (copy `skins/island/skin.json` and edit).
3. Optional pictures in the same folder: `tw.svg`, `dw.svg`, `tl.svg`, `dl.svg` (square icons, 80 x 80 px, SVG or PNG with transparent background), and `board.jpg` (a 1360 x 1360 px background, shows through squares whose colour is "transparent").
4. Add one line to `skins/index.json`: `{ "id": "trinidad", "name": "Trinidad" }`
5. Commit and push. Pick the skin in Settings, Board skin.

## skin.json fields (all optional, anything left out uses the Classic look)
- `boardBg`: colour behind the board. `boardImage`: file name of a full board picture. `line`: grid line colour.
- `plain`, `tw`, `dw`, `tl`, `dl`, `st`: one entry per square type (plain, triple word, double word, triple letter, double letter, centre star).
  Each can have `bg` (colour), `fg` (text colour), `label` (text or emoji shown on the square), `image` (file name of an icon).
- `tile`: tile look when Settings, Tile style is "Skin default": `bg`, `fg`, `border`, `radius`.

## What stays the same in every skin (so players are never confused)
- Every premium square always shows its small standard marker (TW, DW, TL, DL) in the corner when it uses a custom label or icon.
- Keep the colour families: triple word = red/orange, double word = pink, triple letter = dark blue/green, double letter = light blue.
- The star stays in the centre and the premium positions are always the same (they come from config.js).

// Bigword developer page. Temporary: delete this file (and its line in index.html and sw.js) when tuning is finished.
(function () {
  const C = window.CONFIG, KEY = 'bigword_dev', LET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ?', VOW = 'AEIOU';
  const orig = JSON.parse(JSON.stringify({ bag: C.bag, values: C.values, bingo: C.bingo, luck: C.luck || { pairs: 0, pairChance: 10, vmin: 3, vmax: 4 } }));
  C.luck = C.luck || orig.luck; if (C.luck.pairChance == null) C.luck.pairChance = 10;
  let active = false;
  try {
    const o = JSON.parse(localStorage.getItem(KEY));
    if (o) { active = true; if (o.bag) C.bag = o.bag; if (o.values) C.values = o.values; if (o.bingo != null) C.bingo = o.bingo; if (o.luck) C.luck = o.luck; }
  } catch (e) {}

  const $ = id => document.getElementById(id);
  const ov = document.createElement('div'); ov.className = 'ov'; ov.id = 'dev';
  let rows = '';
  for (let i = 0; i < 27; i += 3) {
    rows += '<tr>';
    for (let k = i; k < i + 3; k++) {
      const ch = LET[k];
      rows += '<td><b>' + (ch === '?' ? 'blank' : ch) + '</b></td><td><input id="dc' + k + '" type="number" min="0" max="40" style="width:44px"></td>' +
        '<td>' + (ch === '?' ? '0' : '<input id="dv' + k + '" type="number" min="0" max="30" style="width:44px">') + '</td>';
    }
    rows += '</tr>';
  }
  ov.innerHTML = '<div class="box" style="width:min(97vw,430px)"><b>Developer</b>' +
    '<small id="dvNote"></small>' +
    '<table><tr><td></td><td>count</td><td>value</td><td></td><td>count</td><td>value</td><td></td><td>count</td><td>value</td></tr>' + rows + '</table>' +
    '<div id="dvTot"></div>' +
    '<table><tr><td>Bingo bonus</td><td><input id="dBingo" type="number" style="width:60px"></td></tr>' +
    '<tr><td>Pairs always allowed in a rack</td><td><input id="dPairs" type="number" min="0" max="4" style="width:60px"></td></tr>' +
    '<tr><td>Chance (%) a draw may allow one pair</td><td><input id="dPc" type="number" min="0" max="100" style="width:60px"></td></tr>' +
    '<tr><td>Fewest vowels</td><td><input id="dVmin" type="number" min="0" max="8" style="width:60px"></td></tr>' +
    '<tr><td>Most vowels</td><td><input id="dVmax" type="number" min="0" max="8" style="width:60px"></td></tr></table>' +
    '<button id="dTest">Test draws (1,000 racks)</button><div id="dOut"></div>' +
    '<button id="dSave">Save (counts apply to new games)</button><button id="dReset">Reset to config.js</button>' +
    '<button id="dCopy">Show text for config.js</button><textarea id="dText" rows="8" style="display:none;width:100%;font-size:12px"></textarea>' +
    '<button id="dClose">Close</button></div>';
  document.body.appendChild(ov);
  const mb = document.createElement('button'); mb.textContent = 'Developer';
  const box = document.querySelector('#menu .box'); box.insertBefore(mb, $('mClose'));

  function fill() {
    LET.split('').forEach((ch, k) => { $('dc' + k).value = C.bag[ch] || 0; if (ch !== '?') $('dv' + k).value = C.values[ch] || 0; });
    $('dBingo').value = C.bingo; $('dPairs').value = C.luck.pairs; $('dPc').value = C.luck.pairChance; $('dVmin').value = C.luck.vmin; $('dVmax').value = C.luck.vmax;
    $('dvNote').textContent = active ? 'Saved developer values are in use (they override config.js). Reset to go back to config.js.' : 'Using the values in config.js.';
    totals();
  }
  function read() {
    const bag = {}, values = {};
    LET.split('').forEach((ch, k) => { bag[ch] = Math.max(0, +$('dc' + k).value || 0); if (ch !== '?') values[ch] = Math.max(0, +$('dv' + k).value || 0); });
    return { bag, values, bingo: +$('dBingo').value || 0,
             luck: { pairs: +$('dPairs').value || 0, pairChance: +$('dPc').value || 0, vmin: +$('dVmin').value || 0, vmax: +$('dVmax').value || 0 } };
  }
  function totals() {
    const d = read(); let t = 0, v = 0;
    for (const ch in d.bag) { t += d.bag[ch]; if (VOW.includes(ch)) v += d.bag[ch]; }
    const b = d.bag['?'] || 0, c = t - v - b;
    $('dvTot').textContent = 'Total ' + t + ' tiles. Vowels ' + v + ' (' + (t - b ? Math.round(v / (t - b) * 100) : 0) + '% of letters), consonants ' + c + ', blanks ' + b + '.';
  }
  ov.addEventListener('input', totals);

  function simulate(d, flags, n) {
    const base = []; for (const ch in d.bag) for (let i = 0; i < d.bag[ch]; i++) base.push(ch);
    const m = { v: 0, v34: 0, pairs: 0, anyPair: 0, trip: 0, hard2: 0, blanks: 0, anyBlank: 0, pts: 0 };
    for (let k = 0; k < n; k++) {
      const bag = base.slice(); for (let i = bag.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [bag[i], bag[j]] = [bag[j], bag[i]]; }
      const rack = [];
      for (let i = 0; i < C.rackSize; i++) { const ch = window.BW.pickTile(bag, rack, C.rackSize - 1 - i, flags, d.luck); bag.splice(bag.indexOf(ch), 1); rack.push({ ch }); }
      const cnt = {}; let v = 0, bl = 0, hard = 0, pts = 0;
      rack.forEach(t => { if (t.ch === '?') { bl++; return; } cnt[t.ch] = (cnt[t.ch] || 0) + 1; if (VOW.includes(t.ch)) v++; if ('JQXZV'.includes(t.ch)) hard++; pts += d.values[t.ch] || 0; });
      const pr = Object.values(cnt).filter(x => x === 2).length, tr = Object.values(cnt).filter(x => x >= 3).length;
      m.v += v; if (v >= 3 && v <= 4) m.v34++; m.pairs += pr; if (pr || tr) m.anyPair++; if (tr) m.trip++;
      if (hard >= 2) m.hard2++; m.blanks += bl; if (bl) m.anyBlank++; m.pts += pts;
    }
    const pc = x => Math.round(x / n * 100) + '%', av = x => (x / n).toFixed(2);
    return [av(m.v), pc(m.v34), av(m.pairs), pc(m.anyPair), pc(m.trip), pc(m.hard2), av(m.blanks), pc(m.anyBlank), av(m.pts)];
  }
  $('dTest').onclick = () => {
    const d = read(); $('dOut').textContent = 'Testing...';
    setTimeout(() => {
      const off = simulate(d, { dup: false, bal: false, hard: false }, 1000), on = simulate(d, window.BW.luckFlags().dup || window.BW.luckFlags().bal || window.BW.luckFlags().hard ? window.BW.luckFlags() : { dup: true, bal: true, hard: true }, 1000);
      const names = ['Average vowels', 'Racks with 3-4 vowels', 'Average pairs per rack', 'Racks with any repeat', 'Racks with 3 of a kind', 'Racks with 2+ of J Q X Z V', 'Average blanks', 'Racks with a blank', 'Average rack points'];
      let h = '<table><tr><td></td><td>Help off</td><td>Help on</td></tr>';
      names.forEach((n, i) => { h += '<tr><td>' + n + '</td><td>' + off[i] + '</td><td>' + on[i] + '</td></tr>'; });
      $('dOut').innerHTML = h + '</table><small>Help on uses your current Help my luck checkboxes (all three if none are ticked).</small>';
    }, 30);
  };
  $('dSave').onclick = () => {
    const d = read(); C.bag = d.bag; C.values = d.values; C.bingo = d.bingo; C.luck = d.luck; active = true;
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
    fill(); $('dOut').textContent = 'Saved. Start a new game to use the new tile counts.';
  };
  $('dReset').onclick = () => {
    try { localStorage.removeItem(KEY); } catch (e) {}
    C.bag = JSON.parse(JSON.stringify(orig.bag)); C.values = JSON.parse(JSON.stringify(orig.values)); C.bingo = orig.bingo; C.luck = JSON.parse(JSON.stringify(orig.luck)); active = false;
    fill(); $('dOut').textContent = 'Back to config.js values.';
  };
  $('dCopy').onclick = () => {
    const d = read(), j = o => JSON.stringify(o).replace(/"/g, '').replace(/:/g, ':').replace(/,/g, ', ').replace(/\?:/, '"?":');
    const t = '  bingo: ' + d.bingo + ',\n  luck: { pairs: ' + d.luck.pairs + ', vmin: ' + d.luck.vmin + ', vmax: ' + d.luck.vmax + ' },\n  bag: ' + j(d.bag) + ',\n  values: ' + j(d.values) + '\n';
    const ta = $('dText'); ta.style.display = 'block'; ta.value = t; ta.select();
    try { navigator.clipboard.writeText(t); } catch (e) {}
  };
  $('dClose').onclick = () => ov.classList.remove('on');
  mb.onclick = () => { $('menu').classList.remove('on'); fill(); ov.classList.add('on'); };
})();

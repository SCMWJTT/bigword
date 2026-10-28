// Bigword developer page. Temporary: delete this file (and its line in index.html and sw.js) when tuning is finished.
(function () {
  const C = window.CONFIG, KEY = 'bigword_dev', LET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ?', VOW = 'AEIOU';
  const clone = o => JSON.parse(JSON.stringify(o));
  const DL = { pairs: 0, pairChance: 10, vmin: 3, vmax: 4, vowelPct: 44, tierW: [1, 1, 1, 1], maxHigh: 8 };
  const orig = clone({ bag: C.bag, values: C.values, bingo: C.bingo, luck: Object.assign({}, DL, C.luck || {}), tiers: C.tiers || {}, dev: Object.assign({ confirmRestart: false, noSBlank: false }, C.dev || {}) });
  C.luck = Object.assign({}, DL, C.luck || {}); C.dev = Object.assign({ confirmRestart: false, noSBlank: false }, C.dev || {}); C.tiers = C.tiers || {};
  let active = false;
  try {
    const o = JSON.parse(localStorage.getItem(KEY));
    if (o) {
      active = true;
      if (o.bag) C.bag = o.bag; if (o.values) C.values = o.values; if (o.bingo != null) C.bingo = o.bingo;
      if (o.luck) C.luck = Object.assign({}, DL, o.luck); if (o.tiers) C.tiers = o.tiers; if (o.dev) C.dev = Object.assign(C.dev, o.dev);
    }
  } catch (e) {}

  const $ = id => document.getElementById(id), inp = (id, w) => '<input id="' + id + '" type="number" style="width:' + (w || 44) + 'px">';
  const ov = document.createElement('div'); ov.className = 'ov'; ov.id = 'dev';
  let rows = '';
  for (let i = 0; i < 27; i += 2) {
    rows += '<tr>';
    for (let k = i; k < i + 2 && k < 27; k++) {
      const ch = LET[k];
      rows += '<td><b>' + (ch === '?' ? 'blank' : ch) + '</b></td><td>' + inp('dc' + k) + '</td><td>' + (ch === '?' ? '0' : inp('dv' + k)) + '</td><td>' + (ch === '?' ? '' : inp('dt' + k, 36)) + '</td>';
    }
    rows += '</tr>';
  }
  const row = (label, id, w) => '<tr><td>' + label + '</td><td>' + inp(id, w || 60) + '</td></tr>';
  ov.innerHTML = '<div class="box" style="width:min(97vw,440px)"><b>Developer</b><small id="dvNote"></small>' +
    '<table><tr><td></td><td>count</td><td>value</td><td>tier</td><td></td><td>count</td><td>value</td><td>tier</td></tr>' + rows + '</table>' +
    '<small>Tier: 1 super common, 2 common, 3 mid, 4 rare.</small><div id="dvTot"></div>' +
    '<h4>Help my luck</h4><table>' +
    row('Vowel target % of rack (0 = off)', 'dVp') + row('Fewest vowels (hard limit)', 'dVmin') + row('Most vowels (hard limit)', 'dVmax') +
    row('Pairs always allowed in a rack', 'dPairs') + row('Chance % a draw may allow one pair', 'dPc') +
    row('Draw weight, tier 1', 'dW1') + row('Draw weight, tier 2', 'dW2') + row('Draw weight, tier 3', 'dW3') + row('Draw weight, tier 4', 'dW4') +
    row('Most tier 3-4 tiles in a rack (8 = no limit)', 'dMax') + '</table>' +
    '<h4>Game</h4><table>' + row('Bingo bonus', 'dBingo') + '</table>' +
    '<label class="ck"><input type="checkbox" id="dCR"> Ask before cancelling a game</label>' +
    '<label class="ck"><input type="checkbox" id="dSB"> First racks: no S and one blank (both players)</label>' +
    '<button id="dTest">Test draws (1,000 racks)</button><div id="dOut"></div>' +
    '<button id="dSave">Save (counts apply to new games)</button><button id="dReset">Reset to config.js</button>' +
    '<button id="dCopy">Show text for config.js</button><textarea id="dText" rows="9" style="display:none;width:100%;font-size:12px"></textarea>' +
    '<button id="dClose">Close</button></div>';
  document.body.appendChild(ov);
  const mb = document.createElement('button'); mb.textContent = 'Developer';
  $('menu').querySelector('.box').insertBefore(mb, $('mClose'));

  function fill() {
    LET.split('').forEach((ch, k) => { $('dc' + k).value = C.bag[ch] || 0; if (ch !== '?') { $('dv' + k).value = C.values[ch] || 0; $('dt' + k).value = C.tiers[ch] || 2; } });
    const L = C.luck;
    $('dBingo').value = C.bingo; $('dPairs').value = L.pairs; $('dPc').value = L.pairChance; $('dVmin').value = L.vmin; $('dVmax').value = L.vmax;
    $('dVp').value = L.vowelPct; [1, 2, 3, 4].forEach(i => { $('dW' + i).value = L.tierW[i - 1]; }); $('dMax').value = L.maxHigh;
    $('dCR').checked = !!C.dev.confirmRestart; $('dSB').checked = !!C.dev.noSBlank;
    $('dvNote').textContent = active ? 'Saved developer values are in use (they override config.js). Reset to go back to config.js.' : 'Using the values in config.js.';
    totals();
  }
  function read() {
    const bag = {}, values = {}, tiers = {};
    LET.split('').forEach((ch, k) => {
      bag[ch] = Math.max(0, +$('dc' + k).value || 0);
      if (ch !== '?') { values[ch] = Math.max(0, +$('dv' + k).value || 0); tiers[ch] = Math.min(4, Math.max(1, +$('dt' + k).value || 2)); }
    });
    return { bag, values, tiers, bingo: +$('dBingo').value || 0,
      luck: { pairs: +$('dPairs').value || 0, pairChance: +$('dPc').value || 0, vmin: +$('dVmin').value || 0, vmax: +$('dVmax').value || 0, vowelPct: +$('dVp').value || 0,
              tierW: [1, 2, 3, 4].map(i => { const v = parseFloat($('dW' + i).value); return isNaN(v) ? 1 : v; }), maxHigh: +$('dMax').value || 8 },
      dev: { confirmRestart: $('dCR').checked, noSBlank: $('dSB').checked } };
  }
  function totals() {
    const d = read(); let t = 0, v = 0; const tc = [0, 0, 0, 0];
    for (const ch in d.bag) { t += d.bag[ch]; if (VOW.includes(ch)) v += d.bag[ch]; if (ch !== '?') tc[d.tiers[ch] - 1] += d.bag[ch]; }
    const b = d.bag['?'] || 0;
    $('dvTot').textContent = 'Total ' + t + ' tiles. Vowels ' + v + ' (' + (t - b ? Math.round(v / (t - b) * 100) : 0) + '% of letters), consonants ' + (t - v - b) + ', blanks ' + b +
      '. Tier counts ' + tc.join(' / ') + '.';
  }
  ov.addEventListener('input', totals);

  function simulate(d, flags, n) {
    const base = []; for (const ch in d.bag) for (let i = 0; i < d.bag[ch]; i++) base.push(ch);
    const m = { v: 0, v34: 0, cons: 0, pairs: 0, anyPair: 0, trip: 0, hard2: 0, blanks: 0, anyBlank: 0, pts: 0, t: [0, 0, 0, 0] };
    for (let k = 0; k < n; k++) {
      const bag = base.slice(); for (let i = bag.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [bag[i], bag[j]] = [bag[j], bag[i]]; }
      const rack = [];
      for (let i = 0; i < C.rackSize; i++) { const ch = window.BW.pickTile(bag, rack, C.rackSize - 1 - i, flags, d.luck); bag.splice(bag.indexOf(ch), 1); rack.push({ ch }); }
      const cnt = {}; let v = 0, bl = 0, hard = 0, pts = 0;
      rack.forEach(t => {
        if (t.ch === '?') { bl++; return; }
        cnt[t.ch] = (cnt[t.ch] || 0) + 1; if (VOW.includes(t.ch)) v++; if ('JQXZV'.includes(t.ch)) hard++; pts += d.values[t.ch] || 0; m.t[(d.tiers[t.ch] || 2) - 1]++;
      });
      const pr = Object.values(cnt).filter(x => x === 2).length, tr = Object.values(cnt).filter(x => x >= 3).length;
      m.v += v; m.cons += C.rackSize - v - bl; if (v + bl >= 3 && v <= 4) m.v34++; m.pairs += pr; if (pr || tr) m.anyPair++; if (tr) m.trip++;
      if (hard >= 2) m.hard2++; m.blanks += bl; if (bl) m.anyBlank++; m.pts += pts;
    }
    const pc = x => Math.round(x / n * 100) + '%', av = x => (x / n).toFixed(2);
    return [av(m.v), av(m.cons), pc(m.v34), av(m.pairs), pc(m.anyPair), pc(m.trip), pc(m.hard2), av(m.blanks), pc(m.anyBlank), av(m.pts), av(m.t[0]), av(m.t[1]), av(m.t[2]), av(m.t[3])];
  }
  $('dTest').onclick = () => {
    const d = read(); $('dOut').textContent = 'Testing...';
    setTimeout(() => {
      const saved = C.tiers, fl = window.BW.luckFlags(); C.tiers = d.tiers;
      const off = simulate(d, { dup: false, bal: false, hard: false }, 1000);
      const on = simulate(d, (fl.dup || fl.bal || fl.hard) ? fl : { dup: true, bal: true, hard: true }, 1000);
      C.tiers = saved;
      const names = ['Average vowels', 'Average consonants', 'Racks with 3-4 vowels', 'Average pairs per rack', 'Racks with any repeat', 'Racks with 3 of a kind', 'Racks with 2+ of J Q X Z V',
        'Average blanks', 'Racks with a blank', 'Average rack points', 'Avg tier 1 tiles', 'Avg tier 2 tiles', 'Avg tier 3 tiles', 'Avg tier 4 tiles'];
      let h = '<table><tr><td></td><td>Help off</td><td>Help on</td></tr>';
      names.forEach((n, i) => { h += '<tr><td>' + n + '</td><td>' + off[i] + '</td><td>' + on[i] + '</td></tr>'; });
      $('dOut').innerHTML = h + '</table><small>Help on uses your current Help my luck checkboxes (all three if none are ticked).</small>';
    }, 30);
  };
  $('dSave').onclick = () => {
    const d = read(); C.bag = d.bag; C.values = d.values; C.tiers = d.tiers; C.bingo = d.bingo; C.luck = d.luck; C.dev = d.dev; active = true;
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
    fill(); $('dOut').textContent = 'Saved. Start a new game to use the new tile counts.';
  };
  $('dReset').onclick = () => {
    try { localStorage.removeItem(KEY); } catch (e) {}
    const o = clone(orig); C.bag = o.bag; C.values = o.values; C.bingo = o.bingo; C.luck = o.luck; C.tiers = o.tiers; C.dev = o.dev; active = false;
    fill(); $('dOut').textContent = 'Back to config.js values.';
  };
  $('dCopy').onclick = () => {
    const d = read(), j = o => JSON.stringify(o).replace(/"/g, '').replace(/,/g, ', ').replace(/\?:/, '"?":'), L = d.luck;
    const t = '  bingo: ' + d.bingo + ',\n  luck: { pairs: ' + L.pairs + ', pairChance: ' + L.pairChance + ', vmin: ' + L.vmin + ', vmax: ' + L.vmax + ', vowelPct: ' + L.vowelPct +
      ', tierW: [' + L.tierW.join(', ') + '], maxHigh: ' + L.maxHigh + ' },\n  dev: { confirmRestart: ' + d.dev.confirmRestart + ', noSBlank: ' + d.dev.noSBlank + ' },\n  tiers: ' + j(d.tiers) +
      ',\n  bag: ' + j(d.bag) + ',\n  values: ' + j(d.values) + '\n';
    const ta = $('dText'); ta.style.display = 'block'; ta.value = t; ta.select();
    try { navigator.clipboard.writeText(t); } catch (e) {}
  };
  $('dClose').onclick = () => ov.classList.remove('on');
  mb.onclick = () => { $('menu').classList.remove('on'); fill(); ov.classList.add('on'); };
})();

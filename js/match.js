// Comparing what the learner said with the expected answer.
const NUM = {
  0: 'null', 1: 'ein', 2: 'zwei', 3: 'drei', 4: 'vier', 5: 'fünf', 6: 'sechs', 7: 'sieben',
  8: 'acht', 9: 'neun', 10: 'zehn', 11: 'elf', 12: 'zwölf', 13: 'dreizehn', 14: 'vierzehn',
  15: 'fünfzehn', 16: 'sechzehn', 17: 'siebzehn', 18: 'achtzehn', 19: 'neunzehn', 20: 'zwanzig',
  30: 'dreißig', 40: 'vierzig', 50: 'fünfzig', 100: 'hundert',
};

/** Loose form for matching: lower case, digits as words, no umlauts/ß/punctuation. */
export function normalize(s) {
  return String(s).toLowerCase()
    .replace(/\b\d+\b/g, m => NUM[+m] ?? m)
    .replace(/ß/g, 'ss').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u')
    .replace(/[-–]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

const normTok = t => normalize(t).replace(/ /g, '');
const tokens = s => String(s).replace(/[-–]/g, '').split(/\s+/).filter(t => normTok(t));

function lev(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

/** Character-level similarity 0..1 (used for shadowing). */
export function similarity(a, b) {
  const x = normalize(a), y = normalize(b);
  if (!x && !y) return 1;
  return 1 - lev(x, y) / Math.max(x.length, y.length);
}

/** Word alignment: returns ops ok | sub | del (missing) | ins (extra). */
export function alignWords(expected, said) {
  const A = tokens(expected), B = tokens(said);
  const a = A.map(normTok), b = B.map(normTok);
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  const ops = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) {
      ops.push(a[i - 1] === b[j - 1] ? { type: 'ok', exp: A[i - 1] } : { type: 'sub', exp: A[i - 1], said: B[j - 1] });
      i--; j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      ops.push({ type: 'del', exp: A[i - 1] }); i--;
    } else {
      ops.push({ type: 'ins', said: B[j - 1] }); j--;
    }
  }
  ops.reverse();
  const errors = ops.filter(o => o.type !== 'ok').length;
  return { ops, errors, accuracy: m ? ops.filter(o => o.type === 'ok').length / Math.max(m, n) : 0 };
}

/**
 * Grade a spoken/typed answer against accepted answers.
 * correct: every word matches. close: most words match. wrong: otherwise.
 */
export function gradeAnswer(said, answers) {
  let best = null;
  for (const ans of answers) {
    const r = alignWords(ans, said);
    if (!best || r.errors < best.errors || (r.errors === best.errors && r.accuracy > best.accuracy)) best = { ...r, answer: ans };
  }
  // Only the article is missing or wrong (e.g. "Abteilung" for "die Abteilung"): almost there.
  const ARTICLES = ['der', 'die', 'das', 'den', 'dem', 'des'];
  const onlyArticle = best.errors > 0 && best.ops.every(o => o.type === 'ok'
    || (o.type === 'del' && ARTICLES.includes(normalize(o.exp)))
    || (o.type === 'sub' && ARTICLES.includes(normalize(o.exp)) && ARTICLES.includes(normalize(o.said))));
  const grade = best.errors === 0 ? 'correct' : (best.accuracy >= 0.75 || onlyArticle) ? 'close' : 'wrong';
  return { ...best, grade };
}

/** Role-play: each group is a list of alternative keywords; returns which groups were hit. */
export function keywordMatch(said, groups) {
  const t = ` ${normalize(said)} `;
  const hits = groups.map(g => g.some(alt => t.includes(` ${normalize(alt)} `) || t.includes(` ${normalize(alt)}`)));
  const score = groups.length ? hits.filter(Boolean).length / groups.length : 1;
  return { hits, score };
}

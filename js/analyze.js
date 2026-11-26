// Offline feedback on free speaking: length, pace, connectors, B2 structures, exam phrases.
// It can't judge grammar the way a teacher can; it checks the things examiners count.

const clean = s => ` ${String(s).toLowerCase().replace(/[.,!?;:„“"()]/g, ' ').replace(/\s+/g, ' ').trim()} `;
const has = (t, p) => t.includes(` ${p} `);

export const REDEMITTEL = {
  intro: { label: 'Introduce the topic', phrases: ['in meinem vortrag geht es um', 'ich möchte heute über', 'mein thema ist', 'ich spreche heute über', 'das thema meines vortrags'] },
  structure: { label: 'Structure', phrases: ['zuerst', 'zunächst', 'danach', 'anschließend', 'erstens', 'zweitens', 'zum einen', 'zum anderen', 'außerdem', 'als nächstes', 'ein weiterer punkt'] },
  opinion: { label: 'Give your opinion', phrases: ['meiner meinung nach', 'ich finde', 'ich bin der meinung', 'ich bin der ansicht', 'meines erachtens', 'aus meiner sicht', 'ich bin davon überzeugt', 'ich denke', 'ich glaube'] },
  example: { label: 'Give an example', phrases: ['zum beispiel', 'beispielsweise', 'ein beispiel dafür', 'wie zum beispiel', 'aus eigener erfahrung', 'ich habe selbst erlebt'] },
  proscons: { label: 'Pros and cons', phrases: ['ein vorteil', 'ein nachteil', 'der vorteil', 'der nachteil', 'einerseits', 'andererseits', 'positiv', 'negativ', 'dafür spricht', 'dagegen spricht'] },
  conclusion: { label: 'Conclude', phrases: ['zusammenfassend', 'abschließend', 'zum schluss', 'alles in allem', 'insgesamt', 'vielen dank für ihre aufmerksamkeit', 'mein fazit'] },
  agree: { label: 'Agree', phrases: ['da hast du recht', 'da stimme ich dir zu', 'das sehe ich genauso', 'da bin ich deiner meinung', 'das finde ich auch', 'guter punkt', 'genau', 'einverstanden', 'das stimmt'] },
  disagree: { label: 'Disagree politely', phrases: ['das sehe ich anders', 'da bin ich anderer meinung', 'da muss ich widersprechen', 'das stimmt zwar', 'ich bin mir nicht sicher', 'im gegenteil', 'aber', 'trotzdem'] },
  compromise: { label: 'Find a compromise', phrases: ['wie wäre es', 'was hältst du davon', 'ein kompromiss', 'wir könnten', 'vielleicht könnte man', 'einigen wir uns', 'man könnte'] },
};

export const TASK_CATEGORIES = {
  vortrag: ['intro', 'structure', 'opinion', 'example', 'proscons', 'conclusion'],
  diskussion: ['opinion', 'agree', 'disagree', 'compromise', 'example'],
  talk: ['opinion', 'example', 'structure'],
};

const CONNECTORS = ['weil', 'da', 'denn', 'obwohl', 'trotzdem', 'deshalb', 'deswegen', 'daher', 'darum', 'außerdem',
  'sodass', 'indem', 'während', 'wohingegen', 'falls', 'sofern', 'damit', 'nachdem', 'bevor', 'seitdem', 'als',
  'wenn', 'dass', 'ob', 'je', 'desto', 'umso', 'sondern', 'jedoch', 'allerdings', 'dennoch', 'sowohl', 'weder',
  'entweder', 'zwar', 'einerseits', 'andererseits', 'stattdessen', 'folglich', 'bis'];
const B2_CONNECTORS = new Set(['obwohl', 'trotzdem', 'sodass', 'indem', 'wohingegen', 'sofern', 'je', 'desto', 'umso',
  'jedoch', 'allerdings', 'dennoch', 'sowohl', 'weder', 'entweder', 'zwar', 'einerseits', 'folglich', 'stattdessen', 'falls', 'nachdem', 'seitdem']);
const K2 = ['würde', 'würdest', 'würden', 'würdet', 'hätte', 'hättest', 'hätten', 'wäre', 'wärst', 'wären',
  'könnte', 'könntest', 'könnten', 'sollte', 'solltest', 'sollten', 'müsste', 'müssten', 'dürfte', 'dürften'];
const FILLERS = ['äh', 'ähm', 'öh', 'hm', 'ehm'];

export function analyzeSpeech(text, seconds, kind = 'talk') {
  const t = clean(text);
  const words = t.trim() ? t.trim().split(' ') : [];
  const n = words.length;
  const timed = seconds > 0; // typed answers have no speaking time
  const wpm = timed ? Math.round(n / Math.max(seconds / 60, 0.1)) : null;
  const unique = new Set(words).size;
  const ttr = n ? unique / n : 0;

  const connectors = [...new Set(CONNECTORS.filter(c => has(t, c)))];
  const b2conn = connectors.filter(c => B2_CONNECTORS.has(c));
  const k2 = [...new Set(K2.filter(k => has(t, k)))];
  const passive = /\b(wurde|wurden|worden)\b/.test(t) || /\b(wird|werden)\b(\s\S+){0,6}\sge\S+(t|en)\b/.test(t);
  const fillers = words.filter(w => FILLERS.includes(w)).length;

  const cats = TASK_CATEGORIES[kind] || TASK_CATEGORIES.talk;
  const redemittel = cats.map(c => ({
    key: c, label: REDEMITTEL[c].label,
    found: REDEMITTEL[c].phrases.filter(p => t.includes(` ${p}`)),
    suggest: REDEMITTEL[c].phrases.slice(0, 3),
  }));

  const targetWords = kind === 'vortrag' ? 300 : kind === 'diskussion' ? 200 : 120;
  const checks = [
    { ok: n >= targetWords, label: 'Length', detail: `${n} words (aim for ${targetWords}+)` },
    timed ? { ok: wpm >= 90, label: 'Pace', detail: `${wpm} words per minute (B2 speakers manage about 100–130)` } : null,
    { ok: connectors.length >= 6, label: 'Linking words', detail: connectors.length ? `${connectors.length} different: ${connectors.join(', ')}` : 'none detected' },
    { ok: b2conn.length >= 2, label: 'B2 connectors', detail: b2conn.length ? b2conn.join(', ') : 'try obwohl, trotzdem, sodass, je … desto, zwar … aber' },
    { ok: k2.length >= 1, label: 'Konjunktiv II', detail: k2.length ? k2.join(', ') : 'try “Ich würde …”, “Es wäre besser, wenn …”' },
    { ok: passive, label: 'Passive voice', detail: passive ? 'used' : 'try “Es wird oft gesagt, dass …”' },
    { ok: n < 60 || ttr >= 0.45, label: 'Vocabulary range', detail: `${Math.round(ttr * 100)}% different words` },
  ].filter(Boolean);
  if (fillers > 3) checks.push({ ok: false, label: 'Fillers', detail: `${fillers} × äh/ähm. Swap them for “also”, “na ja”, “sagen wir mal”.` });

  const covered = redemittel.filter(r => r.found.length).length;
  const score = Math.round(((checks.filter(c => c.ok).length / checks.length) * 0.6 + (covered / redemittel.length) * 0.4) * 100);

  return { words: n, wpm, ttr, connectors, b2conn, k2, passive, fillers, redemittel, checks, score };
}

// Views and routing.
import { h, put, runCleanup, every, fmt, iconPlay } from './ui.js';
import { canListen, canSpeak, germanVoices, speak } from './speech.js';
import * as store from './store.js';
import { GRAMMAR, grammarById } from './data/grammar.js';
import { TOPICS, topicById, FOLLOW_UPS } from './data/topics.js';
import { DAYS, blocksFor, dayByNumber } from './data/plan.js';
import { drillRunner, shadowRunner, chunkRunner, roleplayRunner, monologRunner, discussionRunner, talkRunner, mockRunner } from './runners.js';
import { STORIES } from './data/stories.js';
import { storyRunner } from './story.js';

const view = document.getElementById('view');

// Every reviewable item, keyed by id.
const ITEMS = {};
for (const g of GRAMMAR) for (const d of g.drills) ITEMS[d.id] = { ...d, label: g.title.split(':')[0] };
for (const t of TOPICS) for (const c of t.chunks) ITEMS[c.id] = { id: c.id, en: true, cue: c.en, answers: [c.de], label: t.title };
for (const st of Object.values(STORIES)) for (const w of st.words) ITEMS[w.id] = { id: w.id, en: true, cue: w.en, answers: [w.say], label: `Wort · ${st.title}` };
const wordItems = st => st.words.map(w => ITEMS[w.id]);

const hours = () => store.settings().hours;
const blocksOf = n => blocksFor(dayByNumber(n), hours());

function applyTheme() {
  const t = store.settings().theme;
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  else delete document.documentElement.dataset.theme;
}

function updateDue() {
  const n = store.srsDue().length;
  document.getElementById('dueCount').textContent = n ? String(n) : '';
}

function head({ back, kicker, title, lead }) {
  return h('header', { class: 'page-head' },
    back ? h('a', { class: 'back', href: back[0] }, `← ${back[1]}`) : null,
    kicker ? h('div', { class: 'kicker' }, kicker) : null,
    h('h1', {}, title),
    lead ? h('p', { class: 'lead' }, lead) : null);
}

/** Wraps an exercise: header with a study timer, optional completion button. */
function frame({ back, kicker, title, targetMin, onComplete }) {
  let secs = 0;
  const timer = h('div', { class: 'timer', 'aria-label': 'Time in this block' }, targetMin ? `0:00 / ${targetMin} min` : '0:00');
  every(5000, () => {
    if (document.visibilityState !== 'visible') return;
    secs += 5;
    store.addStudy(5);
    timer.textContent = targetMin ? `${fmt(secs)} / ${targetMin} min` : fmt(secs);
    if (targetMin && secs >= targetMin * 60) timer.classList.add('over');
  });
  const body = h('div', {});
  const el = h('div', {},
    h('div', { class: 'runner-head' },
      h('div', {}, h('a', { class: 'back', href: back[0] }, `← ${back[1]}`), kicker ? h('div', { class: 'muted' }, kicker) : null, h('h1', {}, title)),
      timer),
    body,
    onComplete ? h('div', { class: 'row', style: 'margin-top:32px' },
      h('button', { class: 'btn btn-primary', type: 'button', onclick: onComplete }, 'Mark this block done'),
      h('span', { class: 'muted small' }, 'Do as many rounds as fit into the time, then mark it done.')) : null);
  return { el, body };
}

function speechNotice() {
  if (canListen && canSpeak) return null;
  return h('div', { class: 'notice' },
    !canListen ? 'This browser can’t recognise speech, so you will type your answers. For speaking practice open this page in Chrome, Edge or Safari. ' : '',
    !canSpeak ? 'This browser can’t read German aloud.' : '');
}

/* ---------------- Today & day ---------------- */
function blockList(n) {
  const blocks = blocksOf(n);
  const prog = store.dayProgress(n);
  const nextId = blocks.find(b => !prog.blocks[b.id])?.id;
  return h('ol', { class: 'blocks' }, blocks.map(b => h('li', { class: prog.blocks[b.id] ? 'done' : b.id === nextId ? 'next' : '' },
    h('a', { href: `#/day/${n}/${b.id}` },
      h('span', { class: 'dot', 'aria-hidden': 'true' }),
      h('span', {}, h('div', { class: 'title' }, b.title, prog.blocks[b.id] ? h('span', { class: 'muted small' }, ' · done') : null), h('div', { class: 'desc', lang: 'de' }, b.desc)),
      h('span', { class: 'min' }, `${b.min} min`)))));
}

function dayHeader(n) {
  const d = dayByNumber(n);
  const bits = [];
  if (d.grammar?.length === 1 && d.kind === 'learn') bits.push(grammarById[d.grammar[0]].level);
  bits.push(...d.topics.map(t => topicById[t].title));
  return { d, sub: bits.join(' · ') };
}

function viewToday() {
  const n = store.currentDay();
  const { d, sub } = dayHeader(n);
  const blocks = blocksOf(n);
  const prog = store.dayProgress(n);
  const doneCount = blocks.filter(b => prog.blocks[b.id]).length;
  const next = blocks.find(b => !prog.blocks[b.id]);
  const total = blocks.reduce((a, b) => a + b.min, 0);
  const t = store.getState().stats.byDate[store.localDate()] || { spokenSec: 0, studySec: 0 };
  const due = store.srsDue().length;

  put(view, 
    speechNotice(),
    h('section', { class: 'today-hero', style: 'margin-top:8px' },
      h('div', {},
        h('div', { class: 'day-number' }, h('small', {}, 'Heute auf dem Fahrplan'), `Tag ${n}`),
        h('h2', { style: 'margin-top:14px', lang: 'de' }, d.title),
        h('p', { class: 'muted', style: 'margin-top:4px' }, sub)),
      next ? h('a', { class: 'btn btn-primary', href: `#/day/${n}/${next.id}` }, doneCount ? `Continue: ${next.title}` : `Start with ${next.title}`) : h('a', { class: 'btn btn-primary', href: '#/plan' }, 'Day done – see the plan')),
    h('div', { class: 'panel stack', style: 'margin-top:28px' },
      h('div', { class: 'spread' }, h('b', {}, `${doneCount} of ${blocks.length} blocks done`), h('span', { class: 'muted' }, `about ${Math.round(total / 60 * 10) / 10} hours today`)),
      h('div', { class: 'meter' }, h('span', { style: `width:${(doneCount / blocks.length) * 100}%` })),
      h('div', { class: 'stat-line', style: 'margin-top:18px' },
        h('div', {}, h('b', {}, Math.round(t.spokenSec / 60)), h('span', { class: 'muted small' }, 'minutes spoken today')),
        h('div', {}, h('b', {}, Math.round(t.studySec / 60)), h('span', { class: 'muted small' }, 'minutes practised today')),
        h('div', {}, h('b', {}, due), h('span', { class: 'muted small' }, 'items due for review')))),
    h('div', { style: 'margin-top:28px' }, blockList(n)),
  );
}

function viewDay(n) {
  n = Number(n);
  const d = dayByNumber(n);
  if (!d) return notFound();
  const { sub } = dayHeader(n);
  put(view, head({ back: ['#/plan', 'Fahrplan'], kicker: `Tag ${n} · Woche ${d.week} · ${sub}`, title: d.title }), blockList(n));
}

function viewBlock(n, blockId) {
  n = Number(n);
  const d = dayByNumber(n);
  const blocks = d ? blocksOf(n) : [];
  const b = blocks.find(x => x.id === blockId);
  if (!b) return notFound();
  const { el, body } = frame({
    back: [`#/day/${n}`, `Tag ${n}`], kicker: b.desc, title: b.title, targetMin: b.min,
    onComplete: () => {
      const wasCurrent = n === store.currentDay();
      store.markBlock(n, b.id, blocks.length);
      location.hash = wasCurrent ? '#/today' : `#/day/${n}`;
    },
  });
  put(view, el);
  runBlock(body, b, n);
}

function reviewItems(fallbackDay) {
  const due = store.srsDue().filter(id => ITEMS[id]).slice(0, 25).map(id => ITEMS[id]);
  if (due.length) return { items: due, fresh: false };
  // Nothing due yet: practise drills from the units studied so far.
  const learned = DAYS.filter(d => d.n <= (fallbackDay || store.currentDay()) && d.grammar).flatMap(d => d.grammar);
  const units = [...new Set(learned.length ? learned : ['g01'])].slice(-4);
  return { items: units.flatMap(u => grammarById[u].drills.slice(0, 3)).map(x => ITEMS[x.id]), fresh: true };
}

function runBlock(root, b, n) {
  switch (b.type) {
    case 'review': {
      const { items, fresh } = reviewItems(n);
      if (fresh) root.append(h('p', { class: 'muted', style: 'margin-bottom:14px' }, 'Nothing is due yet, so this is a warm-up from grammar you have covered. Tomorrow your mistakes and new phrases will show up here.'));
      const box = h('div', {});
      root.append(box);
      drillRunner(box, items, { mode: fresh ? 'learn' : 'srs', onFinish: updateDue });
      break;
    }
    case 'grammar': {
      if (b.units.length === 1) root.append(ruleCard(grammarById[b.units[0]]));
      const box = h('div', { style: 'margin-top:18px' });
      root.append(box);
      drillRunner(box, b.drills.map(x => ITEMS[x.id]), { onFinish: updateDue });
      break;
    }
    case 'shadow': shadowRunner(root, b.sentences); break;
    case 'chunks': chunkRunner(root, topicById[b.topic], { onFinish: updateDue }); break;
    case 'roleplay': roleplayRunner(root, topicById[b.topic].roleplay); break;
    case 'vortrag': { const t = topicById[b.topic]; monologRunner(root, { kind: 'vortrag', title: t.vortrag.title, points: t.vortrag.points, prepSec: 180, speakSec: 240, followUps: FOLLOW_UPS.slice(n % 2, n % 2 + 2) }); break; }
    case 'diskussion': discussionRunner(root, topicById[b.topic].diskussion); break;
    case 'talk': talkRunner(root, b.questions); break;
    case 'mock': mockRunner(root, topicById[b.topics[0]], topicById[b.topics[1]]); break;
    case 'story': storyRunner(root, STORIES[b.topic], { onFinish: updateDue }); break;
    default: root.append(h('p', {}, 'Unknown block.'));
  }
}

function ruleCard(g) {
  return h('details', { class: 'rule panel', open: true },
    h('summary', {}, `The rule: ${g.title}`),
    h('ul', { class: 'rule-list' }, g.rule.map(r => h('li', {}, r))),
    h('ul', { class: 'chunk-list', style: 'margin-top:10px' }, g.examples.map(e => h('li', {}, iconPlay(e), h('span', { class: 'de', lang: 'de' }, e)))));
}

/* ---------------- Fahrplan ---------------- */
function viewPlan() {
  const cur = store.currentDay();
  const weeks = [1, 2, 3, 4];
  const weekTitle = { 1: 'Woche 1 · Refresh B1 and speak with confidence', 2: 'Woche 2 · Into B1+: passive, connectors, telling stories', 3: 'Woche 3 · B2 structures: nominal style, indirect speech', 4: 'Woche 4 · Consolidate and take mock exams' };
  put(view, 
    head({ title: 'Fahrplan', lead: `30 days from B1.1 to B2 speaking, about ${hours()} hours a day. Square stations are review and exam days. You can jump to any day.` }),
    ...weeks.map(w => h('section', { class: 'line-week' },
      h('h2', {}, weekTitle[w]),
      h('ol', { class: 'line' }, DAYS.filter(d => d.week === w).map(d => {
        const done = store.dayProgress(d.n).done;
        const cls = [done ? 'done' : '', d.n === cur ? 'current' : '', d.kind !== 'learn' ? 'interchange' : ''].join(' ');
        return h('li', { class: cls }, h('a', { href: `#/day/${d.n}`, 'aria-current': d.n === cur ? 'step' : null },
          h('span', { class: 'station', 'aria-hidden': 'true' }),
          h('span', { class: 'station-day' }, `Tag ${d.n}`),
          h('span', {}, h('div', { class: 'station-name', lang: 'de' }, d.title), h('div', { class: 'station-sub' }, d.topics.map(t => topicById[t].title).join(' · ') + (done ? ' · done' : '')))));
      })))));
}

/* ---------------- Practice ---------------- */
function viewPractice() {
  put(view, 
    head({ title: 'Üben', lead: 'Practise any grammar unit or topic outside the plan.' }),
    h('div', { class: 'two-col' },
      h('section', { class: 'stack' }, h('h2', {}, 'Grammatik'),
        h('ul', { class: 'index-list' }, GRAMMAR.map(g => h('li', {}, h('a', { href: `#/grammar/${g.id}` }, h('span', { lang: 'de' }, g.title), h('span', { class: 'lvl' }, g.level)))))),
      h('section', { class: 'stack' }, h('h2', {}, 'Themen'),
        h('ul', { class: 'index-list' }, TOPICS.map(t => h('li', {}, h('a', { href: `#/topic/${t.id}` }, h('span', { lang: 'de' }, t.title), h('span', { class: 'lvl' }, t.en))))))));
}

function viewGrammar(id) {
  const g = grammarById[id];
  if (!g) return notFound();
  const { el, body } = frame({ back: ['#/practice', 'Üben'], kicker: g.level, title: g.title });
  put(view, el);
  body.append(ruleCard(g));
  const box = h('div', { style: 'margin-top:18px' });
  body.append(box);
  drillRunner(box, g.drills.map(x => ITEMS[x.id]), { onFinish: updateDue });
}

const ACTIVITIES = [
  ['story', 'Geschichte', t => `${STORIES[t.id].title} · ${STORIES[t.id].words.length} new words`],
  ['chunks', 'Redewendungen', 'Phrases to learn'],
  ['shadow', 'Shadowing', 'Listen and repeat'],
  ['roleplay', 'Rollenspiel', t => t.roleplay.title],
  ['vortrag', 'Vortrag', t => t.vortrag.title],
  ['diskussion', 'Diskussion', t => t.diskussion.question],
  ['talk', 'Freies Sprechen', 'Four open questions'],
];

function viewTopic(id) {
  const t = topicById[id];
  if (!t) return notFound();
  put(view, head({ back: ['#/practice', 'Üben'], kicker: t.en, title: t.title }),
    h('ul', { class: 'index-list' }, ACTIVITIES.map(([key, label, sub]) => h('li', {}, h('a', { href: `#/topic/${id}/${key}` }, h('span', {}, label), h('span', { class: 'lvl', lang: 'de' }, typeof sub === 'function' ? sub(t) : sub))))));
}

function viewTopicActivity(id, act) {
  const t = topicById[id];
  const a = ACTIVITIES.find(x => x[0] === act);
  if (!t || !a) return notFound();
  const { el, body } = frame({ back: [`#/topic/${id}`, t.title], kicker: t.title, title: a[1] });
  put(view, el);
  runBlock(body, { type: act, topic: id, sentences: t.shadow, questions: t.talk }, 1);
}

/* ---------------- Review ---------------- */
function viewReview() {
  const { el, body } = frame({ back: ['#/today', 'Heute'], title: 'Wiederholen' });
  put(view, el);
  const due = store.srsDue().filter(i => ITEMS[i]);
  if (!due.length) {
    body.append(h('div', { class: 'panel stack' },
      h('h2', {}, 'Nothing due right now'),
      h('p', { class: 'muted' }, 'Mistakes from drills and new phrases come back here after 1, 2, 4, 8 and 16 days. Each time you get one right, it waits longer before it returns.'),
      h('a', { class: 'btn btn-primary', href: '#/today' }, 'Go to today’s plan')));
    return;
  }
  body.append(h('p', { class: 'muted', style: 'margin-bottom:14px' }, `${due.length} items due. Sessions take up to 25 at a time.`));
  const box = h('div', {});
  body.append(box);
  drillRunner(box, due.slice(0, 25).map(i => ITEMS[i]), { mode: 'srs', onFinish: updateDue });
}

/* ---------------- Exam ---------------- */
function viewExam() {
  const sel = (id) => h('select', { id, 'aria-label': 'Topic' }, TOPICS.map(t => h('option', { value: t.id }, t.title)));
  const s1 = sel('vSel'), s2 = sel('dSel');
  const rnd = () => TOPICS[Math.floor(Math.random() * TOPICS.length)].id;
  put(view, 
    head({ title: 'Prüfung', lead: 'Speaking practice in the Goethe-Zertifikat B2 format. Teil 1: a presentation of about 4 minutes, then questions. Teil 2: a discussion of about 5 minutes with a partner. The telc B2 exam has a similar presentation and discussion, plus a part where you plan something together; the role-plays practise that.' }),
    h('div', { class: 'stack' },
      h('div', { class: 'panel spread' }, h('div', {}, h('h3', {}, 'Full mock exam'), h('p', { class: 'muted' }, 'Preparation, then Teil 1 and Teil 2 with a combined report.')),
        h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { let a = rnd(), b = rnd(); while (b === a) b = rnd(); location.hash = `#/exam/mock/${a}-${b}`; } }, 'Start a random mock')),
      h('div', { class: 'panel spread' }, h('div', {}, h('h3', {}, 'Teil 1 · Vortrag'), h('p', { class: 'muted' }, 'Choose a topic.')),
        h('div', { class: 'row' }, s1, h('button', { class: 'btn', type: 'button', onclick: () => { location.hash = `#/exam/vortrag/${s1.value}`; } }, 'Start'))),
      h('div', { class: 'panel spread' }, h('div', {}, h('h3', {}, 'Teil 2 · Diskussion'), h('p', { class: 'muted' }, 'Choose a topic.')),
        h('div', { class: 'row' }, s2, h('button', { class: 'btn', type: 'button', onclick: () => { location.hash = `#/exam/diskussion/${s2.value}`; } }, 'Start')))),
  );
}

function viewExamRun(kind, arg) {
  const { el, body } = frame({ back: ['#/exam', 'Prüfung'], title: kind === 'mock' ? 'Probeprüfung' : kind === 'vortrag' ? 'Teil 1 · Vortrag' : 'Teil 2 · Diskussion' });
  put(view, el);
  if (kind === 'mock') {
    const [a, b] = (arg || '').split('-');
    if (!topicById[a] || !topicById[b]) return notFound();
    mockRunner(body, topicById[a], topicById[b]);
  } else {
    const t = topicById[arg];
    if (!t) return notFound();
    if (kind === 'vortrag') monologRunner(body, { kind: 'vortrag', title: t.vortrag.title, points: t.vortrag.points, prepSec: 180, speakSec: 240, followUps: FOLLOW_UPS.slice(0, 2) });
    else discussionRunner(body, t.diskussion);
  }
}

/* ---------------- Progress & settings ---------------- */
function viewProgress() {
  const st = store.getState();
  const days = Object.values(st.days).filter(d => d.done).length;
  const all = Object.values(st.stats.byDate);
  const spoken = Math.round(all.reduce((a, d) => a + d.spokenSec, 0) / 60);
  const studied = Math.round(all.reduce((a, d) => a + d.studySec, 0) / 60);
  const attempts = all.reduce((a, d) => a + d.attempts, 0);
  const correct = all.reduce((a, d) => a + d.correct, 0);
  const active = i => { const d = st.stats.byDate[store.localDate(i)]; return !!d && d.studySec + d.spokenSec > 0; };
  let streak = 0;
  for (let i = active(0) ? 0 : -1; active(i); i--) streak++;

  const last = Array.from({ length: 14 }, (_, i) => store.localDate(i - 13));
  const vals = last.map(k => (st.stats.byDate[k]?.studySec || 0) / 60);
  const max = Math.max(60, ...vals);
  const boxes = [1, 2, 3, 4, 5, 6].map(b => Object.values(st.srs).filter(x => x.box === b).length);

  const s = store.settings();
  const seg = (key, opts) => {
    const g = h('div', { class: 'seg', role: 'group' }, opts.map(([v, label]) => h('button', {
      type: 'button', 'aria-pressed': String(s[key] === v || (s[key] == null && v === 'auto')),
      onclick: () => { store.setSetting(key, v); if (key === 'theme') applyTheme(); viewProgress(); },
    }, label)));
    return g;
  };
  const voices = germanVoices();
  const voiceSel = h('select', { 'aria-label': 'German voice', onchange: e => store.setSetting('voice', e.target.value) },
    h('option', { value: '' }, 'Automatic'), voices.map(v => h('option', { value: v.name, selected: v.name === s.voice || null }, `${v.name} (${v.lang})`)));
  const rate = h('input', { type: 'range', min: '0.6', max: '1.2', step: '0.05', value: String(s.rate), 'aria-label': 'Speech speed', oninput: e => { store.setSetting('rate', Number(e.target.value)); rateLbl.textContent = `${Number(e.target.value).toFixed(2)}×`; } });
  const rateLbl = h('span', { class: 'muted' }, `${s.rate.toFixed(2)}×`);
  const fileIn = h('input', { type: 'file', accept: 'application/json', hidden: true, onchange: async e => {
    const f = e.target.files[0]; if (!f) return;
    try { store.importJSON(await f.text()); viewProgress(); updateDue(); } catch (err) { alert(`Import failed: ${err.message}`); }
  } });

  put(view, 
    head({ title: 'Fortschritt' }),
    h('div', { class: 'panel' }, h('div', { class: 'stat-line' },
      h('div', {}, h('b', {}, `${days}/30`), h('span', { class: 'muted small' }, 'days completed')),
      h('div', {}, h('b', {}, spoken), h('span', { class: 'muted small' }, 'minutes spoken')),
      h('div', {}, h('b', {}, studied), h('span', { class: 'muted small' }, 'minutes practised')),
      h('div', {}, h('b', {}, attempts ? `${Math.round((correct / attempts) * 100)} %` : '–'), h('span', { class: 'muted small' }, `first-try accuracy (${attempts})`)),
      h('div', {}, h('b', {}, streak), h('span', { class: 'muted small' }, 'day streak')))),
    h('section', { class: 'panel stack', style: 'margin-top:20px' },
      h('h3', {}, 'Minutes practised, last 14 days'),
      h('div', { class: 'bars', role: 'img', 'aria-label': `Minutes practised per day: ${vals.map(v => Math.round(v)).join(', ')}` },
        vals.map((v, i) => h('div', { class: i === 13 ? 'today' : '', style: `height:${(v / max) * 100}%`, title: `${last[i]}: ${Math.round(v)} min` }))),
      h('div', { class: 'bar-labels' }, last.map(k => h('span', {}, k.slice(8))))),
    h('section', { class: 'panel stack', style: 'margin-top:20px' },
      h('h3', {}, 'Review boxes'),
      h('p', { class: 'muted small' }, 'Box 1 comes back tomorrow; box 6 means you know it well. Every right answer moves an item up one box.'),
      h('div', { class: 'boxes' }, boxes.map((c, i) => h('div', {}, h('b', {}, c), h('span', { class: 'muted small' }, `Box ${i + 1}`))))),
    h('section', { class: 'panel stack', style: 'margin-top:20px' },
      h('h3', {}, 'Settings'),
      h('div', { class: 'field' }, h('span', {}, 'Daily study time'), seg('hours', [[2, '2 hours'], [3, '3 hours']])),
      h('div', { class: 'field' }, h('span', {}, 'German voice'), h('div', { class: 'row' }, voiceSel, h('button', { class: 'btn', type: 'button', onclick: () => speak('Hallo! So klingt meine Stimme. Viel Erfolg bei der Prüfung!') }, 'Test'))),
      h('div', { class: 'field' }, h('span', {}, 'Speech speed'), h('div', { class: 'row' }, rate, rateLbl)),
      h('div', { class: 'field' }, h('span', {}, 'Appearance'), seg('theme', [['auto', 'Automatic'], ['light', 'Light'], ['dark', 'Dark']])),
      h('div', { class: 'field' }, h('span', {}, 'Your data'), h('div', { class: 'row' },
        h('button', { class: 'btn', type: 'button', onclick: () => {
          const a = h('a', { href: URL.createObjectURL(new Blob([store.exportJSON()], { type: 'application/json' })), download: `sprechzug-backup-${store.localDate()}.json` });
          a.click();
        } }, 'Export backup'),
        h('button', { class: 'btn', type: 'button', onclick: () => fileIn.click() }, 'Import backup'), fileIn,
        h('button', { class: 'btn btn-quiet', type: 'button', onclick: () => { if (confirm('Delete all progress, reviews and settings? This cannot be undone.')) { store.resetAll(); applyTheme(); updateDue(); viewProgress(); } } }, 'Reset everything'))),
      h('p', { class: 'muted small' }, 'Progress is saved in this browser only. Export a backup before you switch browsers or clear site data.')),
  );
}

/* ---------------- Wörter ---------------- */
function boxPill(id) {
  const b = store.srsBox(id);
  return h('span', { class: `box-pill b${b}` }, b === 0 ? 'neu' : b >= 5 ? 'sitzt' : `Box ${b}`);
}

function viewWords() {
  const list = h('div', { class: 'stack-l' });
  const search = h('input', { type: 'search', class: 'search', placeholder: 'Search German or English …', 'aria-label': 'Search words' });
  const draw = () => {
    const q = search.value.trim().toLowerCase();
    put(list, TOPICS.map(t => {
      const st = STORIES[t.id];
      const words = st.words.filter(w => !q || w.say.toLowerCase().includes(q) || w.en.toLowerCase().includes(q));
      if (!words.length) return null;
      const ss = store.storyState(t.id);
      const known = st.words.filter(w => store.srsBox(w.id) >= 3).length;
      return h('section', { class: 'panel stack' },
        h('div', { class: 'spread' },
          h('div', {}, h('h2', { lang: 'de' }, t.title), h('p', { class: 'muted small' }, `Story: „${st.title}“ · ${known}/${st.words.length} known well${ss.done ? ' · retold' : ''}`)),
          h('div', { class: 'row' },
            h('a', { class: 'btn', href: `#/topic/${t.id}/story` }, ss.done ? 'Read again' : 'Read the story'),
            h('a', { class: 'btn btn-primary', href: `#/words/${t.id}` }, 'Practise'))),
        h('table', { class: 'word-table' }, h('tbody', {}, words.map(w => h('tr', {},
          h('td', {}, iconPlay(w.say)),
          h('td', {}, h('div', { class: 'de', lang: 'de' }, w.say), w.note ? h('div', { class: 'note', lang: 'de' }, w.note) : null),
          h('td', { class: 'muted' }, w.en),
          h('td', { style: 'text-align:right' }, boxPill(w.id)))))));
    }));
    if (!list.children.length) put(list, h('p', { class: 'muted' }, `No words match “${search.value}”.`));
  };
  search.addEventListener('input', draw);
  put(view,
    head({ title: 'Wörter', lead: 'Each topic has a short story, and every word here appears in one. Read the story first: you understand the words in context, then you use them when you retell it. After that they come back in Wiederholen until they stick.' }),
    search, h('div', { style: 'margin-top:20px' }, list));
  draw();
}

function viewWordPractice(id) {
  const st = STORIES[id];
  if (!st) return notFound();
  const { el, body } = frame({ back: ['#/words', 'Wörter'], kicker: `Story: ${st.title}`, title: `Wörter: ${topicById[id].title}` });
  put(view, el);
  st.words.forEach(w => store.srsAddNew(w.id));
  store.save();
  body.append(h('p', { class: 'muted', style: 'margin-bottom:14px' }, 'Say the German word with its article (der/die/das). Nouns without the article count as “almost”.'));
  const box = h('div', {});
  body.append(box);
  drillRunner(box, wordItems(st), { onFinish: updateDue });
}

function notFound() {
  put(view, head({ title: 'Seite nicht gefunden' }), h('a', { class: 'btn btn-primary', href: '#/today' }, 'Go to today'));
}

/* ---------------- Router ---------------- */
const ROUTES = [
  [/^#?\/?(today)?$/, viewToday, 'today'],
  [/^#\/plan$/, viewPlan, 'plan'],
  [/^#\/day\/(\d+)$/, viewDay, 'plan'],
  [/^#\/day\/(\d+)\/(\w+)$/, viewBlock, 'today'],
  [/^#\/practice$/, viewPractice, 'practice'],
  [/^#\/grammar\/(\w+)$/, viewGrammar, 'practice'],
  [/^#\/topic\/(\w+)$/, viewTopic, 'practice'],
  [/^#\/topic\/(\w+)\/(\w+)$/, viewTopicActivity, 'practice'],
  [/^#\/review$/, viewReview, 'review'],
  [/^#\/exam$/, viewExam, 'exam'],
  [/^#\/exam\/(mock|vortrag|diskussion)\/([\w-]+)$/, viewExamRun, 'exam'],
  [/^#\/progress$/, viewProgress, 'progress'],
  [/^#\/words$/, viewWords, 'words'],
  [/^#\/words\/(\w+)$/, viewWordPractice, 'words'],
];

function route() {
  runCleanup();
  window.speechSynthesis?.cancel();
  const hash = location.hash || '#/today';
  for (const [re, fn, nav] of ROUTES) {
    const m = hash.match(re);
    if (m) {
      document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === nav));
      fn(...m.slice(1).filter(x => x !== undefined && x !== 'today'));
      updateDue();
      view.focus({ preventScroll: true });
      window.scrollTo(0, 0);
      return;
    }
  }
  notFound();
}

applyTheme();
window.addEventListener('hashchange', route);
route();

// The speaking exercises. Each runner renders into `root`.
import { h, put, mic, renderDiff, dots, playBtn, iconPlay, fmt, every, onCleanup } from './ui.js';
import { speak, stopSpeaking, startRecording } from './speech.js';
import { gradeAnswer, alignWords, similarity, keywordMatch } from './match.js';
import { analyzeSpeech, REDEMITTEL, TASK_CATEGORIES } from './analyze.js';
import { recordAttempt, srsAdd, srsAddNew, srsResult, save } from './store.js';
import { FOLLOW_UPS } from './data/topics.js';

const VERDICT = { correct: 'Richtig', close: 'Fast richtig', wrong: 'Noch nicht' };

/* ------------------------------------------------------------------ */
/* Drills: speak the answer, get a word-by-word comparison.            */
/* mode 'learn' adds mistakes to review; mode 'srs' moves review boxes. */
/* ------------------------------------------------------------------ */
export function drillRunner(root, items, { mode = 'learn', onFinish } = {}) {
  let idx = 0;
  let curMic = null;
  const results = items.map(() => null);

  function show() {
    curMic?.destroy();
    put(root);
    if (idx >= items.length) return summary();
    const it = items[idx];
    const resultBox = h('div', { class: 'stack' });
    let attempted = false;

    curMic = mic({
      onText: said => {
        const g = gradeAnswer(said, it.answers);
        if (!attempted) {
          attempted = true;
          results[idx] = g.grade;
          const ok = g.grade === 'correct';
          recordAttempt(ok);
          if (mode === 'srs') srsResult(it.id, ok);
          else if (!ok) srsAdd(it.id);
        }
        renderResult(g, said);
      },
    });

    function renderResult(g, said) {
      const others = it.answers.filter(a => a !== g.answer);
      const override = g.grade !== 'correct' ? h('button', {
        class: 'btn btn-quiet', type: 'button', onclick: () => {
          results[idx] = 'correct';
          if (mode === 'srs') srsResult(it.id, true);
          override.remove();
          verdict.className = 'verdict correct'; verdict.textContent = VERDICT.correct;
        },
      }, 'I said it correctly – the mic misheard') : null;
      const verdict = h('span', { class: `verdict ${g.grade}` }, VERDICT[g.grade]);
      put(resultBox, 
        h('div', { class: 'spread' }, verdict, override),
        h('p', { class: 'said' }, 'You said: ', h('b', {}, said)),
        g.grade === 'correct' ? h('p', { class: 'diff' }, g.answer) : renderDiff(g.ops),
        others.length ? h('p', { class: 'muted small' }, 'Also correct: ', others.join(' / ')) : null,
        h('div', { class: 'row' },
          playBtn(g.answer, 'Lösung anhören'),
          h('button', { class: 'btn', type: 'button', onclick: () => { put(resultBox); curMic.reset(); curMic.start(); } }, 'Nochmal sprechen'),
          h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { idx++; show(); } }, idx + 1 < items.length ? 'Weiter' : 'Fertig')),
      );
      if (g.grade !== 'correct') speak(g.answer);
    }

    const reveal = h('button', { class: 'btn btn-quiet small', type: 'button', onclick: () => { reveal.replaceWith(h('p', { class: 'muted' }, it.answers[0])); } }, 'Show answer');

    root.append(
      h('div', { class: 'spread' }, dots(results, idx), h('span', { class: 'muted small' }, `${idx + 1} / ${items.length}`)),
      h('div', { class: 'panel stack', style: 'margin-top:14px' },
        h('div', {},
          h('div', { class: 'cue-label' }, it.en ? 'Say it in German' : (it.label || 'Instruction')),
          h('p', { class: 'cue', lang: it.en ? 'en' : 'de' }, it.cue)),
        curMic.el,
        h('div', { class: 'row', style: 'justify-content:center' }, reveal),
        resultBox),
    );
  }

  function summary() {
    const right = results.filter(r => r === 'correct').length;
    const missed = items.filter((_, i) => results[i] !== 'correct');
    root.append(h('div', { class: 'panel stack' },
      h('h2', {}, `${right} von ${items.length} richtig`),
      missed.length ? h('p', { class: 'muted' }, 'These are now in your review list and will come back tomorrow.') : h('p', {}, 'Every one correct. Sehr gut!'),
      missed.length ? h('ul', { class: 'chunk-list' }, missed.map(m => h('li', {}, iconPlay(m.answers[0]), h('div', {}, h('div', { class: 'de' }, m.answers[0]), h('div', { class: 'en' }, m.cue))))) : null,
      h('div', { class: 'row' },
        missed.length ? h('button', { class: 'btn', type: 'button', onclick: () => drillRunner(root, missed, { mode, onFinish }) }, 'Practise the missed ones') : null,
        h('button', { class: 'btn', type: 'button', onclick: () => drillRunner(root, items, { mode, onFinish }) }, 'Start over')),
    ));
    onFinish?.({ right, total: items.length });
  }

  show();
}

/* ------------------------------------------------------------------ */
/* Shadowing: hear it, repeat it, see how close you were.              */
/* ------------------------------------------------------------------ */
export function shadowRunner(root, sentences, { onFinish } = {}) {
  let idx = 0;
  let hideText = false;
  let curMic = null;
  const scores = sentences.map(() => null);

  function show() {
    curMic?.destroy();
    put(root);
    if (idx >= sentences.length) return summary();
    const s = sentences[idx];
    const resultBox = h('div', { class: 'stack' });
    const text = h('p', { class: 'cue', lang: 'de' }, hideText ? '• • •' : s);
    curMic = mic({
      prompt: 'Listen first, then press the mic and repeat at the same speed.',
      onText: said => {
        const sc = Math.round(similarity(said, s) * 100);
        scores[idx] = Math.max(scores[idx] ?? 0, sc);
        recordAttempt(sc >= 85);
        const grade = sc >= 90 ? 'correct' : sc >= 75 ? 'close' : 'wrong';
        text.textContent = s;
        put(resultBox, 
          h('div', { class: 'row' }, h('span', { class: `verdict ${grade}` }, `${sc} %`), h('span', { class: 'muted' }, grade === 'correct' ? 'Clear and accurate.' : grade === 'close' ? 'Close. Listen again for the words in green.' : 'Listen again slowly, then try once more.')),
          renderDiff(alignWords(s, said).ops),
          h('div', { class: 'row' },
            h('button', { class: 'btn', type: 'button', onclick: () => { put(resultBox); curMic.reset(); speak(s).then(() => curMic.start()); } }, 'Listen and repeat again'),
            h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { idx++; show(); } }, idx + 1 < sentences.length ? 'Nächster Satz' : 'Fertig')),
        );
      },
    });
    root.append(
      h('div', { class: 'spread' }, h('span', { class: 'muted small' }, `Satz ${idx + 1} / ${sentences.length}`),
        h('label', { class: 'row small muted' }, h('input', { type: 'checkbox', checked: hideText || null, onchange: e => { hideText = e.target.checked; text.textContent = hideText ? '• • •' : s; } }), 'Hide the text (harder)')),
      h('div', { class: 'panel stack', style: 'margin-top:14px' },
        text,
        h('div', { class: 'row' }, playBtn(s, 'Anhören'), playBtn(s, 'Langsam', { rate: 0.7 })),
        curMic.el, resultBox),
    );
    speak(s);
  }

  function summary() {
    const done = scores.filter(x => x != null);
    const avg = done.length ? Math.round(done.reduce((a, b) => a + b, 0) / done.length) : 0;
    root.append(h('div', { class: 'panel stack' },
      h('h2', {}, `Average: ${avg} %`),
      h('p', { class: 'muted' }, avg >= 85 ? 'Your pronunciation is easy to understand. Next time hide the text.' : 'Repeat the lower-scoring sentences tomorrow. Exaggerate the long vowels and the word endings.'),
      h('button', { class: 'btn', type: 'button', onclick: () => shadowRunner(root, sentences, { onFinish }) }, 'Start over')));
    onFinish?.({ avg });
  }
  show();
}

/* ------------------------------------------------------------------ */
/* Phrases: learn by listening, then produce them from English.        */
/* ------------------------------------------------------------------ */
export function chunkRunner(root, topic, { onFinish } = {}) {
  topic.chunks.forEach(c => srsAddNew(c.id));
  save();
  const items = topic.chunks.map(c => ({ id: c.id, en: true, cue: c.en, answers: [c.de] }));
  put(root, h('div', { class: 'panel stack' },
    h('p', { class: 'muted' }, 'Step 1: play each phrase and say it out loud twice. Step 2: say them from the English, without looking.'),
    h('ul', { class: 'chunk-list' }, topic.chunks.map(c => h('li', {}, iconPlay(c.de), h('div', {}, h('div', { class: 'de', lang: 'de' }, c.de), h('div', { class: 'en' }, c.en))))),
    h('div', { class: 'row' },
      h('button', { class: 'btn', type: 'button', onclick: async () => { for (const c of topic.chunks) { await speak(c.de); await new Promise(r => setTimeout(r, 1800)); } } }, 'Play all with pauses'),
      h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { stopSpeaking(); drillRunner(root, items, { onFinish }); } }, 'Step 2: Jetzt sprechen')),
  ));
}

/* ------------------------------------------------------------------ */
/* Role-play: a scripted partner, you reply freely; keywords check it. */
/* ------------------------------------------------------------------ */
export function roleplayRunner(root, rp, { onFinish } = {}) {
  let step = 0;
  let curMic = null;
  let understood = 0;
  const chat = h('div', { class: 'chat' });
  const controls = h('div', { class: 'stack' });
  put(root, 
    h('p', { class: 'setting' }, rp.setting),
    h('div', { class: 'panel stack', style: 'margin-top:14px' }, chat, controls));

  function partnerSays(text) {
    chat.append(h('div', { class: 'bubble them', lang: 'de' }, h('span', { class: 'who' }, 'Partner'), text));
    return speak(text);
  }

  function next() {
    curMic?.destroy();
    put(controls);
    if (step >= rp.steps.length) return finish();
    const s = rp.steps[step];
    partnerSays(s.partner);
    const feedback = h('div', { class: 'stack' });
    let counted = false;
    curMic = mic({
      prompt: 'Answer in your own words.',
      onText: said => {
        chat.append(h('div', { class: 'bubble me', lang: 'de' }, h('span', { class: 'who' }, 'Du'), said));
        const km = keywordMatch(said, s.expect);
        const ok = km.score >= 0.6;
        if (!counted) { counted = true; recordAttempt(ok); if (ok) understood++; }
        const missing = s.expect.filter((_, i) => !km.hits[i]).map(g => g[0].trim());
        put(feedback, 
          h('div', { class: 'row' }, h('span', { class: `verdict ${ok ? 'correct' : km.score > 0 ? 'close' : 'wrong'}` }, ok ? 'Verstanden' : 'Not quite'),
            !ok && missing.length ? h('span', { class: 'muted' }, 'Try to include: ', missing.join(', ')) : null),
          h('p', { class: 'said' }, 'A natural answer: ', h('b', { lang: 'de' }, s.model)),
          h('div', { class: 'row' },
            playBtn(s.model, 'Anhören'),
            h('button', { class: 'btn', type: 'button', onclick: () => { put(feedback); curMic.reset(); curMic.start(); } }, 'Nochmal antworten'),
            h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { step++; next(); } }, step + 1 < rp.steps.length ? 'Weiter' : 'Gespräch beenden')),
        );
      },
    });
    controls.append(
      h('div', { class: 'task-card' }, h('b', {}, `Your turn · ${step + 1} of ${rp.steps.length}`), s.task),
      curMic.el,
      h('div', { class: 'row', style: 'justify-content:center' },
        h('button', { class: 'btn btn-quiet', type: 'button', onclick: () => speak(s.partner) }, 'Hear the partner again'),
        h('button', { class: 'btn btn-quiet', type: 'button', onclick: () => speak(s.partner, { rate: 0.7 }) }, 'Slower')),
      feedback);
  }

  function finish() {
    put(controls, h('div', { class: 'stack' },
      h('h3', {}, `Gespräch beendet: ${understood} of ${rp.steps.length} replies understood first time`),
      h('p', { class: 'muted' }, 'Do it again without reading the tasks, and answer in longer sentences: add a reason with weil or denn.'),
      h('button', { class: 'btn', type: 'button', onclick: () => roleplayRunner(root, rp, { onFinish }) }, 'Noch einmal')));
    onFinish?.({ understood });
  }

  next();
}

/* ------------------------------------------------------------------ */
/* Analysis card shared by talk, presentation and discussion.          */
/* ------------------------------------------------------------------ */
export function analysisCard(text, secs, kind, audioUrl) {
  const a = analyzeSpeech(text, secs, kind);
  return h('div', { class: 'stack-l' },
    h('div', { class: 'spread' },
      h('div', {}, h('div', { class: 'score' }, `${a.score}`), h('div', { class: 'muted small' }, 'B2 speaking checklist score (offline estimate)')),
      audioUrl ? h('audio', { controls: true, src: audioUrl }) : null),
    h('ul', { class: 'checks' }, a.checks.map(c => h('li', { class: c.ok ? 'yes' : 'no' }, h('span', { class: 'mark' }, c.ok ? '✓' : '✗'), h('b', {}, c.label), h('span', { class: 'muted' }, c.detail)))),
    h('div', { class: 'stack' }, h('h3', {}, 'Exam phrases'),
      h('div', { class: 'phrase-grid' }, a.redemittel.map(r => h('div', {},
        h('b', {}, r.label),
        r.found.length ? h('span', { class: 'found' }, '✓ ', r.found.join(', ')) : h('span', { class: 'muted small' }, 'Try: ', r.suggest.join(' / ')))))),
    h('div', { class: 'stack' }, h('h3', {}, 'What the mic heard'), h('div', { class: 'transcript', lang: 'de' }, text || '—'),
      h('p', { class: 'muted small' }, 'Speech recognition often “cleans up” grammar, so listen to your recording to catch endings and word order.')),
  );
}

function redemittelPanel(kind) {
  const cats = TASK_CATEGORIES[kind];
  return h('details', { class: 'rule' }, h('summary', {}, 'Useful phrases for this task'),
    h('div', { class: 'phrase-grid' }, cats.map(c => h('div', {}, h('b', {}, REDEMITTEL[c].label), h('span', { lang: 'de' }, REDEMITTEL[c].phrases.slice(0, 4).join(' · '))))));
}

/* ------------------------------------------------------------------ */
/* Monologue: Goethe B2 Teil 1 presentation, or free talk.             */
/* ------------------------------------------------------------------ */
export function monologRunner(root, { kind = 'vortrag', title, points = [], prepSec = 120, speakSec = 240, followUps = [], skipBrief = false, onDone }) {
  let recorder = null;

  function brief() {
    put(root, h('div', { class: 'panel stack' },
      h('div', { class: 'cue-label' }, kind === 'vortrag' ? 'Goethe B2 · Sprechen Teil 1: Vortrag (about 4 minutes)' : 'Freies Sprechen'),
      h('h2', { lang: 'de' }, title),
      points.length ? h('ol', { class: 'points', lang: 'de' }, points.map(p => h('li', {}, p))) : null,
      kind === 'vortrag' ? h('p', { class: 'muted' }, 'Start with an introduction and end with a conclusion. Cover all four points.') : null,
      redemittelPanel(kind),
      h('div', { class: 'row' },
        prepSec ? h('button', { class: 'btn btn-primary', type: 'button', onclick: prep }, `Prepare (${Math.round(prepSec / 60)} min)`) : null,
        h('button', { class: prepSec ? 'btn' : 'btn btn-primary', type: 'button', onclick: speakPhase }, 'Start speaking now')),
    ));
  }

  function prep() {
    let left = prepSec;
    const t = h('div', { class: 'big-timer' }, fmt(left), h('small', {}, 'preparation time'));
    const id = every(1000, () => { left--; t.firstChild.textContent = fmt(left); if (left <= 0) { clearInterval(id); speakPhase(); } });
    put(root, h('div', { class: 'panel stack' },
      h('h2', { lang: 'de' }, title),
      points.length ? h('ol', { class: 'points', lang: 'de' }, points.map(p => h('li', {}, p))) : null,
      t,
      h('textarea', { rows: 6, placeholder: 'Notes: keywords only, no full sentences.', lang: 'de' }),
      h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { clearInterval(id); speakPhase(); } }, 'Ready, start speaking'),
    ));
  }

  function speakPhase() {
    let t0 = null;
    const timer = h('div', { class: 'big-timer' }, '0:00', h('small', {}, `target ${fmt(speakSec)}`));
    every(500, () => { if (t0) timer.firstChild.textContent = fmt((Date.now() - t0) / 1000); });
    const m = mic({
      continuous: true, maxSec: speakSec + 60,
      prompt: 'Press the mic and speak. Press again when you finish.',
      onStart: async () => { t0 = Date.now(); recorder = await startRecording(); },
      onText: async (text, secs) => {
        const url = recorder ? await recorder.stop() : null;
        recorder = null;
        result(text, secs, url);
      },
    });
    onCleanup(() => recorder?.cancel());
    put(root, h('div', { class: 'panel stack' },
      h('h2', { lang: 'de' }, title),
      points.length ? h('ol', { class: 'points small muted', lang: 'de' }, points.map(p => h('li', {}, p))) : null,
      timer, m.el));
  }

  function result(text, secs, url) {
    const card = analysisCard(text, secs, kind, url);
    put(root, h('div', { class: 'panel stack-l' },
      h('h2', { lang: 'de' }, title), card,
      h('div', { class: 'row' },
        h('button', { class: 'btn', type: 'button', onclick: speakPhase }, 'Try again'),
        followUps.length ? h('button', { class: 'btn btn-primary', type: 'button', onclick: () => questions(0, { text, secs }) }, 'Answer the examiner’s questions') : null,
        !followUps.length && onDone ? h('button', { class: 'btn btn-primary', type: 'button', onclick: () => onDone({ text, secs }) }, 'Weiter') : null),
    ));
  }

  function questions(i, main) {
    if (i >= followUps.length) { onDone?.(main); return; }
    const q = followUps[i];
    const answer = h('div', { class: 'stack' });
    const m = mic({
      continuous: true, maxSec: 75, prompt: 'Answer in 3–5 sentences.',
      onText: (text, secs) => {
        put(answer, analysisCompact(text, secs),
          h('button', { class: 'btn btn-primary', type: 'button', onclick: () => questions(i + 1, main) }, i + 1 < followUps.length ? 'Next question' : 'Weiter'));
      },
    });
    put(root, h('div', { class: 'panel stack' },
      h('div', { class: 'cue-label' }, `Examiner question ${i + 1} of ${followUps.length}`),
      h('div', { class: 'chat' }, h('div', { class: 'bubble them', lang: 'de' }, h('span', { class: 'who' }, 'Prüfer'), q)),
      m.el, answer));
    speak(q);
  }

  if (skipBrief) speakPhase(); else brief();
}

export function analysisCompact(text, secs) {
  const a = analyzeSpeech(text, secs, 'talk');
  const bad = a.checks.filter(c => !c.ok).slice(0, 3);
  return h('div', { class: 'stack' },
    h('div', { class: 'transcript', lang: 'de' }, text),
    h('p', { class: 'muted small' }, `${a.words} words${a.wpm ? ` · ${a.wpm} words/min` : ''} · linking words: ${a.connectors.join(', ') || 'none'}`),
    bad.length ? h('ul', { class: 'checks' }, bad.map(c => h('li', { class: 'no' }, h('span', { class: 'mark' }, '✗'), h('b', {}, c.label), h('span', { class: 'muted' }, c.detail)))) : h('p', {}, 'Good answer: well linked and long enough.'));
}

/* ------------------------------------------------------------------ */
/* Discussion: Goethe B2 Teil 2. The partner argues, you respond.      */
/* ------------------------------------------------------------------ */
export function discussionRunner(root, { question, partner }, { onDone } = {}) {
  let turn = 0;
  const said = [];
  let totalSecs = 0;
  let curMic = null;
  const chat = h('div', { class: 'chat' });
  const controls = h('div', { class: 'stack' });

  function brief() {
    put(root, h('div', { class: 'panel stack' },
      h('div', { class: 'cue-label' }, 'Goethe B2 · Sprechen Teil 2: Diskussion (about 5 minutes)'),
      h('h2', { lang: 'de' }, question),
      h('p', { class: 'muted' }, 'Your partner gives an opinion four times. React each time: agree or disagree, give a reason and an example. At the end, suggest a compromise.'),
      redemittelPanel('diskussion'),
      h('button', { class: 'btn btn-primary', type: 'button', onclick: begin }, 'Start the discussion')));
  }

  function begin() {
    put(root, h('div', { class: 'panel stack' }, h('h2', { lang: 'de' }, question), chat, controls));
    nextTurn();
  }

  function nextTurn() {
    curMic?.destroy();
    put(controls);
    if (turn >= partner.length) return finish();
    const line = partner[turn];
    chat.append(h('div', { class: 'bubble them', lang: 'de' }, h('span', { class: 'who' }, 'Partner'), line));
    speak(line);
    curMic = mic({
      continuous: true, maxSec: 80,
      prompt: turn === partner.length - 1 ? 'Respond and suggest a compromise.' : 'Respond: agree or disagree, and give a reason.',
      onText: (text, secs) => {
        said.push(text); totalSecs += secs;
        chat.append(h('div', { class: 'bubble me', lang: 'de' }, h('span', { class: 'who' }, 'Du'), text));
        turn++;
        setTimeout(nextTurn, 500);
      },
    });
    controls.append(curMic.el,
      h('div', { class: 'row', style: 'justify-content:center' },
        h('button', { class: 'btn btn-quiet', type: 'button', onclick: () => speak(line) }, 'Hear it again'),
        h('button', { class: 'btn btn-quiet', type: 'button', onclick: () => speak(line, { rate: 0.7 }) }, 'Slower')));
  }

  function finish() {
    const text = said.join(' ');
    put(controls, h('div', { class: 'stack-l' }, h('h3', {}, 'Feedback on your part of the discussion'), analysisCard(text, totalSecs, 'diskussion'),
      h('div', { class: 'row' },
        h('button', { class: 'btn', type: 'button', onclick: () => discussionRunner(root, { question, partner }, { onDone }) }, 'Discuss again'),
        onDone ? h('button', { class: 'btn btn-primary', type: 'button', onclick: () => onDone({ text, secs: totalSecs }) }, 'Weiter') : null)));
  }

  brief();
}

/* ------------------------------------------------------------------ */
/* Free talk: two minutes per question.                                */
/* ------------------------------------------------------------------ */
export function talkRunner(root, questions, { onFinish } = {}) {
  let i = 0;
  let curMic = null;
  function show() {
    curMic?.destroy();
    if (i >= questions.length) {
      put(root, h('div', { class: 'panel stack' }, h('h2', {}, 'Alle Fragen beantwortet'),
        h('p', { class: 'muted' }, 'Tip: answer the same questions again tomorrow and try to beat today’s word count.'),
        h('button', { class: 'btn', type: 'button', onclick: () => talkRunner(root, questions, { onFinish }) }, 'Start over')));
      onFinish?.();
      return;
    }
    const q = questions[i];
    const out = h('div', { class: 'stack' });
    curMic = mic({
      continuous: true, maxSec: 150, prompt: 'Speak for about two minutes. Press again to finish.',
      onText: (text, secs) => put(out, analysisCompact(text, secs),
        h('div', { class: 'row' },
          h('button', { class: 'btn', type: 'button', onclick: () => { put(out); curMic.reset(); } }, 'Answer again'),
          h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { i++; show(); } }, i + 1 < questions.length ? 'Nächste Frage' : 'Fertig'))),
    });
    put(root, 
      h('span', { class: 'muted small' }, `Frage ${i + 1} / ${questions.length}`),
      h('div', { class: 'panel stack', style: 'margin-top:14px' },
        h('div', { class: 'row' }, h('p', { class: 'cue', lang: 'de', style: 'flex:1' }, q), iconPlay(q)),
        curMic.el, out));
    speak(q);
  }
  show();
}

/* ------------------------------------------------------------------ */
/* Full mock exam: prep, presentation + questions, discussion.         */
/* ------------------------------------------------------------------ */
export function mockRunner(root, topicA, topicB, { onFinish } = {}) {
  const parts = {};
  let prepMin = 15;

  function intro() {
    const seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Preparation time' },
      [15, 5, 2].map(m => h('button', { type: 'button', 'aria-pressed': String(m === prepMin), onclick: e => { prepMin = m; seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); } }, `${m} min`)));
    put(root, h('div', { class: 'panel stack' },
      h('h2', {}, 'Probeprüfung Sprechen (Goethe-Zertifikat B2 format)'),
      h('ol', { class: 'points' },
        h('li', {}, 'Preparation: both tasks, notes only.'),
        h('li', {}, h('b', {}, 'Teil 1 · Vortrag: '), h('span', { lang: 'de' }, topicA.vortrag.title), ' – about 4 minutes, then the examiner asks two questions.'),
        h('li', {}, h('b', {}, 'Teil 2 · Diskussion: '), h('span', { lang: 'de' }, topicB.diskussion.question), ' – about 5 minutes with your partner.')),
      h('div', { class: 'row' }, h('span', { class: 'muted' }, 'Preparation time'), seg),
      h('button', { class: 'btn btn-primary', type: 'button', onclick: prep }, 'Start the exam')));
  }

  function prep() {
    let left = prepMin * 60;
    const t = h('div', { class: 'big-timer' }, fmt(left), h('small', {}, 'preparation'));
    const id = every(1000, () => { left--; t.firstChild.textContent = fmt(left); if (left <= 0) { clearInterval(id); teil1(); } });
    put(root, h('div', { class: 'panel stack' }, t,
      h('div', { class: 'two-col' },
        h('div', { class: 'stack' }, h('h3', {}, 'Teil 1: ', topicA.vortrag.title), h('ol', { class: 'points small', lang: 'de' }, topicA.vortrag.points.map(p => h('li', {}, p))), h('textarea', { rows: 6, placeholder: 'Notes for the presentation', lang: 'de' })),
        h('div', { class: 'stack' }, h('h3', {}, 'Teil 2: ', topicB.diskussion.question), h('textarea', { rows: 6, placeholder: 'Arguments for and against', lang: 'de' }))),
      h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { clearInterval(id); teil1(); } }, 'Ready: start Teil 1')));
  }

  function teil1() {
    monologRunner(root, {
      kind: 'vortrag', title: topicA.vortrag.title, points: topicA.vortrag.points, prepSec: 0, speakSec: 240,
      followUps: FOLLOW_UPS.slice(0, 2), skipBrief: true,
      onDone: r => { parts.vortrag = r; teil2(); },
    });
  }

  function teil2() {
    discussionRunner(root, topicB.diskussion, { onDone: r => { parts.diskussion = r; report(); } });
  }

  function report() {
    const a = analyzeSpeech(parts.vortrag?.text || '', parts.vortrag?.secs || 0, 'vortrag');
    const b = analyzeSpeech(parts.diskussion?.text || '', parts.diskussion?.secs || 0, 'diskussion');
    put(root, h('div', { class: 'panel stack-l' },
      h('h2', {}, 'Ergebnis der Probeprüfung'),
      h('div', { class: 'stat-line' },
        h('div', {}, h('b', {}, a.score), h('span', { class: 'muted small' }, 'Teil 1 Vortrag')),
        h('div', {}, h('b', {}, b.score), h('span', { class: 'muted small' }, 'Teil 2 Diskussion')),
        h('div', {}, h('b', {}, a.words + b.words), h('span', { class: 'muted small' }, 'words spoken'))),
      h('p', { class: 'muted' }, 'A score above 70 on both parts means you are covering what B2 examiners look for: structure, linking, opinions with reasons, and reacting to your partner. The checklist can’t hear grammar mistakes, so listen to your recordings too.'),
      h('h3', {}, 'Teil 1 · Vortrag'), analysisCard(parts.vortrag?.text || '', parts.vortrag?.secs || 0, 'vortrag'),
      h('h3', {}, 'Teil 2 · Diskussion'), analysisCard(parts.diskussion?.text || '', parts.diskussion?.secs || 0, 'diskussion'),
      h('button', { class: 'btn', type: 'button', onclick: intro }, 'Take the exam again')));
    onFinish?.({ a: a.score, b: b.score });
  }

  intro();
}

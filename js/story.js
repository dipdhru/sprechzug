// Comprehensible input: listen → read with glosses → answer questions → retell.
import { h, put, mic, playBtn, iconPlay, onCleanup } from './ui.js';
import { speak, stopSpeaking } from './speech.js';
import { keywordMatch, normalize } from './match.js';
import { recordAttempt, srsAddNew, save, storyState, updateStory } from './store.js';
import { parsePara, plain } from './data/stories.js';
import { analysisCompact } from './runners.js';

const STEPS = ['Hören', 'Lesen', 'Fragen', 'Nacherzählen'];
const RATINGS = ['Wenig', 'Etwa die Hälfte', 'Das meiste', 'Fast alles'];

export function wordUsed(text, w) {
  const t = ` ${normalize(text)} `;
  return w.stems.some(s => t.includes(` ${normalize(s)}`));
}

export function storyRunner(root, story, { onFinish } = {}) {
  let step = 0;
  let slow = false;
  let playing = false;
  let curMic = null;
  const byKey = Object.fromEntries(story.words.map(w => [w.key, w]));
  const n = story.paras.length;

  const stopPlayback = () => { playing = false; stopSpeaking(); };
  onCleanup(stopPlayback);

  async function playAll(onPara) {
    stopPlayback();
    await new Promise(r => setTimeout(r, 50));
    playing = true;
    for (let i = 0; i < n && playing; i++) {
      onPara?.(i);
      await speak(plain(story.paras[i]), { rate: slow ? 0.75 : undefined });
    }
    playing = false;
    onPara?.(-1);
  }

  function go(i) {
    stopPlayback();
    curMic?.destroy();
    curMic = null;
    step = i;
    render();
    root.scrollIntoView?.({ block: 'start' });
  }

  function stepper() {
    return h('ol', { class: 'stepper' }, STEPS.map((s, i) => h('li', { class: i === step ? 'now' : i < step ? 'done' : '' },
      h('button', { type: 'button', 'aria-current': i === step ? 'step' : null, onclick: () => go(i) }, h('span', { class: 'step-n' }, i + 1), s))));
  }

  function slowToggle() {
    return h('label', { class: 'row small muted' },
      h('input', { type: 'checkbox', checked: slow || null, onchange: e => { slow = e.target.checked; } }), 'Langsamer');
  }

  /* 1 · Listen without the text */
  function listen() {
    const status = h('p', { class: 'muted', 'aria-live': 'polite' }, 'Press play. Listen without reading.');
    const prev = storyState(story.topic).ratings;
    return h('div', { class: 'panel stack' },
      h('h2', { lang: 'de' }, story.title),
      h('p', {}, 'Listen to the whole story first, without the text. Don’t stop at words you don’t know. Follow the story and guess from context. Listen twice if you want.'),
      h('div', { class: 'row' },
        h('button', { class: 'btn btn-primary btn-play', type: 'button', onclick: () => playAll(i => { status.textContent = i >= 0 ? `Absatz ${i + 1} von ${n} …` : 'Ende. Listen again, or rate below.'; }) }, 'Geschichte anhören'),
        h('button', { class: 'btn', type: 'button', onclick: () => { stopPlayback(); status.textContent = 'Stopped.'; } }, 'Stopp'),
        slowToggle()),
      status,
      h('div', { class: 'stack', style: 'margin-top:20px' },
        h('h3', {}, 'Wie viel hast du verstanden?'),
        h('div', { class: 'row' }, RATINGS.map((r, i) => h('button', {
          class: 'btn', type: 'button',
          onclick: () => { updateStory(story.topic, { ratings: [...storyState(story.topic).ratings, i + 1] }); go(1); },
        }, r))),
        prev.length ? h('p', { class: 'muted small' }, `Earlier ratings: ${prev.map(x => RATINGS[x - 1]).join(' → ')}`) : null));
  }

  /* 2 · Read along, tap new words */
  function read() {
    story.words.forEach(w => srsAddNew(w.id));
    save();
    const pop = h('div', { class: 'gloss', hidden: true, role: 'dialog', 'aria-label': 'Word meaning' });
    const paras = story.paras.map((p, i) => h('div', { class: 'story-para' },
      iconPlay(plain(p), `Absatz ${i + 1}`),
      h('p', { lang: 'de' }, parsePara(p).map(tok => tok.key
        ? h('button', { type: 'button', class: 'vw', onclick: e => { e.stopPropagation(); showGloss(e.currentTarget, byKey[tok.key]); } }, tok.text)
        : tok.text))));
    const textBox = h('div', { class: 'story-text' }, paras, pop);

    function showGloss(el, w) {
      put(pop,
        h('div', { class: 'spread' }, h('b', { lang: 'de' }, w.say), iconPlay(w.say)),
        h('p', {}, w.en),
        w.note ? h('p', { class: 'muted small', lang: 'de' }, w.note) : null);
      pop.hidden = false;
      const r = el.getBoundingClientRect();
      const c = textBox.getBoundingClientRect();
      const width = Math.min(300, c.width);
      pop.style.width = `${width}px`;
      pop.style.top = `${r.bottom - c.top + 6}px`;
      pop.style.left = `${Math.max(0, Math.min(r.left - c.left, c.width - width))}px`;
      speak(w.say);
    }
    const hide = () => { pop.hidden = true; };
    const onDoc = e => { if (!pop.contains(e.target)) hide(); };
    const onKey = e => { if (e.key === 'Escape') hide(); };
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    onCleanup(() => { document.removeEventListener('click', onDoc); document.removeEventListener('keydown', onKey); });

    const highlight = i => paras.forEach((p, j) => p.classList.toggle('reading', j === i));
    return h('div', { class: 'stack' },
      h('div', { class: 'panel stack' },
        h('div', { class: 'spread' }, h('h2', { lang: 'de' }, story.title),
          h('div', { class: 'row' },
            h('button', { class: 'btn btn-play', type: 'button', onclick: () => playAll(highlight) }, 'Mitlesen'),
            h('button', { class: 'btn', type: 'button', onclick: () => { stopPlayback(); highlight(-1); } }, 'Stopp'),
            slowToggle())),
        h('p', { class: 'muted small' }, 'Read along while you listen. Tap a highlighted word to hear it and see what it means. Then read one paragraph aloud yourself.'),
        textBox),
      h('details', { class: 'rule panel' },
        h('summary', {}, `All new words (${story.words.length})`),
        h('ul', { class: 'chunk-list' }, story.words.map(w => h('li', {}, iconPlay(w.say),
          h('div', {}, h('div', { class: 'de', lang: 'de' }, w.say, w.note ? h('span', { class: 'muted small' }, `  ·  ${w.note}`) : null), h('div', { class: 'en' }, w.en)))))),
      h('div', { class: 'row' }, h('button', { class: 'btn btn-primary', type: 'button', onclick: () => go(2) }, 'Weiter: Fragen')));
  }

  /* 3 · Comprehension questions, answered out loud */
  function questions(qi = 0) {
    const box = h('div', { class: 'stack' });
    const q = story.questions[qi];
    const feedback = h('div', { class: 'stack' });
    let counted = false;
    curMic?.destroy();
    curMic = mic({
      prompt: 'Answer in a full sentence.',
      onText: said => {
        const km = keywordMatch(said, q.expect);
        const ok = km.score >= 0.6;
        if (!counted) { counted = true; recordAttempt(ok); }
        put(feedback,
          h('span', { class: `verdict ${ok ? 'correct' : km.score > 0 ? 'close' : 'wrong'}` }, ok ? 'Richtig verstanden' : 'Not quite'),
          h('p', { class: 'said' }, 'A good answer: ', h('b', { lang: 'de' }, q.model)),
          h('div', { class: 'row' },
            playBtn(q.model, 'Anhören'),
            h('button', { class: 'btn', type: 'button', onclick: () => { put(feedback); curMic.reset(); curMic.start(); } }, 'Nochmal antworten'),
            h('button', { class: 'btn btn-primary', type: 'button', onclick: () => (qi + 1 < story.questions.length ? put(root, stepper(), questions(qi + 1)) : go(3)) }, qi + 1 < story.questions.length ? 'Nächste Frage' : 'Weiter: Nacherzählen')));
        if (!ok) speak(q.model);
      },
    });
    speak(q.q);
    return put(box, h('div', { class: 'panel stack' },
      h('span', { class: 'muted small' }, `Frage ${qi + 1} / ${story.questions.length}`),
      h('div', { class: 'row' }, h('p', { class: 'cue', lang: 'de', style: 'flex:1' }, q.q), iconPlay(q.q)),
      curMic.el, feedback));
  }

  /* 4 · Retell, using the new words */
  function retell() {
    const chips = story.words.map(w => h('span', { class: 'chip', lang: 'de' }, w.say));
    const out = h('div', { class: 'stack' });
    const best = storyState(story.topic).retellBest;
    curMic = mic({
      continuous: true, maxSec: 240,
      prompt: 'Press the mic and retell the story. Press again when you finish.',
      onText: (text, secs) => {
        const used = story.words.map(w => wordUsed(text, w));
        used.forEach((u, i) => chips[i].classList.toggle('used', u));
        const count = used.filter(Boolean).length;
        updateStory(story.topic, { retellBest: Math.max(best, count), done: true });
        put(out,
          h('h3', {}, `${count} of ${story.words.length} new words used`),
          h('p', { class: 'muted' }, count >= 8 ? 'Sehr gut! These words are becoming yours.' : 'Try again and use at least eight. Words you say yourself stick much better than words you only read.'),
          analysisCompact(text, secs),
          h('div', { class: 'row' },
            h('button', { class: 'btn', type: 'button', onclick: () => { put(out); curMic.reset(); } }, 'Nochmal erzählen'),
            h('a', { class: 'btn', href: `#/words/${story.topic}` }, 'Practise these words')));
        onFinish?.({ used: count });
      },
    });
    return h('div', { class: 'panel stack' },
      h('h2', { lang: 'de' }, `Nacherzählen: ${story.title}`),
      h('p', {}, 'Tell the story in your own words, in 1–2 minutes. Use as many of the new words as you can. They turn green when you use them.'),
      h('div', { class: 'chips' }, chips),
      h('details', { class: 'rule' }, h('summary', {}, 'Need a structure?'),
        h('ol', { class: 'points', lang: 'de' }, story.questions.map(q => h('li', {}, q.q)))),
      best ? h('p', { class: 'muted small' }, `Your best so far: ${best} words.`) : null,
      curMic.el, out);
  }

  function render() {
    const body = step === 0 ? listen() : step === 1 ? read() : step === 2 ? questions(0) : retell();
    put(root, stepper(), body);
  }

  render();
}

// Scripted dialogues: hear both roles, then perform one role with less and less support.
import { h, put, mic, renderDiff, onCleanup } from './ui.js';
import { speak, stopSpeaking } from './speech.js';
import { similarity, alignWords } from './match.js';
import { recordAttempt, dialogBest, saveDialogScore } from './store.js';
import { hint } from './data/dialogues.js';

const LEVELS = [
  { name: 'Anhören', help: 'Listen to the whole dialogue. Turn on the translation if you need it.' },
  { name: 'Mitsprechen', help: 'You play one role. Your lines are shown in full. Say them naturally, like an actor.' },
  { name: 'Mit Hinweisen', help: 'Only the first letter of each word is shown. Say the full line.' },
  { name: 'Frei', help: 'Only the English meaning is shown. Say your line in German from memory.' },
];

export function dialogRunner(root, dlg, { onFinish } = {}) {
  let level = 0;
  let myRole = 'A';
  let showEn = false;
  let playing = false;
  let curMic = null;
  const partner = () => (myRole === 'A' ? 'B' : 'A');

  const stopAll = () => { playing = false; stopSpeaking(); curMic?.destroy(); curMic = null; };
  onCleanup(stopAll);

  function controls() {
    const best = dialogBest(dlg.topic);
    return h('div', { class: 'stack' },
      h('ol', { class: 'stepper' }, LEVELS.map((l, i) => h('li', { class: i === level ? 'now' : '' },
        h('button', { type: 'button', 'aria-current': i === level ? 'step' : null, onclick: () => { level = i; render(); } },
          h('span', { class: 'step-n' }, i + 1), l.name,
          i > 0 && best[`${myRole}${i}`] ? h('span', { class: 'muted small' }, ` ${best[`${myRole}${i}`]}%`) : null)))),
      h('div', { class: 'row' },
        h('span', { class: 'muted' }, 'Your role:'),
        h('div', { class: 'seg', role: 'group', 'aria-label': 'Your role' },
          ['A', 'B'].map(r => h('button', { type: 'button', 'aria-pressed': String(myRole === r), onclick: () => { myRole = r; render(); } }, dlg.roles[r])))),
      h('p', { class: 'muted' }, LEVELS[level].help));
  }

  function bubble(role, de, en, extra) {
    const mine = level > 0 && role === myRole;
    return h('div', { class: `bubble ${mine ? 'me' : 'them'}`, lang: 'de' },
      h('span', { class: 'who' }, dlg.roles[role]), de,
      en ? h('span', { class: 'bubble-en', lang: 'en' }, en) : null, extra || null);
  }

  function enToggle() {
    return h('label', { class: 'row small muted' }, h('input', { type: 'checkbox', checked: showEn || null, onchange: e => {
      showEn = e.target.checked;
      root.querySelectorAll('.chat').forEach(c => c.classList.toggle('hide-en', !showEn));
    } }), 'Show English');
  }

  /* Level 1 · listen to both voices */
  function listen() {
    const rows = dlg.lines.map(([role, de, en]) => h('div', { class: 'dl-row' }, bubble(role, de, en),
      h('button', { class: 'icon-btn', type: 'button', 'aria-label': `Play: ${de}`, onclick: () => speak(de, { role }) })));
    const mark = i => rows.forEach((r, j) => r.classList.toggle('reading', j === i));
    async function playAll() {
      stopAll();
      await new Promise(r => setTimeout(r, 50));
      playing = true;
      for (let i = 0; i < dlg.lines.length && playing; i++) {
        mark(i);
        await speak(dlg.lines[i][1], { role: dlg.lines[i][0] });
        await new Promise(r => setTimeout(r, 250));
      }
      playing = false;
      mark(-1);
    }
    return h('div', { class: 'panel stack' },
      h('div', { class: 'spread' },
        h('div', { class: 'row' },
          h('button', { class: 'btn btn-primary btn-play', type: 'button', onclick: playAll }, 'Ganzen Dialog anhören'),
          h('button', { class: 'btn', type: 'button', onclick: () => { stopAll(); mark(-1); } }, 'Stopp')),
        enToggle()),
      h('div', { class: `chat dl-chat${showEn ? '' : ' hide-en'}` }, rows),
      h('div', { class: 'row' }, h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { level = 1; render(); } }, `Weiter: ${LEVELS[1].name}`)));
  }

  /* Levels 2–4 · perform your role */
  function perform() {
    const chat = h('div', { class: `chat${showEn ? '' : ' hide-en'}` });
    const turn = h('div', { class: 'stack' });
    const scores = [];
    let i = 0;

    async function next() {
      curMic?.destroy();
      curMic = null;
      put(turn);
      if (i >= dlg.lines.length) return finish();
      const [role, de, en] = dlg.lines[i];
      if (role !== myRole) {
        chat.append(bubble(role, de, en));
        playing = true;
        await speak(de, { role });
        if (!playing) return;
        i++;
        return next();
      }
      const prompt = level === 1 ? de : level === 2 ? hint(de) : en;
      const feedback = h('div', { class: 'stack' });
      let counted = false;
      curMic = mic({
        prompt: 'Your line. Press the mic and say it.',
        onText: said => {
          const sc = Math.round(similarity(said, de) * 100);
          if (!counted) { counted = true; scores.push(sc); recordAttempt(sc >= 85); }
          else scores[scores.length - 1] = Math.max(scores[scores.length - 1], sc);
          const grade = sc >= 90 ? 'correct' : sc >= 75 ? 'close' : 'wrong';
          put(feedback,
            h('div', { class: 'row' }, h('span', { class: `verdict ${grade}` }, `${sc} %`),
              h('span', { class: 'muted' }, grade === 'correct' ? 'Sehr gut!' : grade === 'close' ? 'Almost. Check the green words.' : 'Listen to the line and try again.')),
            renderDiff(alignWords(de, said).ops),
            h('div', { class: 'row' },
              h('button', { class: 'btn btn-play', type: 'button', onclick: () => speak(de, { role: myRole }) }, 'Anhören'),
              h('button', { class: 'btn', type: 'button', onclick: () => { put(feedback); curMic.reset(); curMic.start(); } }, 'Nochmal'),
              h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { chat.append(bubble(myRole, de, en)); i++; next(); } }, 'Weiter')));
          if (grade === 'wrong') speak(de, { role: myRole });
        },
      });
      put(turn,
        h('div', { class: 'task-card' },
          h('b', {}, `${dlg.roles[myRole]} · your line`),
          h('span', { class: level === 3 ? '' : 'dl-prompt', lang: level === 3 ? 'en' : 'de' }, prompt)),
        curMic.el,
        h('div', { class: 'row', style: 'justify-content:center' },
          level > 1 ? h('button', { class: 'btn btn-quiet', type: 'button', onclick: e => { e.currentTarget.replaceWith(h('p', { class: 'muted', lang: 'de' }, de)); } }, 'Show the line') : null,
          i > 0 ? h('button', { class: 'btn btn-quiet', type: 'button', onclick: () => speak(dlg.lines[i - 1][1], { role: dlg.lines[i - 1][0] }) }, 'Hear the partner again') : null),
        feedback);
    }

    function finish() {
      const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      saveDialogScore(dlg.topic, `${myRole}${level}`, avg);
      const nextLevel = level < 3 && avg >= 80;
      put(turn, h('div', { class: 'stack' },
        h('h3', {}, `Dialog geschafft: ${avg} % average`),
        h('p', { class: 'muted' }, nextLevel
          ? 'Ready for the next level, with less help.'
          : avg >= 80 ? 'Excellent, you can say this dialogue from memory. Now swap roles.' : 'Do this level once more. Aim for 80 % before you move on.'),
        h('div', { class: 'row' },
          h('button', { class: 'btn', type: 'button', onclick: () => render() }, 'Same level again'),
          h('button', { class: 'btn', type: 'button', onclick: () => { myRole = partner(); render(); } }, `Swap roles (play ${dlg.roles[partner()]})`),
          nextLevel ? h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { level++; render(); } }, `Weiter: ${LEVELS[level + 1].name}`) : null)));
      onFinish?.({ avg });
    }

    setTimeout(next, 0);
    return h('div', { class: 'panel stack' },
      h('div', { class: 'spread' }, h('span', { class: 'muted small' }, `You are ${dlg.roles[myRole]}. ${dlg.roles[partner()]} speaks automatically.`),
        enToggle()),
      chat, turn);
  }

  function render() {
    stopAll();
    put(root, h('p', { class: 'setting' }, dlg.setting), h('div', { style: 'margin-top:14px' }, controls()),
      h('div', { style: 'margin-top:16px' }, level === 0 ? listen() : perform()));
  }

  render();
}

// Small DOM helpers and the shared microphone control.
import { canListen, createListener, speak, micErrorText } from './speech.js';

export function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  for (const c of kids.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

/** replaceChildren that skips null/false (conditional children). */
export function put(el, ...kids) {
  el.replaceChildren(...kids.flat().filter(k => k != null && k !== false));
  return el;
}

// Cleanup functions for the current view (timers, listeners). The router runs them on navigation.
let bag = [];
export const onCleanup = fn => bag.push(fn);
export function runCleanup() { bag.forEach(fn => { try { fn(); } catch { /* ignore */ } }); bag = []; }

export function every(ms, fn) {
  const id = setInterval(fn, ms);
  onCleanup(() => clearInterval(id));
  return id;
}

export const fmt = sec => {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export function playBtn(text, label = 'Anhören', opts = {}) {
  return h('button', { class: 'btn btn-play', type: 'button', onclick: () => speak(text, opts) }, label);
}
export function iconPlay(text, label) {
  return h('button', { class: 'icon-btn', type: 'button', 'aria-label': `Play: ${label || text}`, onclick: () => speak(text) });
}

const MIC_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2.5" width="6" height="11.5" rx="3"/><path d="M5 10.5a7 7 0 0 0 14 0"/><path d="M12 17.5V21.5"/></svg>';
const STOP_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="6.5" width="11" height="11" rx="2"/></svg>';

/**
 * Microphone control with live transcript and a typing fallback.
 * onText(text, seconds) fires once per attempt.
 */
export function mic({ continuous = false, maxSec = 0, prompt, onText, onStart }) {
  const idlePrompt = prompt || (continuous ? 'Press the mic to start, press again when you are done.' : 'Press the mic and say it in German.');
  const live = h('div', { class: 'live', 'aria-live': 'polite' });
  const status = h('div', { class: 'mic-status' }, canListen ? idlePrompt : 'Speech recognition isn’t available in this browser. Type your answer instead.');
  const btn = h('button', { class: 'mic', type: 'button', 'aria-label': 'Start speaking', html: MIC_SVG, hidden: !canListen });
  const input = h('input', { type: 'text', placeholder: 'Antwort tippen …', 'aria-label': 'Type your answer', lang: 'de', autocomplete: 'off' });
  const send = h('button', { class: 'btn', type: 'button' }, 'Senden');
  const typeRow = h('div', { class: 'type-row', hidden: canListen }, input, send);
  const toggle = h('button', { class: 'btn btn-quiet small', type: 'button', hidden: !canListen, onclick: () => { typeRow.hidden = !typeRow.hidden; if (!typeRow.hidden) input.focus(); } }, 'Tippen statt sprechen');

  let errored = false;
  let stopTimer = null;
  let tick = null;

  const setIdle = () => {
    btn.classList.remove('listening');
    btn.innerHTML = MIC_SVG;
    btn.setAttribute('aria-label', 'Start speaking');
    clearTimeout(stopTimer); clearInterval(tick);
  };

  const listener = canListen ? createListener({
    continuous,
    onInterim: t => { live.textContent = t; },
    onError: code => {
      errored = true;
      status.textContent = micErrorText(code);
      if (code !== 'no-speech') typeRow.hidden = false;
    },
    onEnd: (text, secs) => {
      setIdle();
      if (text) { live.textContent = text; status.textContent = 'Got it.'; onText(text, secs); }
      else if (!errored) status.textContent = 'Nothing heard. Press the mic and try again.';
    },
  }) : null;

  function start() {
    if (!listener || listener.listening) return;
    errored = false;
    live.textContent = '';
    btn.classList.add('listening');
    btn.innerHTML = STOP_SVG;
    btn.setAttribute('aria-label', 'Stop speaking');
    const t0 = Date.now();
    status.textContent = continuous ? 'Listening … 0:00' : 'Listening …';
    if (continuous) tick = setInterval(() => { status.textContent = `Listening … ${fmt((Date.now() - t0) / 1000)}${maxSec ? ` of ${fmt(maxSec)}` : ''}`; }, 500);
    if (maxSec) stopTimer = setTimeout(() => listener.stop(), maxSec * 1000);
    onStart?.();
    listener.start();
  }
  function stop() { listener?.stop(); }

  btn.addEventListener('click', () => (listener?.listening ? stop() : start()));
  const submitTyped = () => {
    const v = input.value.trim();
    if (!v) return;
    live.textContent = v;
    input.value = '';
    onText(v, 0);
  };
  send.addEventListener('click', submitTyped);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submitTyped(); });

  onCleanup(() => { listener?.abort(); setIdle(); });

  const el = h('div', { class: 'mic-wrap' }, btn, status, live, toggle, typeRow);
  return {
    el, start, stop,
    destroy() { listener?.abort(); setIdle(); },
    reset() { live.textContent = ''; status.textContent = canListen ? idlePrompt : status.textContent; },
    get listening() { return !!listener?.listening; },
  };
}

export function renderDiff(ops) {
  const out = h('div', { class: 'diff' });
  for (const o of ops) {
    if (o.type === 'ok') out.append(h('span', { class: 'w-ok' }, o.exp), ' ');
    else if (o.type === 'del') out.append(h('span', { class: 'w-miss', title: 'missing' }, o.exp), ' ');
    else if (o.type === 'ins') out.append(h('span', { class: 'w-bad', title: 'not needed' }, o.said), ' ');
    else out.append(h('span', { class: 'w-bad', title: 'you said' }, o.said), ' ', h('span', { class: 'w-fix', title: 'correct' }, o.exp), ' ');
  }
  return out;
}

export function dots(results, current) {
  return h('div', { class: 'progress-dots', 'aria-label': `Item ${current + 1} of ${results.length}` },
    results.map((r, i) => h('span', { class: i === current ? 'now' : r === 'correct' ? 'ok' : r === 'close' ? 'close' : r === 'wrong' ? 'bad' : '' })));
}

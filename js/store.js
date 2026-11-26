// Progress, settings and spaced repetition, kept in localStorage.
const KEY = 'sprechzug.v1';

const defaults = () => ({
  settings: { hours: 3, rate: 0.95, voice: '' },
  days: {},          // { [dayNumber]: { blocks: { blockId: true }, done: false } }
  srs: {},           // { [itemId]: { box: 1..6, due: 'YYYY-MM-DD' } }
  stats: { byDate: {} }, // { date: { spokenSec, studySec, attempts, correct } }
  stories: {},       // { [topicId]: { ratings: [1..4], retellBest: n, done: bool } }
});

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const d = defaults();
      return { ...d, ...parsed, settings: { ...d.settings, ...parsed.settings } };
    }
  } catch { /* storage blocked: run in memory */ }
  return defaults();
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

export const getState = () => state;
export const settings = () => state.settings;

export function setSetting(key, value) {
  state.settings[key] = value;
  save();
}

export function localDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function todayStat() {
  const k = localDate();
  return (state.stats.byDate[k] ??= { spokenSec: 0, studySec: 0, attempts: 0, correct: 0 });
}

export function addSpoken(sec) { todayStat().spokenSec += Math.round(sec); save(); }
export function addStudy(sec) { todayStat().studySec += sec; save(); }
export function recordAttempt(ok) {
  const t = todayStat();
  t.attempts += 1;
  if (ok) t.correct += 1;
  save();
}

// ---- Day progress ----
export function dayProgress(n) {
  return state.days[n] ?? { blocks: {}, done: false };
}
export function markBlock(n, blockId, totalBlocks) {
  const d = (state.days[n] ??= { blocks: {}, done: false });
  d.blocks[blockId] = true;
  if (Object.keys(d.blocks).length >= totalBlocks) d.done = true;
  save();
}
export function currentDay() {
  for (let n = 1; n <= 30; n++) if (!dayProgress(n).done) return n;
  return 30;
}

// ---- Spaced repetition (Leitner boxes) ----
const INTERVALS = [0, 1, 2, 4, 8, 16, 32];

export function srsAdd(id) {          // a mistake: back to box 1, due tomorrow
  state.srs[id] = { box: 1, due: localDate(1) };
  save();
}
export function srsAddNew(id) {       // new material: only if not tracked yet
  if (!state.srs[id]) state.srs[id] = { box: 1, due: localDate(1) };
}
export function srsResult(id, ok) {
  const it = state.srs[id];
  if (!it) return;
  it.box = ok ? Math.min(it.box + 1, 6) : 1;
  it.due = localDate(INTERVALS[it.box]);
  save();
}
export function srsDue() {
  const t = localDate();
  return Object.entries(state.srs).filter(([, v]) => v.due <= t).map(([k]) => k);
}

// ---- Stories (comprehensible input) ----
export function storyState(id) {
  state.stories ??= {};
  return state.stories[id] ?? { ratings: [], retellBest: 0, done: false };
}
export function updateStory(id, patch) {
  state.stories ??= {};
  state.stories[id] = { ...storyState(id), ...patch };
  save();
}
export const srsBox = id => state.srs[id]?.box ?? 0;

// ---- Backup ----
export function exportJSON() { return JSON.stringify(state, null, 2); }
export function importJSON(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || !parsed.settings) throw new Error('Not a Sprechzug backup file.');
  state = { ...defaults(), ...parsed };
  save();
}
export function resetAll() { state = defaults(); save(); }

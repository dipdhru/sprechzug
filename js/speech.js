// Browser speech: text-to-speech (speechSynthesis) and speech-to-text (SpeechRecognition).
import { settings, addSpoken } from './store.js';

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
export const canListen = !!SR;
export const canSpeak = 'speechSynthesis' in window;

let voices = [];
function loadVoices() {
  voices = speechSynthesis.getVoices().filter(v => v.lang && v.lang.toLowerCase().startsWith('de'));
}
if (canSpeak) {
  loadVoices();
  speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}
export const germanVoices = () => voices;

function pickVoice() {
  const chosen = voices.find(v => v.name === settings().voice);
  if (chosen) return chosen;
  // Prefer natural-sounding German voices when present.
  const preferred = ['Google Deutsch', 'Anna', 'Petra', 'Helena', 'Markus', 'Katja', 'Conrad'];
  for (const name of preferred) {
    const v = voices.find(x => x.name.includes(name));
    if (v) return v;
  }
  return voices.find(v => v.lang === 'de-DE') || voices[0];
}

/** A second German voice for the other dialogue role (or the same voice, pitched differently). */
function otherVoice(main) {
  return voices.find(v => v !== main && v.lang === 'de-DE') || voices.find(v => v !== main) || null;
}

/** speak(text, { rate, role: 'B' }) — role 'B' uses a second voice so dialogues have two speakers. */
export function speak(text, { rate, role } = {}) {
  return new Promise(resolve => {
    if (!canSpeak || !text) return resolve();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'de-DE';
    const main = pickVoice();
    let v = main;
    if (role === 'B') {
      const alt = otherVoice(main);
      if (alt) v = alt; else u.pitch = 1.35;
    }
    if (v) u.voice = v;
    u.rate = rate ?? settings().rate;
    // Some mobile engines never fire onend; don't let a dialogue hang on it.
    const maxMs = 3000 + (text.length * 90) / u.rate;
    const timer = setTimeout(resolve, maxMs);
    u.onend = u.onerror = () => { clearTimeout(timer); resolve(); };
    speechSynthesis.speak(u);
  });
}
export const stopSpeaking = () => canSpeak && speechSynthesis.cancel();

/**
 * Listener around SpeechRecognition.
 * continuous: keeps listening (and restarts after browser timeouts) until stop().
 */
export function createListener({ continuous = false, onInterim, onEnd, onError } = {}) {
  let rec = null;
  let active = false;
  let finished = false;
  let finalText = '';
  let interimText = '';
  let startedAt = 0;

  function begin() {
    rec = new SR();
    rec.lang = 'de-DE';
    rec.interimResults = true;
    rec.continuous = continuous;
    rec.maxAlternatives = 1;
    rec.onresult = e => {
      interimText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText = (finalText + ' ' + r[0].transcript.trim()).trim();
        else interimText += r[0].transcript;
      }
      onInterim?.((finalText + ' ' + interimText).trim());
    };
    rec.onerror = e => {
      if (e.error === 'no-speech' && continuous) return;
      if (e.error === 'aborted') return;
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed' || e.error === 'network') active = false;
      onError?.(e.error);
    };
    rec.onend = () => {
      if (active && continuous) {
        try { begin(); return; } catch { /* fall through and finish */ }
      }
      finish();
    };
    rec.start();
  }

  function finish() {
    if (finished) return;
    finished = true;
    active = false;
    const secs = (Date.now() - startedAt) / 1000;
    const text = (finalText || interimText).trim();
    if (text) addSpoken(secs);
    onEnd?.(text, secs);
  }

  return {
    start() {
      if (!SR) { onError?.('unsupported'); return; }
      stopSpeaking();
      active = true; finished = false;
      finalText = ''; interimText = '';
      startedAt = Date.now();
      try { begin(); } catch (err) { onError?.(String(err)); finish(); }
    },
    stop() {
      active = false;
      try { rec?.stop(); } catch { finish(); }
    },
    abort() {
      active = false; finished = true;
      try { rec?.abort(); } catch { /* ignore */ }
    },
    get listening() { return active; },
  };
}

// Optional audio recording so learners can hear themselves.
export async function startRecording() {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return null;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    const chunks = [];
    mr.ondataavailable = e => e.data.size && chunks.push(e.data);
    mr.start();
    return {
      stop: () => new Promise(resolve => {
        mr.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
          resolve(URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || 'audio/webm' })));
        };
        mr.stop();
      }),
      cancel: () => { try { mr.stop(); } catch { /* ignore */ } stream.getTracks().forEach(t => t.stop()); },
    };
  } catch {
    return null;
  }
}

export function micErrorText(code) {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed': return 'Microphone access is blocked. Allow it in the browser’s site settings, then try again.';
    case 'network': return 'Speech recognition needs an internet connection in this browser. Check the connection or type your answer.';
    case 'audio-capture': return 'No microphone found. Plug one in or type your answer.';
    case 'no-speech': return 'Nothing heard. Press the mic and speak a little louder.';
    case 'unsupported': return 'This browser has no speech recognition. Use Chrome, Edge or Safari, or type your answer.';
    default: return `Speech recognition stopped (${code}). Try again or type your answer.`;
  }
}

// The 30-day route from B1.1 to B2. Each day is made of timed speaking blocks.
import { GRAMMAR, grammarById } from './grammar.js';
import { TOPICS, topicById } from './topics.js';
import { STORIES } from './stories.js';
import { DIALOGUES } from './dialogues.js';

const L = (n, g, t) => ({ n, kind: 'learn', grammar: [g], topics: [t] });
const R = (n, g, t, title) => ({ n, kind: 'review', grammar: g, topics: t, title });

export const DAYS = [
  L(1, 'g01', 'arbeit'), L(2, 'g02', 'reisen'), L(3, 'g03', 'wohnen'), L(4, 'g04', 'konsum'),
  L(5, 'g05', 'freizeit'), L(6, 'g06', 'gesundheit'),
  R(7, ['g01', 'g02', 'g03', 'g04', 'g05', 'g06'], ['arbeit', 'reisen', 'wohnen', 'konsum', 'freizeit', 'gesundheit'], 'Rückblick Woche 1'),
  L(8, 'g07', 'umwelt'), L(9, 'g08', 'bildung'), L(10, 'g09', 'ernaehrung'), L(11, 'g10', 'medien'),
  L(12, 'g11', 'gesellschaft'), L(13, 'g12', 'technik'),
  R(14, ['g07', 'g08', 'g09', 'g10', 'g11', 'g12'], ['umwelt', 'bildung', 'ernaehrung', 'medien', 'gesellschaft', 'technik'], 'Rückblick Woche 2'),
  L(15, 'g13', 'arbeit'), L(16, 'g14', 'umwelt'), L(17, 'g15', 'gesundheit'), L(18, 'g16', 'medien'),
  L(19, 'g17', 'bildung'), L(20, 'g18', 'technik'),
  R(21, ['g13', 'g14', 'g15', 'g16', 'g17', 'g18'], ['arbeit', 'umwelt', 'gesundheit', 'medien', 'bildung', 'technik'], 'Rückblick Woche 3'),
  L(22, 'g19', 'gesellschaft'),
  R(23, ['g07', 'g13'], ['wohnen'], 'Passiv kompakt'),
  R(24, ['g14', 'g15'], ['konsum'], 'Nominalstil'),
  R(25, ['g06', 'g12'], ['reisen'], 'Konjunktiv II kompakt'),
  R(26, ['g16', 'g18'], ['freizeit'], 'Berichten und vermuten'),
  R(27, ['g10', 'g17'], ['ernaehrung'], 'Argumentieren mit Konnektoren'),
  { n: 28, kind: 'mock', topics: ['bildung', 'wohnen'], title: 'Probeprüfung 1' },
  { n: 29, kind: 'weak', topics: ['gesellschaft', 'technik'], title: 'Schwachstellen trainieren' },
  { n: 30, kind: 'mock', topics: ['umwelt', 'arbeit'], title: 'Probeprüfung 2' },
];

for (const d of DAYS) {
  if (!d.title) d.title = grammarById[d.grammar[0]].title;
  d.week = Math.min(Math.ceil(d.n / 7), 4);
}

// Deterministic shuffle so a day always shows the same mix.
function seeded(seed) {
  let a = seed * 9301 + 49297;
  return () => { a = (a * 9301 + 49297) % 233280; return a / 233280; };
}
function pick(list, count, seed) {
  const rnd = seeded(seed);
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

const scale = (min, hours) => Math.max(5, Math.round((min * hours) / 3 / 5) * 5);

/** Blocks for a day. Each block: { id, type, title, desc, min, ...payload } */
export function blocksFor(day, hours = 3) {
  const B = [];
  const add = (id, type, title, desc, min, extra = {}) => B.push({ id, type, title, desc, min: scale(min, hours), ...extra });
  const topic = topicById[day.topics[0]];

  if (day.kind === 'learn') {
    const g = grammarById[day.grammar[0]];
    const examType = day.n % 2 ? 'vortrag' : 'diskussion';
    add('review', 'review', 'Wiederholen', 'Speak the phrases and sentences that are due today.', 15);
    add('shadow', 'shadow', 'Shadowing', 'Listen and repeat at full speed to train pronunciation and rhythm.', 10, { sentences: topic.shadow });
    add('grammar', 'grammar', 'Grammatik sprechen', g.title, 30, { units: [g.id], drills: g.drills });
    add('story', 'story', 'Geschichte: Hören & Lesen', `„${STORIES[topic.id].title}“: ${STORIES[topic.id].words.length} new words in context`, 25, { topic: topic.id });
    add('dialog', 'dialog', 'Dialog sprechen', `„${DIALOGUES[topic.id].title}“: rehearse both roles`, 20, { topic: topic.id });
    add('chunks', 'chunks', 'Redewendungen', `${topic.title}: 12 phrases to make your own`, 10, { topic: topic.id });
    add('roleplay', 'roleplay', 'Rollenspiel', topic.roleplay.title, 20, { topic: topic.id });
    add('exam', examType, examType === 'vortrag' ? 'Prüfung: Vortrag' : 'Prüfung: Diskussion',
      examType === 'vortrag' ? topic.vortrag.title : topic.diskussion.question, 30, { topic: topic.id });
    add('talk', 'talk', 'Freies Sprechen', 'Talk for two minutes about each question.', 10, { questions: topic.talk });
  } else if (day.kind === 'review') {
    const drills = day.grammar.flatMap((gid, i) => pick(grammarById[gid].drills, day.grammar.length > 2 ? 3 : 6, day.n * 10 + i));
    const shadow = day.topics.flatMap((tid, i) => pick(topicById[tid].shadow, day.topics.length > 1 ? 1 : 6, day.n + i));
    const rpTopic = topicById[pick(day.topics, 1, day.n)[0]];
    const vTopic = topicById[pick(day.topics, 1, day.n + 3)[0]];
    const questions = day.topics.flatMap((tid, i) => pick(topicById[tid].talk, day.topics.length > 1 ? 1 : 4, day.n + i));
    add('review', 'review', 'Wiederholen', 'Everything that is due, plus your recent mistakes.', 20);
    add('grammar', 'grammar', 'Grammatik-Mix', day.grammar.map(id => grammarById[id].title.split(':')[0]).join(' · '), 30, { units: day.grammar, drills });
    add('story', 'story', 'Geschichte: noch einmal', `„${STORIES[rpTopic.id].title}“: listen again, then retell it better`, 20, { topic: rpTopic.id });
    add('shadow', 'shadow', 'Shadowing-Mix', 'Sentences from this week’s topics.', 15, { sentences: shadow });
    add('roleplay', 'roleplay', 'Rollenspiel', rpTopic.roleplay.title, 30, { topic: rpTopic.id });
    add('exam', day.n % 2 ? 'vortrag' : 'diskussion', day.n % 2 ? 'Prüfung: Vortrag' : 'Prüfung: Diskussion',
      day.n % 2 ? vTopic.vortrag.title : vTopic.diskussion.question, 30, { topic: vTopic.id });
    add('talk', 'talk', 'Freies Sprechen', 'Mixed questions from this stretch.', 20, { questions });
  } else if (day.kind === 'mock') {
    add('review', 'review', 'Wiederholen', 'A warm-up with your due items.', 20);
    add('mock', 'mock', 'Probeprüfung Sprechen', 'Goethe B2 format: prepare, give a talk, answer questions, then discuss.', 60, { topics: day.topics });
    add('roleplay', 'roleplay', 'Rollenspiel', topicById[day.topics[1]].roleplay.title, 30, { topic: day.topics[1] });
    add('talk', 'talk', 'Freies Sprechen', 'Cool down: talk freely.', 20, { questions: topicById[day.topics[1]].talk });
    add('grammar', 'grammar', 'Grammatik-Blitz', 'One drill from every unit.', 30, { units: GRAMMAR.map(g => g.id), drills: GRAMMAR.map((g, i) => pick(g.drills, 1, day.n + i)[0]) });
  } else if (day.kind === 'weak') {
    add('review', 'review', 'Fehler wiederholen', 'All of your due items and past mistakes.', 40);
    add('grammar', 'grammar', 'Grammatik B2 komplett', 'Two drills from every unit.', 45, { units: GRAMMAR.map(g => g.id), drills: GRAMMAR.flatMap((g, i) => pick(g.drills, 2, day.n * 3 + i)) });
    add('roleplay', 'roleplay', 'Rollenspiel', topicById[day.topics[0]].roleplay.title, 30, { topic: day.topics[0] });
    add('exam', 'diskussion', 'Prüfung: Diskussion', topicById[day.topics[1]].diskussion.question, 30, { topic: day.topics[1] });
    add('talk', 'talk', 'Freies Sprechen', 'Questions from several topics.', 20, { questions: TOPICS.map((t, i) => pick(t.talk, 1, i)[0]).slice(0, 6) });
  }
  return B;
}

export const dayByNumber = n => DAYS.find(d => d.n === n);

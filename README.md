# Sprechzug – B1 → B2 German speaking trainer

A speaking-first web app: a 30-day plan of 2–3 hours a day, from B1.1 to B2 speaking.
No account, no API key, no build step. Your progress is saved in your browser.

## Start it

```bash
cd ~/LearnGerman && python3 -m http.server 8765 --bind 127.0.0.1
```

Then open <http://localhost:8765> in **Chrome** (best), Edge or Safari and allow the microphone.

The mic only works on `localhost` or https, so opening `index.html` directly as a file won't work.

## What's inside

| Part | What you do |
|---|---|
| **Heute** | Today's plan: 7 timed blocks (≈ 3 h, or ≈ 2 h in Fortschritt → Settings) |
| **Fahrplan** | The 30-day route: 19 grammar units, 12 topics, review days, 2 mock exams |
| Grammatik sprechen | Say the transformed sentence; word-by-word feedback |
| Shadowing | Hear a sentence, repeat it, get a similarity score |
| Geschichte | 12 short stories (comprehensible input): listen → read with tap-to-gloss → answer questions → retell using the new words |
| **Wörter** | 169 B1+/B2 words from the stories, with article, plural and review status; practise per topic |
| Redewendungen | 144 useful phrases, learned by ear, then produced from English |
| Rollenspiel | 12 scripted conversations (doctor, job interview, landlord, hotel …) |
| Prüfung | Goethe B2 Sprechen Teil 1 (presentation) and Teil 2 (discussion), timed, with recording |
| Wiederholen | Spaced repetition: your mistakes come back after 1, 2, 4, 8 and 16 days |

## Honest limits

- In Chrome, speech recognition is sent to Google's servers, so it needs internet. Safari can work on-device.
- Recognition tends to "auto-correct" grammar. Use the recording playback in the exam tasks to check your endings.
- The free-speaking feedback is a checklist (length, pace, linking words, Konjunktiv II, passive voice, exam phrases), not a teacher's grade.
- Progress lives in this browser's storage. Use **Fortschritt → Export backup** before clearing data or switching browsers.

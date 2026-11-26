// Scripted everyday dialogues, one per topic. Learners rehearse one role at increasing difficulty.
// Each line: [role, German, English]. Roles are 'A' and 'B'.

export const DIALOGUES = {
  arbeit: {
    title: 'Mehr Homeoffice?', setting: 'An employee asks her boss for an extra day of working from home.',
    roles: { A: 'Mitarbeiterin', B: 'Chef' },
    lines: [
      ['A', 'Hätten Sie kurz Zeit? Ich würde gern etwas mit Ihnen besprechen.', 'Do you have a moment? I’d like to discuss something with you.'],
      ['B', 'Natürlich, kommen Sie rein. Worum geht es denn?', 'Of course, come in. What is it about?'],
      ['A', 'Es geht um das Homeoffice. Wäre es möglich, dass ich drei statt zwei Tage pro Woche von zu Hause arbeite?', 'It’s about working from home. Would it be possible for me to work from home three days a week instead of two?'],
      ['B', 'Hm, warum ist Ihnen das so wichtig?', 'Hm, why is that so important to you?'],
      ['A', 'Ich brauche jeden Tag fast zwei Stunden für den Arbeitsweg. Zu Hause kann ich mich außerdem besser konzentrieren.', 'I need almost two hours a day for my commute. At home I can also concentrate better.'],
      ['B', 'Das verstehe ich. Aber die Besprechungen mit dem Team sind mir sehr wichtig.', 'I understand. But the team meetings are very important to me.'],
      ['A', 'Das sehe ich genauso. Ich könnte alle Besprechungen an den Bürotagen einplanen.', 'I agree. I could schedule all meetings on the office days.'],
      ['B', 'Gut, dann probieren wir es drei Monate lang aus. Danach sprechen wir noch einmal darüber.', 'Good, then let’s try it for three months. After that we’ll talk about it again.'],
      ['A', 'Das klingt fair. Vielen Dank für Ihr Verständnis!', 'That sounds fair. Thank you for your understanding!'],
      ['B', 'Gern geschehen. Schicken Sie mir bitte noch eine kurze E-Mail dazu.', 'You’re welcome. Please send me a short email about it.'],
    ],
  },
  wohnen: {
    title: 'Zu laut!', setting: 'A tenant politely asks the upstairs neighbour to keep the music down.',
    roles: { A: 'Mieterin', B: 'Nachbar' },
    lines: [
      ['A', 'Guten Abend, entschuldigen Sie die Störung. Ich wohne direkt unter Ihnen.', 'Good evening, sorry to disturb you. I live right below you.'],
      ['B', 'Ach, guten Abend. Was kann ich für Sie tun?', 'Oh, good evening. What can I do for you?'],
      ['A', 'Es ist mir etwas unangenehm, aber die Musik ist abends oft sehr laut.', 'This is a bit awkward, but the music is often very loud in the evening.'],
      ['B', 'Oh, das tut mir leid. Das war mir gar nicht bewusst.', 'Oh, I’m sorry. I wasn’t aware of that at all.'],
      ['A', 'Kein Problem. Ich muss nur jeden Morgen um fünf Uhr aufstehen.', 'No problem. It’s just that I have to get up at five every morning.'],
      ['B', 'Verstehe. Ab wann soll es denn ruhig sein?', 'I see. From what time should it be quiet?'],
      ['A', 'Laut Hausordnung ist ab zweiundzwanzig Uhr Nachtruhe. Wäre das für Sie in Ordnung?', 'According to the house rules, quiet time starts at 10 pm. Would that be OK for you?'],
      ['B', 'Ja, natürlich. Und wenn es doch mal zu laut ist, klingeln Sie einfach.', 'Yes, of course. And if it’s ever too loud, just ring the bell.'],
      ['A', 'Vielen Dank, das ist sehr nett von Ihnen.', 'Thank you, that’s very kind of you.'],
      ['B', 'Keine Ursache. Schönen Abend noch!', 'Don’t mention it. Have a nice evening!'],
    ],
  },
  gesundheit: {
    title: 'In der Apotheke', setting: 'A customer with a cold asks the pharmacist for advice.',
    roles: { A: 'Kunde', B: 'Apothekerin' },
    lines: [
      ['B', 'Guten Tag, was darf es sein?', 'Hello, what can I get you?'],
      ['A', 'Hallo, ich habe seit gestern Halsschmerzen und Schnupfen. Können Sie mir etwas empfehlen?', 'Hello, I’ve had a sore throat and a runny nose since yesterday. Can you recommend something?'],
      ['B', 'Haben Sie auch Fieber?', 'Do you have a fever as well?'],
      ['A', 'Nein, zum Glück nicht. Aber ich fühle mich ziemlich schlapp.', 'No, luckily not. But I feel pretty worn out.'],
      ['B', 'Dann empfehle ich Ihnen diese Lutschtabletten und ein Nasenspray.', 'Then I recommend these throat lozenges and a nasal spray.'],
      ['A', 'Wie oft soll ich die Tabletten nehmen?', 'How often should I take the lozenges?'],
      ['B', 'Alle drei bis vier Stunden eine, aber nicht mehr als sechs am Tag.', 'One every three to four hours, but not more than six a day.'],
      ['A', 'Gibt es Nebenwirkungen?', 'Are there any side effects?'],
      ['B', 'Normalerweise nicht. Wenn es in drei Tagen nicht besser wird, gehen Sie bitte zum Arzt.', 'Usually not. If it isn’t better in three days, please go to the doctor.'],
      ['A', 'Mache ich. Was bekomme ich von Ihnen?', 'I will. How much do I owe you?'],
      ['B', 'Das macht zusammen fünfzehn Euro. Gute Besserung!', 'That’s fifteen euros altogether. Get well soon!'],
    ],
  },
  umwelt: {
    title: 'Mit dem Rad zur Arbeit?', setting: 'Two colleagues talk about how they get to work.',
    roles: { A: 'Kollegin', B: 'Kollege' },
    lines: [
      ['A', 'Sag mal, fährst du eigentlich immer noch jeden Tag mit dem Auto ins Büro?', 'Tell me, do you actually still drive to the office every day?'],
      ['B', 'Ja, leider. Mit dem Bus brauche ich fast eine Stunde.', 'Yes, unfortunately. By bus it takes me almost an hour.'],
      ['A', 'Hast du schon mal über ein E-Bike nachgedacht? Ich fahre seit einem Jahr damit.', 'Have you ever thought about an e-bike? I’ve been riding one for a year.'],
      ['B', 'Ehrlich gesagt nicht. Ist das nicht ziemlich teuer?', 'Honestly, no. Isn’t that pretty expensive?'],
      ['A', 'Am Anfang schon, aber man spart viel Geld für Benzin und Parken.', 'At first, yes, but you save a lot of money on petrol and parking.'],
      ['B', 'Und was machst du, wenn es regnet?', 'And what do you do when it rains?'],
      ['A', 'Dann ziehe ich eine Regenjacke an. Und bei Schnee fahre ich mit der Bahn.', 'Then I put on a rain jacket. And when it snows I take the train.'],
      ['B', 'Hm, das klingt eigentlich vernünftig. Und gut für die Umwelt ist es auch.', 'Hm, that actually sounds sensible. And it’s good for the environment too.'],
      ['A', 'Genau. Unsere Firma zahlt sogar einen Teil, wenn man ein Dienstrad least.', 'Exactly. Our company even pays part of it if you lease a company bike.'],
      ['B', 'Wirklich? Dann frage ich morgen gleich in der Personalabteilung nach.', 'Really? Then I’ll ask HR about it first thing tomorrow.'],
    ],
  },
  medien: {
    title: 'Zu viele Abos', setting: 'A couple notice how much they pay for streaming services.',
    roles: { A: 'Sara', B: 'Tom' },
    lines: [
      ['A', 'Schau mal, wir bezahlen inzwischen für vier Streamingdienste. Das sind fast fünfzig Euro im Monat!', 'Look, we now pay for four streaming services. That’s almost fifty euros a month!'],
      ['B', 'Echt? So viel? Das war mir gar nicht klar.', 'Really? That much? I didn’t realise.'],
      ['A', 'Ich finde, wir sollten mindestens zwei davon kündigen.', 'I think we should cancel at least two of them.'],
      ['B', 'Einverstanden, aber nicht den mit den Serien. Den nutze ich jeden Abend.', 'Agreed, but not the one with the series. I use it every evening.'],
      ['A', 'Okay. Aber den Sportkanal schaut eigentlich keiner mehr.', 'Okay. But nobody really watches the sports channel any more.'],
      ['B', 'Stimmt. Und den vierten haben wir doch nur wegen eines einzigen Films abonniert.', 'True. And we only subscribed to the fourth one because of a single film.'],
      ['A', 'Genau. Dann kündige ich die beiden heute noch.', 'Exactly. Then I’ll cancel both of them today.'],
      ['B', 'Gute Idee. Und vom gesparten Geld gehen wir mal wieder richtig ins Kino.', 'Good idea. And with the money we save, we’ll go to a proper cinema again.'],
    ],
  },
  bildung: {
    title: 'Lernpartner gesucht', setting: 'Two students in a B2 course agree to practise for the exam together.',
    roles: { A: 'Ravi', B: 'Carla' },
    lines: [
      ['A', 'Hallo, du bist doch auch im B2-Kurs, oder?', 'Hi, you’re in the B2 course too, aren’t you?'],
      ['B', 'Ja, genau. Ich heiße Carla. Und du?', 'Yes, exactly. I’m Carla. And you?'],
      ['A', 'Ich bin Ravi. Sag mal, hättest du Lust, zusammen für die Prüfung zu üben?', 'I’m Ravi. Tell me, would you like to practise for the exam together?'],
      ['B', 'Sehr gern! Am schwierigsten finde ich den mündlichen Teil.', 'I’d love to! I find the speaking part the hardest.'],
      ['A', 'Mir geht es genauso. Wir könnten uns zweimal pro Woche treffen und Diskussionen üben.', 'Same for me. We could meet twice a week and practise discussions.'],
      ['B', 'Gute Idee. Passen dir Dienstag und Donnerstag nach dem Kurs?', 'Good idea. Do Tuesday and Thursday after class suit you?'],
      ['A', 'Dienstag ja, aber donnerstags arbeite ich. Wie wäre es mit Freitag?', 'Tuesday yes, but I work on Thursdays. How about Friday?'],
      ['B', 'Freitag geht auch. Sollen wir uns in der Bibliothek treffen?', 'Friday works too. Shall we meet in the library?'],
      ['A', 'Da muss man leise sein. Lass uns lieber ins Café nebenan gehen.', 'You have to be quiet there. Let’s go to the café next door instead.'],
      ['B', 'Stimmt, da hast du recht. Also dann bis Dienstag!', 'True, you’re right. See you on Tuesday then!'],
    ],
  },
  reisen: {
    title: 'Zug ausgefallen', setting: 'A traveller’s train has been cancelled. He asks at the ticket office.',
    roles: { A: 'Reisender', B: 'Bahnmitarbeiterin' },
    lines: [
      ['A', 'Guten Tag, mein Zug nach Berlin ist ausgefallen. Was kann ich jetzt machen?', 'Hello, my train to Berlin has been cancelled. What can I do now?'],
      ['B', 'Darf ich mal Ihr Ticket sehen?', 'May I see your ticket?'],
      ['A', 'Ja, hier, bitte. Ich habe ein Sparpreis-Ticket.', 'Yes, here you are. I have a saver fare ticket.'],
      ['B', 'Kein Problem. Die Zugbindung ist aufgehoben. Sie können jeden anderen Zug nehmen.', 'No problem. The train restriction has been lifted. You can take any other train.'],
      ['A', 'Wann fährt denn der nächste Zug?', 'When does the next train leave?'],
      ['B', 'In zwanzig Minuten von Gleis sieben. Sie müssen allerdings in Hannover umsteigen.', 'In twenty minutes from platform seven. You do have to change in Hanover, though.'],
      ['A', 'Und bekomme ich eine Entschädigung, wenn ich später ankomme?', 'And will I get compensation if I arrive later?'],
      ['B', 'Ja, ab sechzig Minuten Verspätung. Das Formular finden Sie in der App.', 'Yes, from a delay of sixty minutes. You’ll find the form in the app.'],
      ['A', 'Super, vielen Dank für die Hilfe.', 'Great, thank you very much for your help.'],
      ['B', 'Gern. Gute Reise!', 'You’re welcome. Have a good trip!'],
    ],
  },
  konsum: {
    title: 'Ein neues Handy', setting: 'A customer is buying a phone in an electronics shop.',
    roles: { A: 'Kundin', B: 'Verkäufer' },
    lines: [
      ['B', 'Hallo, kann ich Ihnen helfen?', 'Hello, can I help you?'],
      ['A', 'Ja, gern. Ich suche ein neues Handy, aber es sollte nicht zu teuer sein.', 'Yes, please. I’m looking for a new phone, but it shouldn’t be too expensive.'],
      ['B', 'Wie viel möchten Sie denn ungefähr ausgeben?', 'About how much would you like to spend?'],
      ['A', 'Höchstens dreihundert Euro. Wichtig sind mir eine gute Kamera und ein starker Akku.', 'Three hundred euros at most. A good camera and a strong battery are important to me.'],
      ['B', 'Dann kann ich Ihnen dieses Modell empfehlen. Es ist gerade im Angebot.', 'Then I can recommend this model. It’s on offer right now.'],
      ['A', 'Und wie lange hält der Akku?', 'And how long does the battery last?'],
      ['B', 'Bei normaler Nutzung etwa zwei Tage.', 'With normal use, about two days.'],
      ['A', 'Das klingt gut. Kann ich das Handy zurückgeben, wenn es mir nicht gefällt?', 'That sounds good. Can I return the phone if I don’t like it?'],
      ['B', 'Ja, innerhalb von vierzehn Tagen, mit Kassenbon und Originalverpackung.', 'Yes, within fourteen days, with the receipt and the original packaging.'],
      ['A', 'Perfekt, dann nehme ich es. Kann ich mit Karte zahlen?', 'Perfect, then I’ll take it. Can I pay by card?'],
      ['B', 'Selbstverständlich. Die Kasse ist gleich da vorne.', 'Of course. The till is right over there.'],
    ],
  },
  gesellschaft: {
    title: 'Eine Einladung zum Essen', setting: 'A new colleague has been invited to dinner and asks what is expected.',
    roles: { A: 'Gast', B: 'Gastgeberin' },
    lines: [
      ['A', 'Danke noch mal für die Einladung zum Abendessen am Samstag!', 'Thanks again for the dinner invitation on Saturday!'],
      ['B', 'Gern! Wir freuen uns, dass du kommst.', 'You’re welcome! We’re glad you’re coming.'],
      ['A', 'Soll ich etwas mitbringen? Bei uns bringt man immer etwas zu essen mit.', 'Shall I bring something? Where I’m from, you always bring some food.'],
      ['B', 'Das ist lieb, aber nicht nötig. Wenn du möchtest, kannst du eine Flasche Wein oder Blumen mitbringen.', 'That’s sweet, but not necessary. If you like, you can bring a bottle of wine or flowers.'],
      ['A', 'Alles klar. Und wann genau soll ich da sein?', 'All right. And when exactly should I be there?'],
      ['B', 'So gegen sieben. Aber bitte nicht zu früh, dann koche ich noch!', 'Around seven. But please not too early, I’ll still be cooking!'],
      ['A', 'Keine Sorge. In Deutschland ist man ja lieber pünktlich.', 'Don’t worry. In Germany people prefer to be punctual.'],
      ['B', 'Genau. Isst du eigentlich alles, oder gibt es etwas, das du nicht magst?', 'Exactly. Do you eat everything, or is there something you don’t like?'],
      ['A', 'Ich esse kein Schweinefleisch, aber sonst alles.', 'I don’t eat pork, but everything else.'],
      ['B', 'Gut zu wissen. Dann mache ich ein Gemüsecurry. Bis Samstag!', 'Good to know. Then I’ll make a vegetable curry. See you on Saturday!'],
    ],
  },
  freizeit: {
    title: 'Im Fitnessstudio', setting: 'Someone asks about a membership at a gym.',
    roles: { A: 'Interessent', B: 'Mitarbeiterin' },
    lines: [
      ['A', 'Guten Tag, ich interessiere mich für eine Mitgliedschaft.', 'Hello, I’m interested in a membership.'],
      ['B', 'Sehr schön. Möchten Sie lieber einen Vertrag für ein Jahr oder einen, der monatlich kündbar ist?', 'Great. Would you prefer a one-year contract or one you can cancel monthly?'],
      ['A', 'Was ist denn der Unterschied beim Preis?', 'What’s the difference in price?'],
      ['B', 'Der Jahresvertrag kostet neunundzwanzig Euro im Monat, der flexible neununddreißig.', 'The annual contract costs twenty-nine euros a month, the flexible one thirty-nine.'],
      ['A', 'Hm. Kann ich vorher ein Probetraining machen?', 'Hm. Can I do a trial session first?'],
      ['B', 'Natürlich, das ist kostenlos. Ein Trainer zeigt Ihnen dann alle Geräte.', 'Of course, that’s free. A trainer will show you all the equipment.'],
      ['A', 'Super. Gibt es auch Kurse, zum Beispiel Yoga?', 'Great. Are there classes as well, for example yoga?'],
      ['B', 'Ja, dreimal pro Woche, und die Kurse sind im Preis inbegriffen.', 'Yes, three times a week, and the classes are included in the price.'],
      ['A', 'Das gefällt mir. Hätten Sie morgen Abend einen Termin für das Probetraining?', 'I like that. Would you have a slot tomorrow evening for the trial session?'],
      ['B', 'Ja, um sechs Uhr ist noch etwas frei. Wie ist Ihr Name?', 'Yes, six o’clock is still free. What’s your name?'],
    ],
  },
  ernaehrung: {
    title: 'Was kochen wir heute?', setting: 'Two flatmates decide what to cook with what is left in the fridge.',
    roles: { A: 'Mitbewohner', B: 'Mitbewohnerin' },
    lines: [
      ['A', 'Sag mal, was kochen wir heute Abend? Ich habe riesigen Hunger.', 'Tell me, what are we cooking tonight? I’m really hungry.'],
      ['B', 'Keine Ahnung. Schauen wir mal, was noch im Kühlschrank ist.', 'No idea. Let’s see what’s still in the fridge.'],
      ['A', 'Also, wir haben noch Paprika, ein paar Tomaten, Zwiebeln und Reis.', 'So, we still have peppers, a few tomatoes, onions and rice.'],
      ['B', 'Und hier ist noch eine Packung Feta. Die läuft morgen ab.', 'And here’s a pack of feta. It expires tomorrow.'],
      ['A', 'Perfekt, dann machen wir gefüllte Paprika mit Reis und Feta.', 'Perfect, then let’s make stuffed peppers with rice and feta.'],
      ['B', 'Gute Idee. Kümmerst du dich um den Reis? Dann schneide ich das Gemüse.', 'Good idea. Will you take care of the rice? Then I’ll chop the vegetables.'],
      ['A', 'Klar. Wie lange müssen die Paprika in den Ofen?', 'Sure. How long do the peppers need in the oven?'],
      ['B', 'Ungefähr eine halbe Stunde bei zweihundert Grad.', 'About half an hour at two hundred degrees.'],
      ['A', 'Super. Und morgen gehen wir einkaufen, aber mit Einkaufszettel!', 'Great. And tomorrow we’ll go shopping, but with a shopping list!'],
      ['B', 'Einverstanden. Dann werfen wir auch weniger weg.', 'Agreed. Then we’ll throw less away too.'],
    ],
  },
  technik: {
    title: 'Hilfe für Oma', setting: 'A grandmother asks her grandson for help with her smartphone.',
    roles: { A: 'Oma', B: 'Enkel' },
    lines: [
      ['A', 'Du, kannst du mir mal helfen? Mein Handy macht wieder, was es will.', 'Hey, can you help me? My phone is doing whatever it wants again.'],
      ['B', 'Klar, Oma. Was ist denn das Problem?', 'Sure, Grandma. What’s the problem?'],
      ['A', 'Ich bekomme ständig Nachrichten von einer App, die ich gar nicht kenne.', 'I keep getting messages from an app I don’t even know.'],
      ['B', 'Zeig mal her. Ah, das sind nur Benachrichtigungen. Die kann man ausschalten.', 'Let me see. Ah, those are just notifications. You can turn them off.'],
      ['A', 'Und wie macht man das?', 'And how do you do that?'],
      ['B', 'Du gehst auf Einstellungen, dann auf Mitteilungen, und hier tippst du einfach auf Aus.', 'You go to Settings, then Notifications, and here you just tap Off.'],
      ['A', 'Ach, so einfach ist das? Kannst du mir das aufschreiben?', 'Oh, it’s that easy? Can you write it down for me?'],
      ['B', 'Mache ich. Und beim nächsten Mal machst du es ganz allein, okay?', 'I will. And next time you’ll do it all by yourself, okay?'],
      ['A', 'Ich versuche es. Ohne dich wäre ich wirklich verloren!', 'I’ll try. Without you I’d be really lost!'],
      ['B', 'Ach was, du lernst das schnell. Videoanrufe kannst du ja auch schon.', 'Oh come on, you learn fast. You can already do video calls, after all.'],
    ],
  },
};

for (const [id, d] of Object.entries(DIALOGUES)) d.topic = id;

/** First-letter hint: "Hätten Sie kurz Zeit?" → "H_____ S__ k___ Z___?" (long words stay visible). */
export function hint(sentence) {
  return sentence.split(' ').map(word => {
    const m = word.match(/^([„“"(]*)(.*?)([.,!?;:“”")]*)$/);
    const [, pre, core, post] = m || ['', '', word, ''];
    if (core.length <= 2 || core.length >= 11) return pre + core + post;
    return pre + core[0] + '_'.repeat(core.length - 1) + post;
  }).join(' ');
}

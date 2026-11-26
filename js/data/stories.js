// Comprehensible input: one short story per topic at B1+ level.
// The new words appear in context. In the text, {surface|key} marks a target word.
// stems: normalised prefixes used to spot the word (any form) when you retell the story.

const w = (key, say, en, stems, note = '') => ({ key, say, en, stems, note });

export const STORIES = {
  arbeit: {
    title: 'Neustart mit 34',
    paras: [
      'Lena ist 34 und arbeitet seit acht Jahren in der {Abteilung|abteilung} für Kundenservice einer großen Versicherung. Die Arbeit ist sicher, aber langweilig. Jeden Tag beantwortet sie dieselben Fragen. Ihr {Vorgesetzter|vorgesetzter} ist zwar nett, aber er gibt ihr nie neue Aufgaben.',
      'Eines Abends sieht sie eine {Stellenanzeige|stellenanzeige} im Internet: Ein junges Unternehmen in Leipzig sucht eine Projektleiterin. Die wichtigste {Voraussetzung|voraussetzung}: Man muss {zuverlässig|zuverlaessig} sein und gut mit Menschen sprechen können. „Das bin ich!“, denkt Lena.',
      'Am Wochenende schreibt sie ihre {Bewerbung|bewerbung}. Sie aktualisiert ihren {Lebenslauf|lebenslauf} und erwähnt auch die {Fortbildung|fortbildung} in Projektmanagement, die sie letztes Jahr gemacht hat. Zwei Wochen später bekommt sie eine Einladung zum Vorstellungsgespräch.',
      'Im Gespräch geht es auch um Geld. Das {Gehalt|gehalt} ist etwas niedriger als bei der Versicherung, und der Vertrag ist zunächst {befristet|befristet}, auf zwei Jahre. Die ersten sechs Monate sind {Probezeit|probezeit}. Trotzdem sagt Lena zu, denn sie möchte endlich {selbstständig|selbststaendig} arbeiten und eigene Entscheidungen treffen. Sie {vereinbaren|vereinbaren} einen Starttermin im März.',
      'Der neue Job ist eine echte {Herausforderung|herausforderung}. Im Team muss sie sich manchmal {durchsetzen|durchsetzen}, wenn alle unterschiedliche Ideen haben. Aber nach drei Monaten ist Lena sicher: Der Wechsel war die richtige Entscheidung.',
    ],
    words: [
      w('abteilung', 'die Abteilung', 'department', ['abteilung'], 'Pl. die Abteilungen'),
      w('vorgesetzter', 'der Vorgesetzte', 'boss, line manager', ['vorgesetzt'], 'die Vorgesetzte (f), Pl. die Vorgesetzten'),
      w('stellenanzeige', 'die Stellenanzeige', 'job advertisement', ['stellenanzeige'], 'Pl. die Stellenanzeigen'),
      w('voraussetzung', 'die Voraussetzung', 'requirement', ['voraussetzung'], 'Pl. die Voraussetzungen'),
      w('zuverlaessig', 'zuverlässig', 'reliable', ['zuverlassig']),
      w('bewerbung', 'die Bewerbung', 'application', ['bewerbung'], 'Pl. die Bewerbungen · sich bewerben um/auf'),
      w('lebenslauf', 'der Lebenslauf', 'CV, résumé', ['lebenslauf', 'lebenslauf'], 'Pl. die Lebensläufe'),
      w('fortbildung', 'die Fortbildung', 'training course', ['fortbildung'], 'Pl. die Fortbildungen'),
      w('gehalt', 'das Gehalt', 'salary', ['gehalt'], 'Pl. die Gehälter'),
      w('befristet', 'befristet', 'fixed-term, temporary', ['befristet'], 'opposite: unbefristet'),
      w('probezeit', 'die Probezeit', 'probation period', ['probezeit']),
      w('selbststaendig', 'selbstständig', 'independently; self-employed', ['selbststandig', 'selbstandig']),
      w('vereinbaren', 'vereinbaren', 'to agree on, arrange', ['vereinbar'], 'einen Termin vereinbaren'),
      w('herausforderung', 'die Herausforderung', 'challenge', ['herausforderung'], 'Pl. die Herausforderungen'),
      w('durchsetzen', 'sich durchsetzen', 'to assert oneself', ['durchsetz', 'setzt sich durch', 'setze mich durch', 'durchgesetzt'], 'sie setzt sich durch'),
    ],
    questions: [
      { q: 'Warum ist Lena mit ihrem alten Job unzufrieden?', expect: [['langweilig', 'dieselben', 'immer gleich', 'keine neuen', 'nie neue']], model: 'Weil die Arbeit langweilig ist und ihr Vorgesetzter ihr nie neue Aufgaben gibt.' },
      { q: 'Was ist die wichtigste Voraussetzung für die neue Stelle?', expect: [['zuverlässig'], ['menschen', 'sprechen', 'kommunik']], model: 'Man muss zuverlässig sein und gut mit Menschen sprechen können.' },
      { q: 'Was sind die Nachteile des neuen Jobs?', expect: [['gehalt', 'geld', 'niedriger', 'weniger'], ['befristet', 'zwei jahre', 'probezeit']], model: 'Das Gehalt ist niedriger, und der Vertrag ist befristet.' },
      { q: 'Warum nimmt Lena die Stelle trotzdem?', expect: [['selbstständig', 'selbständig', 'entscheidungen', 'eigene']], model: 'Weil sie selbstständig arbeiten und eigene Entscheidungen treffen möchte.' },
    ],
  },

  wohnen: {
    title: 'Die Wohnungssuche',
    paras: [
      'Tarek und Mia suchen seit drei Monaten eine Wohnung in Köln. Sie wollen zusammenziehen, aber der Wohnungsmarkt ist schwierig. Viele Wohnungen sind schon {vergeben|vergeben}, bevor sie überhaupt anrufen können.',
      'Dann finden sie eine Anzeige: zwei Zimmer in einem {Altbau|altbau}, frisch {renoviert|renoviert}, mit hohen Decken und Holzboden. Die {Kaltmiete|kaltmiete} beträgt 980 Euro, die {Nebenkosten|nebenkosten} liegen bei 220 Euro. Das ist teuer, aber die {Lage|lage} ist perfekt: fünf Minuten zum Rhein, zehn Minuten zur Uni.',
      'Zur {Besichtigung|besichtigung} kommen über dreißig Leute. Der {Makler|makler} zeigt die Wohnung in nur fünfzehn Minuten. Mia findet sie sofort {gemütlich|gemuetlich}. Tarek fragt nach der {Hausordnung|hausordnung}, denn er spielt abends gern Klavier.',
      'Der Makler sagt, alle {Bewerber|bewerber} müssen ihre {Unterlagen|unterlagen} bis Freitag schicken: Gehaltsnachweise, eine Kopie des Ausweises und eine {Schufa-Auskunft|schufa}. Die Schufa-Auskunft zeigt, ob man seine Rechnungen immer bezahlt hat.',
      'Tarek und Mia schicken alles noch am selben Abend. Eine Woche später klingelt das Telefon: Der Vermieter hat ihnen {zugesagt|zusagen}! Klavierspielen ist bis 20 Uhr erlaubt.',
    ],
    words: [
      w('vergeben', 'vergeben', 'taken, already let (to someone else)', ['vergeben'], 'Die Wohnung ist schon vergeben.'),
      w('altbau', 'der Altbau', 'old building (pre-war)', ['altbau'], 'Pl. die Altbauten · opposite: der Neubau'),
      w('renoviert', 'renoviert', 'renovated', ['renovier']),
      w('kaltmiete', 'die Kaltmiete', 'rent without heating and utilities', ['kaltmiete'], 'opposite: die Warmmiete'),
      w('nebenkosten', 'die Nebenkosten', 'utility costs (always plural)', ['nebenkosten']),
      w('lage', 'die Lage', 'location', ['lage'], 'Die Lage ist zentral.'),
      w('besichtigung', 'die Besichtigung', 'viewing', ['besichtig'], 'eine Wohnung besichtigen'),
      w('makler', 'der Makler', 'estate agent', ['makler'], 'die Maklerin (f)'),
      w('gemuetlich', 'gemütlich', 'cosy', ['gemutlich']),
      w('hausordnung', 'die Hausordnung', 'house rules', ['hausordnung']),
      w('bewerber', 'der Bewerber', 'applicant', ['bewerber'], 'die Bewerberin (f), Pl. die Bewerber'),
      w('unterlagen', 'die Unterlagen', 'documents, paperwork (plural)', ['unterlagen']),
      w('schufa', 'die Schufa-Auskunft', 'credit report (Germany)', ['schufa']),
      w('zusagen', 'zusagen', 'to accept, to confirm (yes)', ['zusag', 'zugesagt', 'sagt zu', 'sagen zu', 'sagte zu'], 'opposite: absagen'),
    ],
    questions: [
      { q: 'Warum ist die Wohnungssuche in Köln so schwierig?', expect: [['vergeben', 'viele leute', 'schnell', 'markt', 'schwierig', 'teuer']], model: 'Weil viele Wohnungen schon vergeben sind, bevor man anrufen kann.' },
      { q: 'Was kostet die Wohnung insgesamt?', expect: [['1200', '1.200', 'tausendzweihundert', '980', '220', 'kaltmiete', 'nebenkosten']], model: 'Insgesamt 1200 Euro: 980 Euro Kaltmiete und 220 Euro Nebenkosten.' },
      { q: 'Warum fragt Tarek nach der Hausordnung?', expect: [['klavier']], model: 'Weil er abends gern Klavier spielt.' },
      { q: 'Welche Unterlagen müssen die Bewerber schicken?', expect: [['gehalt', 'ausweis', 'schufa']], model: 'Gehaltsnachweise, eine Kopie des Ausweises und eine Schufa-Auskunft.' },
    ],
  },

  gesundheit: {
    title: 'Zu viel Stress',
    paras: [
      'Jonas ist Lehrer und hat im Moment sehr viel zu tun. Seit Wochen schläft er schlecht und fühlt sich ständig {erschöpft|erschoepft}. Am Montag wird ihm im Unterricht plötzlich schwarz vor Augen: {Schwindel|schwindel}! Er muss sich setzen.',
      'Am nächsten Tag geht er zu seinem {Hausarzt|hausarzt}. Der Arzt fragt genau nach seinen {Beschwerden|beschwerden}: Seit wann? Wie oft? Dann {untersucht|untersuchen} er ihn gründlich und misst den Blutdruck. Der ist viel zu hoch.',
      '„Ich gebe Ihnen eine {Überweisung|ueberweisung} zum Kardiologen“, sagt der Arzt. „Das ist nicht {dringend|dringend}, aber Sie sollten in den nächsten Wochen zu einem {Facharzt|facharzt} gehen.“ Außerdem bekommt Jonas ein {Rezept|rezept} für ein leichtes Medikament. Der Arzt erklärt, dass es manchmal {Nebenwirkungen|nebenwirkung} wie Müdigkeit gibt.',
      'Beim Kardiologen ist die {Diagnose|diagnose} zum Glück klar: Das Herz ist gesund, aber der Stress ist zu groß. Jonas bekommt eine {Krankmeldung|krankmeldung} für eine Woche, damit er sich {erholen|erholen} kann.',
      'Seitdem hat Jonas einiges geändert. Er geht jeden Tag eine halbe Stunde spazieren und liest abends keine E-Mails mehr. „Man muss Krankheiten {vorbeugen|vorbeugen}, bevor sie kommen“, sagt er heute.',
    ],
    words: [
      w('erschoepft', 'erschöpft', 'exhausted', ['erschopf']),
      w('schwindel', 'der Schwindel', 'dizziness', ['schwindel'], 'Mir ist schwindelig.'),
      w('hausarzt', 'der Hausarzt', 'GP, family doctor', ['hausarzt', 'hausarzt'], 'die Hausärztin (f)'),
      w('beschwerden', 'die Beschwerden', 'symptoms, complaints (plural)', ['beschwerde']),
      w('untersuchen', 'untersuchen', 'to examine', ['untersuch']),
      w('ueberweisung', 'die Überweisung', 'referral (also: bank transfer)', ['uberweisung']),
      w('dringend', 'dringend', 'urgent', ['dringend']),
      w('facharzt', 'der Facharzt', 'specialist doctor', ['facharzt'], 'die Fachärztin (f)'),
      w('rezept', 'das Rezept', 'prescription (also: recipe)', ['rezept'], 'Pl. die Rezepte'),
      w('nebenwirkung', 'die Nebenwirkung', 'side effect', ['nebenwirkung'], 'Pl. die Nebenwirkungen'),
      w('diagnose', 'die Diagnose', 'diagnosis', ['diagnose']),
      w('krankmeldung', 'die Krankmeldung', 'sick note', ['krankmeldung']),
      w('erholen', 'sich erholen', 'to recover, to rest', ['erhol']),
      w('vorbeugen', 'vorbeugen', 'to prevent (+ Dativ)', ['vorbeug', 'beugt vor', 'beugen vor']),
    ],
    questions: [
      { q: 'Welche Beschwerden hat Jonas?', expect: [['schläft', 'schlaf', 'müde', 'erschöpft', 'schwindel']], model: 'Er schläft schlecht, ist erschöpft und hat Schwindel.' },
      { q: 'Was stellt der Hausarzt fest?', expect: [['blutdruck'], ['hoch']], model: 'Sein Blutdruck ist viel zu hoch.' },
      { q: 'Was sagt der Kardiologe?', expect: [['herz', 'gesund', 'stress']], model: 'Das Herz ist gesund, aber der Stress ist zu groß.' },
      { q: 'Was hat Jonas danach geändert?', expect: [['spazieren', 'mails', 'abends']], model: 'Er geht jeden Tag spazieren und liest abends keine E-Mails mehr.' },
    ],
  },

  umwelt: {
    title: 'Ein Dorf gegen den Müll',
    paras: [
      'In einem kleinen Dorf in Bayern mit nur 2000 {Einwohnern|einwohner} hatte der {Bürgermeister|buergermeister} vor drei Jahren eine ungewöhnliche Idee: Das Dorf sollte die Hälfte seines {Abfalls|abfall} {vermeiden|vermeiden}.',
      'Am Anfang waren viele Leute {skeptisch|skeptisch}. „Wie soll das funktionieren?“, fragten sie. Doch eine kleine Gruppe startete eine {Initiative|initiative}. Sie eröffnete einen {Unverpackt-Laden|unverpackt}, in dem man Nudeln, Reis und Seife ohne {Verpackung|verpackung} kaufen kann. Man bringt einfach eigene Gläser und Dosen mit.',
      'Außerdem gibt es jetzt jeden Samstag ein Reparatur-Café. Dort helfen Rentner den Jüngeren, alte Geräte zu reparieren und Dinge {wiederzuverwenden|wiederverwenden}, statt sie wegzuwerfen.',
      'Das {Ergebnis|ergebnis} nach drei Jahren: Der Müll ist um 40 Prozent gesunken, und auch der {Verbrauch|verbrauch} von Strom und Wasser ist zurückgegangen. Das Dorf spart Geld und schont {Ressourcen|ressourcen}.',
      'Inzwischen kommen Journalisten aus ganz Deutschland. Der Bürgermeister ist stolz: „Wir haben gezeigt, dass ein {nachhaltiges|nachhaltig} Leben auch auf dem Land möglich ist. Die beste Methode war nicht, die Leute zu zwingen, sondern sie zu {überzeugen|ueberzeugen}.“',
    ],
    words: [
      w('einwohner', 'der Einwohner', 'inhabitant, resident', ['einwohner'], 'Pl. die Einwohner'),
      w('buergermeister', 'der Bürgermeister', 'mayor', ['burgermeister'], 'die Bürgermeisterin (f)'),
      w('abfall', 'der Abfall', 'waste, rubbish', ['abfall', 'abfalle'], 'Pl. die Abfälle'),
      w('vermeiden', 'vermeiden', 'to avoid', ['vermeid', 'vermied']),
      w('skeptisch', 'skeptisch', 'sceptical', ['skeptisch']),
      w('initiative', 'die Initiative', 'initiative, local campaign group', ['initiative']),
      w('unverpackt', 'der Unverpackt-Laden', 'zero-waste shop', ['unverpackt']),
      w('verpackung', 'die Verpackung', 'packaging', ['verpackung']),
      w('wiederverwenden', 'wiederverwenden', 'to reuse', ['wiederverwend', 'wiederzuverwend']),
      w('ergebnis', 'das Ergebnis', 'result', ['ergebnis'], 'Pl. die Ergebnisse'),
      w('verbrauch', 'der Verbrauch', 'consumption', ['verbrauch'], 'verbrauchen = to consume'),
      w('ressourcen', 'die Ressourcen', 'resources', ['ressource']),
      w('nachhaltig', 'nachhaltig', 'sustainable', ['nachhaltig']),
      w('ueberzeugen', 'überzeugen', 'to convince', ['uberzeug']),
    ],
    questions: [
      { q: 'Was war die Idee des Bürgermeisters?', expect: [['hälfte', 'halb', 'weniger'], ['müll', 'abfall']], model: 'Das Dorf sollte die Hälfte seines Abfalls vermeiden.' },
      { q: 'Wie funktioniert der Unverpackt-Laden?', expect: [['gläser', 'dosen', 'eigene', 'ohne verpackung', 'mitbringen']], model: 'Man bringt eigene Gläser und Dosen mit und kauft ohne Verpackung.' },
      { q: 'Was passiert im Reparatur-Café?', expect: [['reparier'], ['rentner', 'geräte', 'alte']], model: 'Rentner helfen, alte Geräte zu reparieren.' },
      { q: 'Was ist das Ergebnis nach drei Jahren?', expect: [['40', 'vierzig', 'prozent', 'weniger', 'gesunken'], ['müll', 'strom', 'wasser', 'geld']], model: 'Der Müll ist um 40 Prozent gesunken, und das Dorf spart Geld.' },
    ],
  },

  medien: {
    title: 'Eine Woche offline',
    paras: [
      'Sophie ist 27 und arbeitet als Grafikdesignerin. Eines Tages merkt sie, dass sie über fünf Stunden pro Tag auf ihren {Bildschirm|bildschirm} schaut, und zwar nur privat. Jede {Benachrichtigung|benachrichtigung} {lenkt sie ab|ablenken}. Sie beschließt ein {Experiment|experiment}: eine Woche ohne Smartphone.',
      'Die ersten zwei Tage sind schwer. Sophie spürt eine seltsame {Unruhe|unruhe}. Immer wieder greift sie in die Tasche, obwohl das Handy zu Hause liegt. Das ist eine alte {Gewohnheit|gewohnheit}. Ihre Freunde beschweren sich, dass sie nicht {erreichbar|erreichbar} ist.',
      'Doch ab dem dritten Tag wird es besser. Sie kann sich bei der Arbeit viel besser {konzentrieren|konzentrieren}, und abends liest sie wieder Bücher. Sie merkt, wie viel {Aufmerksamkeit|aufmerksamkeit} ihr die Apps vorher gestohlen haben. Bei einem Buch entscheidet eben kein {Algorithmus|algorithmus}, was als Nächstes kommt.',
      'Was sie {vermisst|vermissen}? Ehrlich gesagt nur die Karten-App und die Fotos. Auf Instagram zu {verzichten|verzichten}, fällt ihr dagegen überraschend leicht.',
      'Nach der Woche benutzt Sophie ihr Handy wieder, aber {bewusster|bewusst}: Benachrichtigungen sind aus, und nach 21 Uhr bleibt es im Flur. Ihre wichtigste {Erkenntnis|erkenntnis}: „Nicht das Handy ist das Problem, sondern wie ich es benutze.“',
    ],
    words: [
      w('bildschirm', 'der Bildschirm', 'screen', ['bildschirm'], 'Pl. die Bildschirme'),
      w('benachrichtigung', 'die Benachrichtigung', 'notification', ['benachrichtig']),
      w('ablenken', 'ablenken', 'to distract', ['ablenk', 'lenkt ab', 'lenken ab', 'lenkt mich ab', 'lenkt sie ab', 'abgelenkt']),
      w('experiment', 'das Experiment', 'experiment', ['experiment']),
      w('unruhe', 'die Unruhe', 'restlessness', ['unruh'], 'unruhig = restless'),
      w('gewohnheit', 'die Gewohnheit', 'habit', ['gewohnheit'], 'Pl. die Gewohnheiten'),
      w('erreichbar', 'erreichbar', 'reachable, available', ['erreichbar']),
      w('konzentrieren', 'sich konzentrieren', 'to concentrate', ['konzentrier']),
      w('aufmerksamkeit', 'die Aufmerksamkeit', 'attention', ['aufmerksam']),
      w('algorithmus', 'der Algorithmus', 'algorithm', ['algorithm'], 'Pl. die Algorithmen'),
      w('vermissen', 'vermissen', 'to miss (someone/something)', ['vermiss']),
      w('verzichten', 'verzichten auf', 'to do without', ['verzicht']),
      w('bewusst', 'bewusst', 'consciously, mindfully', ['bewusst']),
      w('erkenntnis', 'die Erkenntnis', 'insight, realisation', ['erkenntnis'], 'Pl. die Erkenntnisse'),
    ],
    questions: [
      { q: 'Warum macht Sophie das Experiment?', expect: [['fünf stunden', 'zu viel', 'bildschirm', 'abgelenkt', 'lenkt']], model: 'Weil sie über fünf Stunden pro Tag auf den Bildschirm schaut.' },
      { q: 'Wie fühlt sie sich in den ersten Tagen?', expect: [['unruh', 'schwer', 'nervös']], model: 'Die ersten Tage sind schwer, sie spürt eine Unruhe.' },
      { q: 'Was wird ab dem dritten Tag besser?', expect: [['konzentrier', 'bücher', 'liest', 'lesen']], model: 'Sie kann sich besser konzentrieren und liest wieder Bücher.' },
      { q: 'Wie benutzt sie das Handy nach dem Experiment?', expect: [['bewusst', 'benachrichtigungen', 'flur', '21', 'einundzwanzig']], model: 'Bewusster: ohne Benachrichtigungen und nach 21 Uhr nicht mehr.' },
    ],
  },

  bildung: {
    title: 'Mit 45 an die Hochschule',
    paras: [
      'Andrea hat mit 18 eine Ausbildung als Bürokauffrau gemacht und nie studiert. Mit 45 beschließt sie, das {nachzuholen|nachholen}: Sie möchte einen {Abschluss|abschluss} in Psychologie machen.',
      'Weil sie Vollzeit arbeitet und zwei Kinder hat, entscheidet sie sich für ein {Fernstudium|fernstudium} an einer privaten {Hochschule|hochschule}. Die {Vorlesungen|vorlesung} sieht sie als Videos am Abend oder am Wochenende.',
      'Das erste {Semester|semester} ist hart. Der {Stoff|stoff} ist viel, und nach so vielen Jahren hat Andrea starke {Prüfungsangst|pruefungsangst}. Vor der ersten Klausur schläft sie kaum.',
      'Zum Glück lernt sie online andere {Kommilitonen|kommilitonen} kennen. Sie gründen eine Lerngruppe und treffen sich jeden Sonntag per Video. Gemeinsam bereiten sie sich vor und lesen gegenseitig ihre {Hausarbeiten|hausarbeit}.',
      'Am Ende {besteht|bestehen} Andrea alle Prüfungen, sogar mit guten {Noten|note}. Ihre Kinder sind stolz auf sie. „Ich war nie besonders {ehrgeizig|ehrgeizig}“, sagt sie lachend, „aber ich habe gemerkt: Für ein {Studium|studium} ist man nie zu alt.“',
    ],
    words: [
      w('nachholen', 'nachholen', 'to catch up on, make up for', ['nachhol', 'nachzuhol', 'holt nach', 'nachgeholt']),
      w('abschluss', 'der Abschluss', 'degree, qualification', ['abschluss'], 'Pl. die Abschlüsse'),
      w('fernstudium', 'das Fernstudium', 'distance learning degree', ['fernstudium']),
      w('hochschule', 'die Hochschule', 'university, college', ['hochschule']),
      w('vorlesung', 'die Vorlesung', 'lecture', ['vorlesung'], 'Pl. die Vorlesungen'),
      w('semester', 'das Semester', 'semester, term', ['semester']),
      w('stoff', 'der Stoff', 'material, subject matter (to learn)', ['stoff']),
      w('pruefungsangst', 'die Prüfungsangst', 'exam anxiety', ['prufungsangst']),
      w('kommilitonen', 'der Kommilitone', 'fellow student', ['kommiliton'], 'die Kommilitonin (f), Pl. die Kommilitonen'),
      w('hausarbeit', 'die Hausarbeit', 'term paper, essay', ['hausarbeit']),
      w('bestehen', 'bestehen', 'to pass (an exam)', ['besteh', 'bestand'], 'Perfekt: hat bestanden'),
      w('note', 'die Note', 'grade, mark', ['note'], 'Pl. die Noten'),
      w('ehrgeizig', 'ehrgeizig', 'ambitious', ['ehrgeiz']),
      w('studium', 'das Studium', 'university studies', ['studium']),
    ],
    questions: [
      { q: 'Was möchte Andrea mit 45 machen?', expect: [['studier', 'abschluss', 'psychologie', 'studium']], model: 'Sie möchte einen Abschluss in Psychologie machen.' },
      { q: 'Warum macht sie ein Fernstudium?', expect: [['arbeitet', 'vollzeit', 'kinder', 'zeit']], model: 'Weil sie Vollzeit arbeitet und zwei Kinder hat.' },
      { q: 'Was ist im ersten Semester schwierig?', expect: [['stoff', 'viel', 'prüfungsangst', 'angst', 'schläft']], model: 'Der Stoff ist viel, und sie hat Prüfungsangst.' },
      { q: 'Was hilft ihr?', expect: [['lerngruppe', 'kommiliton', 'gruppe', 'zusammen', 'gemeinsam']], model: 'Eine Lerngruppe mit anderen Kommilitonen hilft ihr.' },
    ],
  },

  reisen: {
    title: 'Eine Reise mit Hindernissen',
    paras: [
      'Marco will von München nach Hamburg fahren, um seine Schwester zu besuchen. Er hat eine günstige {Verbindung|verbindung} gebucht: sechs Stunden, nur ein {Umstieg|umstieg} in Frankfurt.',
      'Schon in München fährt der Zug zwanzig Minuten {verspätet|verspaetet} ab. Kurz vor Frankfurt kommt eine {Durchsage|durchsage}: „Wegen einer Störung auf der {Strecke|strecke} können wir nicht weiterfahren.“ Die Fahrgäste müssen in einen Bus umsteigen. Das nennt man {Ersatzverkehr|ersatzverkehr}.',
      'In Frankfurt rennt Marco zum {Bahnsteig|bahnsteig}, aber er {erreicht|erreichen} seinen Anschlusszug nicht mehr. Der nächste Zug nach Hamburg {fällt aus|ausfallen}. Auf der Anzeigetafel steht: „Abfahrt heute von {Gleis|gleis} 9.“',
      'Ein freundlicher {Schaffner|schaffner} erklärt ihm, dass er mit jedem anderen Zug fahren darf. Außerdem bekommt er eine {Entschädigung|entschaedigung}, weil er mehr als eine Stunde zu spät ankommt: 25 Prozent des Ticketpreises.',
      'Marco bleibt {gelassen|gelassen}. Er trinkt einen Kaffee, ruft seine Schwester an und nimmt {spontan|spontan} einen Zug über Köln. Statt um 16 Uhr kommt er um 21 Uhr in Hamburg an: müde, aber mit einer guten Geschichte.',
    ],
    words: [
      w('verbindung', 'die Verbindung', 'connection (train/bus route)', ['verbindung']),
      w('umstieg', 'der Umstieg', 'change (of trains)', ['umstieg', 'umsteig', 'umgestiegen'], 'umsteigen = to change'),
      w('verspaetet', 'verspätet', 'delayed, late', ['verspatet', 'verspatung']),
      w('durchsage', 'die Durchsage', 'announcement', ['durchsage']),
      w('strecke', 'die Strecke', 'route, line, stretch', ['strecke']),
      w('ersatzverkehr', 'der Ersatzverkehr', 'replacement bus service', ['ersatzverkehr', 'ersatzbus']),
      w('bahnsteig', 'der Bahnsteig', 'platform', ['bahnsteig']),
      w('erreichen', 'erreichen', 'to reach, to catch (a train)', ['erreich']),
      w('ausfallen', 'ausfallen', 'to be cancelled', ['ausfall', 'fallt aus', 'fiel aus', 'ausgefallen']),
      w('gleis', 'das Gleis', 'track (number at the station)', ['gleis']),
      w('schaffner', 'der Schaffner', 'train conductor', ['schaffner'], 'die Schaffnerin (f)'),
      w('entschaedigung', 'die Entschädigung', 'compensation', ['entschadig']),
      w('gelassen', 'gelassen', 'calm, relaxed', ['gelassen']),
      w('spontan', 'spontan', 'spontaneously', ['spontan']),
    ],
    questions: [
      { q: 'Wohin fährt Marco und warum?', expect: [['hamburg'], ['schwester']], model: 'Er fährt nach Hamburg, um seine Schwester zu besuchen.' },
      { q: 'Was passiert kurz vor Frankfurt?', expect: [['störung', 'bus', 'ersatzverkehr', 'nicht weiter']], model: 'Wegen einer Störung können sie nicht weiterfahren und müssen in einen Bus umsteigen.' },
      { q: 'Was bekommt Marco wegen der Verspätung?', expect: [['entschädigung', 'geld', '25', 'fünfundzwanzig', 'prozent']], model: 'Er bekommt eine Entschädigung von 25 Prozent des Ticketpreises.' },
      { q: 'Wie reagiert Marco?', expect: [['gelassen', 'ruhig', 'kaffee', 'ruft']], model: 'Er bleibt gelassen, trinkt einen Kaffee und nimmt einen anderen Zug.' },
    ],
  },

  konsum: {
    title: 'Eine teure Lektion',
    paras: [
      'Kevin ist 23 und hat gerade seinen ersten Job. Im Internet sieht er {Werbung|werbung} für einen riesigen Fernseher: „Nur heute 30 Prozent {Rabatt|rabatt}! Bequeme {Ratenzahlung|ratenzahlung}: nur 49 Euro im Monat!“ Das klingt sehr {verführerisch|verfuehrerisch}.',
      'Kevin denkt nicht lange nach. Für ihn ist das ein echtes {Schnäppchen|schnaeppchen}. Er klickt auf „Kaufen“ und unterschreibt online den Vertrag. Das Kleingedruckte liest er nicht.',
      'Erst später merkt er, dass er 24 Monate lang zahlen muss und dass hohe {Zinsen|zinsen} dazukommen. Am Ende kostet der Fernseher fast 300 Euro mehr. Gleichzeitig kauft er neue Kleidung und ein Handy. Schnell {überschreitet|ueberschreiten} er sein {Budget|budget}.',
      'Nach drei Monaten ist sein {Konto|konto} im Minus. Er nutzt den {Dispo|dispo}, und die Bank verlangt dafür noch mehr Zinsen. Kevin hat zum ersten Mal {Schulden|schulden} und schläft schlecht.',
      'Seine Mutter hilft ihm, einen Plan zu machen. Seitdem lebt Kevin {sparsamer|sparsam}. Vor jeder größeren {Anschaffung|anschaffung} wartet er eine Woche und {vergleicht|vergleichen} die Preise. „Das war eine teure Lektion“, sagt er.',
    ],
    words: [
      w('werbung', 'die Werbung', 'advertising', ['werbung']),
      w('rabatt', 'der Rabatt', 'discount', ['rabatt']),
      w('ratenzahlung', 'die Ratenzahlung', 'payment in instalments', ['ratenzahlung', 'raten']),
      w('verfuehrerisch', 'verführerisch', 'tempting', ['verfuhrerisch', 'verfuhr']),
      w('schnaeppchen', 'das Schnäppchen', 'bargain', ['schnappchen']),
      w('zinsen', 'die Zinsen', 'interest (on money, plural)', ['zins']),
      w('ueberschreiten', 'überschreiten', 'to exceed', ['uberschreit', 'uberschritt']),
      w('budget', 'das Budget', 'budget', ['budget']),
      w('konto', 'das Konto', 'bank account', ['konto'], 'Pl. die Konten'),
      w('dispo', 'der Dispo', 'overdraft', ['dispo']),
      w('schulden', 'die Schulden', 'debts (plural)', ['schulden']),
      w('sparsam', 'sparsam', 'thrifty, careful with money', ['sparsam']),
      w('anschaffung', 'die Anschaffung', 'purchase (of something bigger)', ['anschaffung']),
      w('vergleichen', 'vergleichen', 'to compare', ['vergleich', 'verglich']),
    ],
    questions: [
      { q: 'Warum kauft Kevin den Fernseher?', expect: [['rabatt', 'billig', 'schnäppchen', 'werbung', 'prozent', 'raten']], model: 'Weil es Rabatt gab und er dachte, es sei ein Schnäppchen.' },
      { q: 'Warum ist der Fernseher am Ende teurer?', expect: [['zins']], model: 'Wegen der hohen Zinsen bei der Ratenzahlung.' },
      { q: 'Was passiert nach drei Monaten?', expect: [['minus', 'dispo', 'schulden', 'konto']], model: 'Sein Konto ist im Minus, und er hat Schulden.' },
      { q: 'Was macht Kevin heute anders?', expect: [['woche', 'wartet', 'vergleich', 'sparsam']], model: 'Er wartet vor größeren Käufen eine Woche und vergleicht die Preise.' },
    ],
  },

  gesellschaft: {
    title: 'Mittwochs bei Frau Becker',
    paras: [
      'Frau Becker ist 78 Jahre alt und lebt allein in einer Wohnung in Dortmund. Seit ihr Mann gestorben ist, fühlt sie sich oft {einsam|einsam}. Ihre Kinder wohnen weit weg.',
      'Im selben Haus wohnt Amir, 24, der vor zwei Jahren aus Syrien nach Dortmund {zugezogen|zugezogen} ist. Er studiert Informatik und arbeitet im {Ehrenamt|ehrenamt}: In einem {Verein|verein} hilft er älteren Menschen bei Problemen mit Handy und Computer.',
      'Eines Tages klingelt er bei Frau Becker, weil der Verein Hilfe in der {Nachbarschaft|nachbarschaft} anbietet. Am Anfang ist sie vorsichtig, denn sie hat wenig {Vertrauen|vertrauen} zu Fremden. Aber Amir hat viel {Geduld|geduld} und erklärt ihr Schritt für Schritt, wie Videoanrufe funktionieren.',
      'Aus dieser {Begegnung|begegnung} wird eine Freundschaft. Jeden Mittwoch {kümmert|kuemmern} sich Amir um ihre technischen Fragen, und Frau Becker korrigiert dafür seine Deutsch-Hausaufgaben. Es ist ein echter {Austausch|austausch} zwischen zwei {Generationen|generation}.',
      'Inzwischen trifft sich eine ganze Gruppe im Gemeinschaftsraum des Hauses. Menschen unterschiedlicher {Herkunft|herkunft} kochen zusammen und {unterstützen|unterstuetzen} sich gegenseitig. Frau Becker sagt: „Ich hätte nie gedacht, dass ich mit 78 noch Teil einer neuen {Gemeinschaft|gemeinschaft} werde.“',
    ],
    words: [
      w('einsam', 'einsam', 'lonely', ['einsam']),
      w('zugezogen', 'zuziehen', 'to move to (a place), settle there', ['zugezogen', 'zuzieh', 'zieht zu'], 'Sie ist vor zwei Jahren zugezogen.'),
      w('ehrenamt', 'das Ehrenamt', 'volunteer work', ['ehrenamt'], 'ehrenamtlich = as a volunteer'),
      w('verein', 'der Verein', 'club, association', ['verein'], 'Pl. die Vereine'),
      w('nachbarschaft', 'die Nachbarschaft', 'neighbourhood', ['nachbarschaft']),
      w('vertrauen', 'das Vertrauen', 'trust', ['vertrau'], 'vertrauen + Dativ = to trust'),
      w('geduld', 'die Geduld', 'patience', ['geduld'], 'geduldig = patient'),
      w('begegnung', 'die Begegnung', 'encounter, meeting', ['begegn']),
      w('kuemmern', 'sich kümmern um', 'to take care of, look after', ['kummer', 'kummert', 'gekummert']),
      w('austausch', 'der Austausch', 'exchange', ['austausch']),
      w('generation', 'die Generation', 'generation', ['generation']),
      w('herkunft', 'die Herkunft', 'origin, background', ['herkunft']),
      w('unterstuetzen', 'unterstützen', 'to support', ['unterstutz']),
      w('gemeinschaft', 'die Gemeinschaft', 'community', ['gemeinschaft']),
    ],
    questions: [
      { q: 'Warum fühlt sich Frau Becker einsam?', expect: [['mann', 'gestorben', 'allein', 'kinder', 'weit']], model: 'Weil ihr Mann gestorben ist und ihre Kinder weit weg wohnen.' },
      { q: 'Was macht Amir im Verein?', expect: [['hilft', 'älter', 'handy', 'computer']], model: 'Er hilft älteren Menschen bei Problemen mit Handy und Computer.' },
      { q: 'Was macht Frau Becker für Amir?', expect: [['korrigiert', 'hausaufgaben', 'deutsch']], model: 'Sie korrigiert seine Deutsch-Hausaufgaben.' },
      { q: 'Was passiert inzwischen im Gemeinschaftsraum?', expect: [['kochen', 'gruppe', 'treffen', 'zusammen']], model: 'Eine Gruppe trifft sich dort und kocht zusammen.' },
    ],
  },

  freizeit: {
    title: 'Drei Meter Mut',
    paras: [
      'Nina sitzt den ganzen Tag im Büro. Sie braucht dringend einen {Ausgleich|ausgleich} zur Arbeit. Als eine Kollegin von ihrer neuen {Leidenschaft|leidenschaft} erzählt, dem Bouldern, also Klettern ohne Seil, will Nina es auch {ausprobieren|ausprobieren}.',
      'Am Samstag gehen die beiden in eine {Kletterhalle|kletterhalle}. Für {Anfänger|anfaenger} gibt es einen kostenlosen Einführungskurs. Die {Ausrüstung|ausruestung}, also spezielle Schuhe, kann man für fünf Euro leihen.',
      'Die erste Wand ist nur drei Meter hoch, aber Nina hat Angst. Sie muss sich {überwinden|ueberwinden}, nach oben zu klettern. Als sie es schafft, ist sie total {begeistert|begeistert}. Am nächsten Tag hat sie allerdings starken {Muskelkater|muskelkater} in den Armen.',
      'Trotzdem will sie {durchhalten|durchhalten}. Sie kauft eine {Mitgliedschaft|mitgliedschaft} für ein Jahr und geht zweimal pro Woche klettern. Nach der Arbeit findet sie das sehr {entspannend|entspannend}, weil sie dabei an nichts anderes denken kann.',
      'Inzwischen hat Nina viele neue Leute kennengelernt. Nächsten Monat gibt es sogar einen kleinen {Wettkampf|wettkampf} in der Halle. Nina will die {Gelegenheit|gelegenheit} nutzen und mitmachen: nicht um zu gewinnen, sondern aus Spaß.',
    ],
    words: [
      w('ausgleich', 'der Ausgleich', 'balance, something to offset (work)', ['ausgleich']),
      w('leidenschaft', 'die Leidenschaft', 'passion', ['leidenschaft']),
      w('ausprobieren', 'ausprobieren', 'to try out', ['ausprobier', 'probiert aus', 'probiere aus']),
      w('kletterhalle', 'die Kletterhalle', 'climbing gym', ['kletterhalle']),
      w('anfaenger', 'der Anfänger', 'beginner', ['anfanger'], 'die Anfängerin (f)'),
      w('ausruestung', 'die Ausrüstung', 'equipment, gear', ['ausrustung']),
      w('ueberwinden', 'sich überwinden', 'to force oneself, overcome fear', ['uberwind', 'uberwunden']),
      w('begeistert', 'begeistert', 'thrilled, enthusiastic', ['begeistert']),
      w('muskelkater', 'der Muskelkater', 'sore muscles', ['muskelkater']),
      w('durchhalten', 'durchhalten', 'to keep going, persevere', ['durchhalt', 'halt durch', 'durchgehalten']),
      w('mitgliedschaft', 'die Mitgliedschaft', 'membership', ['mitgliedschaft']),
      w('entspannend', 'entspannend', 'relaxing', ['entspann']),
      w('wettkampf', 'der Wettkampf', 'competition', ['wettkampf']),
      w('gelegenheit', 'die Gelegenheit', 'opportunity', ['gelegenheit']),
    ],
    questions: [
      { q: 'Warum sucht Nina ein Hobby?', expect: [['büro', 'sitzt', 'ausgleich', 'arbeit']], model: 'Weil sie den ganzen Tag im Büro sitzt und einen Ausgleich braucht.' },
      { q: 'Was ist Bouldern?', expect: [['kletter'], ['seil']], model: 'Bouldern ist Klettern ohne Seil.' },
      { q: 'Wie fühlt sie sich nach dem ersten Mal?', expect: [['begeistert', 'muskelkater', 'stolz', 'glücklich']], model: 'Sie ist begeistert, hat aber am nächsten Tag Muskelkater.' },
      { q: 'Warum will sie beim Wettkampf mitmachen?', expect: [['spaß', 'nicht gewinnen', 'gelegenheit']], model: 'Aus Spaß, nicht um zu gewinnen.' },
    ],
  },

  ernaehrung: {
    title: 'Weniger wegwerfen',
    paras: [
      'Familie Yilmaz hat ein Problem: Jede Woche müssen sie viel Essen {wegwerfen|wegwerfen}. Mal ist das Brot {schimmelig|schimmelig}, mal ist der Joghurt {abgelaufen|abgelaufen}, mal {verderben|verderben} Tomaten im Kühlschrank. Das kostet Geld und ist schlecht für die Umwelt.',
      'Die Tochter Elif macht in der Schule ein Projekt über {Lebensmittelverschwendung|verschwendung}. Sie erklärt ihren Eltern: Das {Mindesthaltbarkeitsdatum|mhd} bedeutet nicht, dass ein Produkt danach schlecht ist. Viele Lebensmittel sind länger {haltbar|haltbar}. Man sollte lieber daran {riechen|riechen} und probieren.',
      'Die Familie ändert ihre Gewohnheiten. Vor dem Einkaufen prüfen sie den {Vorrat|vorrat} und schreiben einen {Einkaufszettel|einkaufszettel}. So kaufen sie nur, was sie wirklich brauchen.',
      'Aus {Resten|reste} kocht der Vater am Sonntag eine Suppe oder einen Auflauf. Brot, das sie nicht schaffen, wird {eingefroren|einfrieren}. Und wenn eine {Zutat|zutat} fehlt, improvisieren sie einfach.',
      'Was sie wirklich nicht essen können, geben sie über eine {Foodsharing|foodsharing}-App an Nachbarn weiter. Nach zwei Monaten werfen sie fast nichts mehr weg und sparen etwa 50 Euro im Monat.',
    ],
    words: [
      w('wegwerfen', 'wegwerfen', 'to throw away', ['wegwerf', 'weggeworfen', 'wirft weg', 'werfen weg']),
      w('schimmelig', 'schimmelig', 'mouldy', ['schimmel']),
      w('abgelaufen', 'abgelaufen', 'expired, past its date', ['abgelaufen']),
      w('verderben', 'verderben', 'to go off, spoil', ['verderb', 'verdorben', 'verdirbt']),
      w('verschwendung', 'die Lebensmittelverschwendung', 'food waste', ['verschwend', 'lebensmittelverschwend']),
      w('mhd', 'das Mindesthaltbarkeitsdatum', 'best-before date', ['mindesthaltbarkeit', 'mhd']),
      w('haltbar', 'haltbar', 'keeps (for a long time), durable', ['haltbar']),
      w('riechen', 'riechen', 'to smell', ['riech', 'gerochen']),
      w('vorrat', 'der Vorrat', 'supplies, stock', ['vorrat', 'vorrate'], 'Pl. die Vorräte'),
      w('einkaufszettel', 'der Einkaufszettel', 'shopping list', ['einkaufszettel']),
      w('reste', 'die Reste', 'leftovers', ['reste', 'resten']),
      w('einfrieren', 'einfrieren', 'to freeze', ['einfrier', 'eingefroren', 'friert ein', 'frieren ein']),
      w('zutat', 'die Zutat', 'ingredient', ['zutat'], 'Pl. die Zutaten'),
      w('foodsharing', 'das Foodsharing', 'food sharing (giving away surplus food)', ['foodsharing']),
    ],
    questions: [
      { q: 'Welches Problem hat die Familie?', expect: [['wegwerf', 'werfen', 'weg', 'essen']], model: 'Sie müssen jede Woche viel Essen wegwerfen.' },
      { q: 'Was erklärt Elif über das Mindesthaltbarkeitsdatum?', expect: [['nicht schlecht', 'länger', 'haltbar', 'riechen', 'probieren']], model: 'Dass Lebensmittel danach oft noch gut sind und man daran riechen sollte.' },
      { q: 'Was macht die Familie vor dem Einkaufen?', expect: [['vorrat', 'einkaufszettel', 'zettel', 'liste', 'prüfen']], model: 'Sie prüfen den Vorrat und schreiben einen Einkaufszettel.' },
      { q: 'Was ist das Ergebnis nach zwei Monaten?', expect: [['fast nichts', '50', 'fünfzig', 'sparen']], model: 'Sie werfen fast nichts mehr weg und sparen 50 Euro im Monat.' },
    ],
  },

  technik: {
    title: 'Die KI im Büro',
    paras: [
      'In der Marketingagentur von Herrn Wolf gibt es seit Januar eine neue {Software|software} mit {künstlicher Intelligenz|ki}. Sie kann Texte schreiben, Bilder erstellen und viele langweilige {Aufgaben|aufgabe} {automatisieren|automatisieren}.',
      'Nicht alle Mitarbeiter sind glücklich darüber. Die Grafikerin Paula hat die {Befürchtung|befuerchtung}, dass die KI sie bald {ersetzen|ersetzen} wird. Andere machen sich Sorgen um den {Datenschutz|datenschutz}: Welche Kundendaten gibt man dem Programm?',
      'Herr Wolf organisiert deshalb eine {Schulung|schulung}. Alle lernen, wie man das Programm richtig benutzt und dass man jedes Ergebnis {überprüfen|ueberpruefen} muss, weil die KI auch Fehler macht. Vertrauliche Daten dürfen nicht eingegeben werden.',
      'Nach einigen Monaten zeigt sich: Die {Effizienz|effizienz} ist gestiegen. Routinearbeiten gehen viel schneller. Aber die KI hat keine echte {Kreativität|kreativitaet}. Die besten Ideen kommen immer noch von Menschen wie Paula.',
      'Paula hat sich {angepasst|anpassen}: Sie nutzt die KI für erste Entwürfe und konzentriert sich selbst auf das Konzept. „Diese {Entwicklung|entwicklung} kann man nicht stoppen“, sagt sie. „Wichtig ist, neue {Fähigkeiten|faehigkeit} zu lernen.“',
    ],
    words: [
      w('software', 'die Software', 'software', ['software']),
      w('ki', 'die künstliche Intelligenz', 'artificial intelligence (KI)', ['kunstliche', 'kunstlicher', 'ki']),
      w('aufgabe', 'die Aufgabe', 'task', ['aufgabe'], 'Pl. die Aufgaben'),
      w('automatisieren', 'automatisieren', 'to automate', ['automatis']),
      w('befuerchtung', 'die Befürchtung', 'fear, worry', ['befurcht'], 'befürchten = to fear'),
      w('ersetzen', 'ersetzen', 'to replace', ['ersetz']),
      w('datenschutz', 'der Datenschutz', 'data protection, privacy', ['datenschutz']),
      w('schulung', 'die Schulung', 'training session', ['schulung']),
      w('ueberpruefen', 'überprüfen', 'to check, verify', ['uberpruf']),
      w('effizienz', 'die Effizienz', 'efficiency', ['effizien']),
      w('kreativitaet', 'die Kreativität', 'creativity', ['kreativ']),
      w('anpassen', 'sich anpassen', 'to adapt', ['anpass', 'angepasst', 'passt sich an']),
      w('entwicklung', 'die Entwicklung', 'development', ['entwicklung']),
      w('faehigkeit', 'die Fähigkeit', 'skill, ability', ['fahigkeit'], 'Pl. die Fähigkeiten'),
    ],
    questions: [
      { q: 'Was kann die neue Software?', expect: [['texte', 'bilder', 'aufgaben', 'automatis']], model: 'Sie kann Texte schreiben, Bilder erstellen und Aufgaben automatisieren.' },
      { q: 'Welche Sorgen haben die Mitarbeiter?', expect: [['ersetz', 'job', 'arbeit verlieren', 'datenschutz', 'daten']], model: 'Sie haben Angst, ersetzt zu werden, und Sorgen um den Datenschutz.' },
      { q: 'Was lernen sie in der Schulung?', expect: [['überprüf', 'prüf', 'fehler', 'richtig', 'daten']], model: 'Dass man jedes Ergebnis überprüfen muss, weil die KI Fehler macht.' },
      { q: 'Wie nutzt Paula die KI heute?', expect: [['entwürf', 'entwurf', 'konzept']], model: 'Sie nutzt die KI für erste Entwürfe und konzentriert sich auf das Konzept.' },
    ],
  },
};

// Stable review ids: v-arbeit-bewerbung
for (const [tid, s] of Object.entries(STORIES)) {
  s.topic = tid;
  for (const word of s.words) word.id = `v-${tid}-${word.key}`;
}

/** Split a paragraph into plain text and target-word tokens. */
export function parsePara(text) {
  const out = [];
  const re = /\{([^|}]+)\|([^}]+)\}/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[1], key: m[2] });
    last = re.lastIndex;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

/** Plain text (no markup), for text-to-speech. */
export const plain = text => text.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');

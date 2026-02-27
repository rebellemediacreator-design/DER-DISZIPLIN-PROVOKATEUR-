/* app.js — DER DISZIPLIN-PROVOKATEUR™
   52 einzigartige Wochen (DE), Reviews in Woche 13/26/39 (KPI/Elimination/Mut-Score),
   Woche 52 Ritual. Offline-first (LocalStorage), Export/Import.
*/

(() => {
  "use strict";

  // ========= CONFIG =========
  const STORAGE_KEY = "rebelle_disziplin_provokateur_v2";
  const MAX_WEEKS = 52;
  const REVIEW_WEEKS = new Set([13, 26, 39]);
  const RITUAL_WEEK = 52;

  const PHASES = [
    { name: "Foundation", from: 1, to: 13, blurb: "Fokus & Disziplin. Du baust Fundament statt Stimmung." },
    { name: "Expansion", from: 14, to: 26, blurb: "Output & Sichtbarkeit. Du lieferst – ohne dich zu verstecken." },
    { name: "Confrontation", from: 27, to: 39, blurb: "Reibung & Risiko. Du wählst Wachstum statt Komfort." },
    { name: "Refinement", from: 40, to: 52, blurb: "Reduktion & Klarheit. Du schärfst – und lässt los." }
  ];

  // ========= DATA: 52 UNIQUE WEEKS =========
  // Jede Woche: Ziel, Aufgabe, Zeitrahmen, Reflexionsfrage, Messpunkt
  const WEEKS = [
    { week: 1,  phase: "Foundation", title: "Null Ausreden", goal: "Startpunkt setzen, der nicht verhandelbar ist.", task: "Formuliere dein Kernprojekt in 1 Satz. Definiere 1 messbare Ausgabe für diese Woche. Lege beides sichtbar ab (Notiz/Doc).", time: "45 Minuten", reflection: "Welche Ausrede ist deine Lieblingsmaske?", metric: "Projekt-Satz + 1 messbare Ausgabe schriftlich vorhanden." },
    { week: 2,  phase: "Foundation", title: "Fokus-Zone", goal: "Arbeitsraum im Kopf schaffen.", task: "Plane 3 feste Output-Slots (je 60 Minuten) für diese Woche und blocke sie im Kalender. Kein Verschieben.", time: "15 Minuten + 3×60 Minuten", reflection: "Was wird plötzlich wichtig, sobald du fokussiert arbeitest?", metric: "3 Kalender-Blocks gesetzt + 3 Sessions durchgeführt (Start/Ende notiert)." },
    { week: 3,  phase: "Foundation", title: "Output vor Ästhetik", goal: "Liefern, bevor du polierst.", task: "Erstelle eine Rohfassung (Entwurf/Serie/Skizze) und exportiere sie als Datei/Link. Keine Optimierung, nur Abschluss.", time: "90 Minuten", reflection: "Wo verwechselst du Perfektion mit Kontrolle?", metric: "1 Export/Link existiert (Datum dokumentiert)." },
    { week: 4,  phase: "Foundation", title: "Standard statt Stimmung", goal: "Routine als Schutzschild definieren.", task: "Schreibe 5 Arbeitsregeln (z.B. Handy erst nach Output). Hänge sie sichtbar hin oder setze sie als Hintergrund.", time: "25 Minuten", reflection: "Welche Grenze macht dich sofort produktiver?", metric: "5 Regeln dokumentiert + sichtbar platziert." },
    { week: 5,  phase: "Foundation", title: "Der 10%-Move", goal: "Großes in machbar verwandeln.", task: "Teile dein Kernprojekt in 10 Teile. Erledige exakt Teil 1 vollständig – ohne auf Teil 2 zu schielen.", time: "2 Stunden", reflection: "Welche Größe benutzt du als Ausrede, nicht zu beginnen?", metric: "1/10 abgeschlossen + abgehakt." },
    { week: 6,  phase: "Foundation", title: "Archiv statt Chaos", goal: "Material kontrollieren, nicht ertrinken.", task: "Ordne 60 Minuten: benennen, sortieren, löschen. Danach: eine klare Ordnerstruktur (3 Ebenen max.) schriftlich festhalten.", time: "60–75 Minuten", reflection: "Welche Unordnung schützt dich vor Entscheidungen?", metric: "Mind. 30 Dateien bereinigt + Struktur schriftlich fixiert." },
    { week: 7,  phase: "Foundation", title: "Die eine Serie", goal: "Deine Linie sichtbar machen.", task: "Baue eine 9-teilige Mini-Serie (9 Bilder/Slides/Ideen) zu einem Thema. Reihenfolge bewusst setzen.", time: "90 Minuten", reflection: "Was ist dein Stil, wenn du nicht erklärst?", metric: "9er-Serie gespeichert (Export/Link/Board)." },
    { week: 8,  phase: "Foundation", title: "Kill the Noise", goal: "Ablenkung kappen, Output freilegen.", task: "Streiche eine Ablenkung für 7 Tage (App/News/Serien). Ersetze sie durch 20 Minuten Produktion täglich.", time: "7 Tage", reflection: "Wovor flüchtest du, wenn’s still wird?", metric: "7×20 Min. Produktion dokumentiert + Ablenkung nachweislich reduziert." },
    { week: 9,  phase: "Foundation", title: "Angebot in einem Satz", goal: "Wert statt „Ich mach alles“.", task: "Schreibe 1 Satz-Angebot: Für wen + Ergebnis + Format. Danach 3 Features und 1 Outcome-Beweis, den du liefern kannst.", time: "40 Minuten", reflection: "Wo machst du dich kleiner, um niemanden zu triggern?", metric: "1 Angebotssatz + 3 Features + 1 Beweis-Ansatz dokumentiert." },
    { week:10,  phase: "Foundation", title: "Schneller fertig", goal: "Durchlaufzeit senken.", task: "Timer 2×45 Minuten: Erstelle in dieser Zeit ein fertiges Mini-Ergebnis (PDF, Set, Post-Serie, Template). Exportieren.", time: "2×45 Minuten", reflection: "Was würdest du schaffen, wenn du keine Zeit zum Zweifeln hast?", metric: "1 fertiges Ergebnis exportiert + Zeiten notiert." },
    { week:11,  phase: "Foundation", title: "Qualitätskriterium", goal: "Objektiv definieren, was gut ist.", task: "Definiere 3 messbare Qualitätskriterien (z.B. Lesbarkeit/Komposition/CTA). Prüfe 3 Arbeiten dagegen und notiere 1 konkreten Fix pro Arbeit.", time: "60 Minuten", reflection: "Welche Kriterien sind Ego – nicht Qualität?", metric: "3 Kriterien + 3 Prüfnotizen + 3 Fixes dokumentiert." },
    { week:12,  phase: "Foundation", title: "Der erste Abschluss", goal: "Ein Zyklus wird real durch Abschluss.", task: "Beende 1 Sache komplett: finalisieren, exportieren, sauber ablegen, veröffentlichungsbereit machen (Titel/Dateiname/Ort).", time: "2 Stunden", reflection: "Was lässt du halbfertig, um dich nicht zu zeigen?", metric: "1 Abschluss-Item final + sauber abgelegt." },

    // 13 REVIEW
    { week:13,  phase: "Foundation", title: "QUARTALS-REVIEW I", goal: "Bilanz ziehen. Nicht fühlen. Messen.", task: "Fülle den Review: KPI-Check, Eliminationsliste, Mut-Score. Triff danach 1 harte Entscheidung: Was wird im nächsten Quartal gestrichen?", time: "45–60 Minuten", reflection: "Was war Output – und was war Beschäftigungstherapie?", metric: "Review gespeichert + 1 Streich-Entscheidung schriftlich." },

    { week:14,  phase: "Expansion", title: "Veröffentliche trotz Scham", goal: "Sichtbarkeit ohne Perfektion.", task: "Veröffentliche 2 Arbeiten, die du sonst zurückhalten würdest. Max. 30 Minuten Politur pro Arbeit.", time: "7 Tage", reflection: "Wovor schützt dich dein Perfektionismus wirklich?", metric: "2 Veröffentlichungen live (Links dokumentiert)." },
    { week:15,  phase: "Expansion", title: "Hook-Disziplin", goal: "Aufmerksamkeit beherrschen, statt hoffen.", task: "Schreibe 25 Hooks. Wähle die besten 5. Veröffentliche mindestens 2 damit (Post/Pin/Mail).", time: "60–90 Minuten", reflection: "Wo bist du zu nett statt klar?", metric: "25 Hooks gespeichert + 2 Veröffentlichungen." },
    { week:16,  phase: "Expansion", title: "Offer-Page in einem Screen", goal: "Verkaufen ohne Theater.", task: "Erstelle eine 1-Screen Offer-Page: Problem, Lösung, Proof, Preis/CTA. Screenshot/Link reicht.", time: "90 Minuten", reflection: "Welches Detail nutzt du, um dich zu verstecken?", metric: "1 Offer-Page existiert (Link/Screenshot)." },
    { week:17,  phase: "Expansion", title: "3 Kontakte, 1 Satz", goal: "Kooperation aktivieren.", task: "Schreibe 3 Personen/Brands an: 1 Satz Wert + 1 konkreter Vorschlag + 1 Call-to-Action.", time: "45 Minuten", reflection: "Welche Angst steckt in deiner Zurückhaltung?", metric: "3 Nachrichten gesendet (Nachweis/Copy gespeichert)." },
    { week:18,  phase: "Expansion", title: "Serie statt Einzelstück", goal: "Regelmäßigkeit erzeugt Autorität.", task: "Baue eine 6-teilige Serie (6 Slides/6 Fotos/6 Ideen). Veröffentliche Teil 1–3 in dieser Woche.", time: "2–4 Stunden", reflection: "Warum fühlt sich Konsistenz für dich wie Gefängnis an?", metric: "6-teilige Serie erstellt + 3 Teile veröffentlicht." },
    { week:19,  phase: "Expansion", title: "Proof statt Behauptung", goal: "Beweise sammeln, die verkaufen.", task: "Sammle 12 Proofs (Screens, Zahlen, Feedback, Vorher/Nachher). Baue ein 1-Seiten Proof-Dokument.", time: "90 Minuten", reflection: "Welche Beweise über dich ignorierst du aus Gewohnheit?", metric: "12 Proofs + 1 Proof-Doc gespeichert." },
    { week:20,  phase: "Expansion", title: "Preis-Statement", goal: "Wert kommunizieren ohne Rechtfertigung.", task: "Schreibe 5 Preis-Sätze (kurz, hart, klar). Wähle 1 und setze ihn in Shoptext/Angebot/DM ein.", time: "40 Minuten", reflection: "Wo entschuldigst du dich für Qualität?", metric: "5 Preis-Sätze + 1 Integration umgesetzt." },
    { week:21,  phase: "Expansion", title: "Der Prozess, der dich rettet", goal: "Wiederholbarkeit bauen.", task: "Erstelle eine 10-Schritte-Checkliste für deinen Output-Prozess. Nutze sie einmal komplett.", time: "60–90 Minuten", reflection: "Was wäre leicht, wenn du es standardisierst?", metric: "Checkliste + 1 Nutzung dokumentiert." },
    { week:22,  phase: "Expansion", title: "Deadline + Konsequenz", goal: "Einsatz erhöhen.", task: "Setze ein Release-Datum und eine echte Konsequenz (öffentlich/finanziell/Commitment mit Person).", time: "20 Minuten", reflection: "Was passiert, wenn du dich selbst ernst nimmst?", metric: "Deadline + Konsequenz schriftlich fixiert." },
    { week:23,  phase: "Expansion", title: "48h Release", goal: "Schnell liefern, statt „perfekt“.", task: "Erstelle in 48 Stunden ein Mini-Asset (Template, Preset, PDF, Pack). Veröffentliche oder stelle es bereit.", time: "48 Stunden", reflection: "Was würdest du bauen, wenn niemand urteilt?", metric: "1 Release live/ready + Link/Datei." },
    { week:24,  phase: "Expansion", title: "Sichtbarkeits-Stack", goal: "Mehr Reichweite pro Arbeit.", task: "Nimm 1 Kernpiece und baue 5 Derivate (Pin, Caption, Mail, Teaser, Quote). Plane Veröffentlichung für 7 Tage.", time: "2–3 Stunden", reflection: "Wo verlierst du Reichweite, weil du jedes Mal neu anfängst?", metric: "1 Kernpiece + 5 Derivate + 7-Tage-Plan." },
    { week:25,  phase: "Expansion", title: "Conversion-Check", goal: "Strategie statt Posting.", task: "Prüfe deinen Weg: Erste Impression → CTA → Kauf. Optimiere 3 Stellen (Bio/Link/Shoptext/Pin-Desc).", time: "60 Minuten", reflection: "Warum machst du es Menschen schwer, dir zu folgen?", metric: "3 Optimierungen umgesetzt." },

    // 26 REVIEW
    { week:26,  phase: "Expansion", title: "QUARTALS-REVIEW II", goal: "Halbzeit: Zahlen. Entscheidungen. Standards.", task: "Fülle Review: KPI, Eliminationsliste, Mut-Score. Lege 1 KPI fest, die in Q3 gewinnt (z.B. Veröffentlichungen/Woche).", time: "45–60 Minuten", reflection: "Was war echter Output – was war Flucht?", metric: "Review gespeichert + 1 KPI-Commitment schriftlich." },

    { week:27,  phase: "Confrontation", title: "Das harte Ding zuerst", goal: "Widerstand brechen.", task: "5 Tage: Starte mit der Aufgabe, die du am meisten verschiebst. 20 Minuten reichen – aber täglich.", time: "5×20 Minuten", reflection: "Was vermeidest du, weil es dich besser machen würde?", metric: "5 Häkchen + 1 Satz Ergebnis pro Tag." },
    { week:28,  phase: "Confrontation", title: "Komfort streichen", goal: "Dopamin-Reset, Fokus zurück.", task: "7 Tage: Kein Scrollen ohne Zweck. Ersetze durch 30 Minuten Produktion täglich.", time: "7 Tage", reflection: "Was macht dein Kopf, wenn er nicht fliehen darf?", metric: "7×30 Minuten Produktion dokumentiert." },
    { week:29,  phase: "Confrontation", title: "Kritik-Training", goal: "Feedback halten, ohne zu kippen.", task: "Hol dir Feedback von 3 Personen zu 1 Arbeit: ‚Was wirkt? Was verwirrt? Was fehlt?‘", time: "60 Minuten", reflection: "Welche Kritik triggert dich – und warum?", metric: "3 Feedbacks + 3 Learnings notiert." },
    { week:30,  phase: "Confrontation", title: "Public WIP", goal: "Mut durch Sichtbarkeit.", task: "Teile Work-in-Progress öffentlich (Post/Story/Newsletter). Kein Ergebnis, nur Prozess + nächster Schritt.", time: "45 Minuten", reflection: "Welche Version von dir versteckst du?", metric: "1 WIP veröffentlicht + 1 nächster Schritt benannt." },
    { week:31,  phase: "Confrontation", title: "Preis ohne Entschuldigung", goal: "Wert setzen, ohne zu bitten.", task: "Veröffentliche ein Angebot mit Preis + Nutzenformel + CTA. Keine Rabatte. Kein Erklär-Overkill.", time: "45 Minuten", reflection: "Wo glaubst du, du müsstest erst ‚genug sein‘, bevor du verlangen darfst?", metric: "1 Angebot veröffentlicht/aktiviert." },
    { week:32,  phase: "Confrontation", title: "Dead Projects", goal: "Ballast töten.", task: "Liste 12 offene Loops. Schließe oder streiche mindestens 6 diese Woche.", time: "90 Minuten", reflection: "Welche Baustelle hält dich klein?", metric: "6 Loops geschlossen (erledigt oder endgültig gestrichen)." },
    { week:33,  phase: "Confrontation", title: "Risiko-Experiment", goal: "Wachstum provozieren.", task: "Mach 1 Experiment, das dich nervös macht: neues Format, neue Plattform, neuer Pitch. Danach 3 Learnings.", time: "2 Stunden", reflection: "Was wäre peinlich – aber effektiv?", metric: "1 Experiment durchgeführt + 3 Learnings dokumentiert." },
    { week:34,  phase: "Confrontation", title: "Grenzen setzen", goal: "Energie zurückholen.", task: "Setze 1 klare Grenze (Kunde/Privat/Social). Formuliere sie schriftlich und kommuniziere sie.", time: "30–45 Minuten", reflection: "Wo bist du verfügbar, obwohl es dich kostet?", metric: "1 Grenze kommuniziert + Screenshot/Text gespeichert." },
    { week:35,  phase: "Confrontation", title: "Der unbequeme Schnitt", goal: "Qualität durch Reduktion.", task: "Überarbeite 1 Arbeit radikal: streiche 30% Elemente/Text. Mach sie schärfer und schneller verständlich.", time: "90 Minuten", reflection: "Woran hängst du aus Eitelkeit?", metric: "Vorher/Nachher gespeichert." },
    { week:36,  phase: "Confrontation", title: "Veröffentlichungs-Quote", goal: "Disziplin sichtbar machen.", task: "Setze eine Quote: 3 Veröffentlichungen in 7 Tagen. Plane Montag. Poste. Punkt.", time: "7 Tage", reflection: "Welche Angst taucht jedes Mal vor dem Posten auf?", metric: "3 Veröffentlichungen live." },
    { week:37,  phase: "Confrontation", title: "Umsatz-Mechanik", goal: "Kreativität als System, nicht Zufall.", task: "Definiere 1 Umsatzpfad: Produkt → Traffic → CTA → Kauf. Optimiere 2 Stellen (Text/Preis/Proof/CTA).", time: "60 Minuten", reflection: "Wo hoffst du, statt zu steuern?", metric: "Umsatzpfad notiert + 2 Optimierungen umgesetzt." },
    { week:38,  phase: "Confrontation", title: "3-Tage Fokus-Sprint", goal: "Selbstführung unter Druck.", task: "3 Tage: 90 Minuten Deep Work täglich + 10 Minuten Review direkt danach (1 Satz: Ergebnis / 1 Satz: Nächster Schritt).", time: "3×90 Minuten", reflection: "Was hat dich fast gekillt – und was hat dich getragen?", metric: "3 Sessions + 3 Mini-Reviews dokumentiert." },

    // 39 REVIEW
    { week:39,  phase: "Confrontation", title: "QUARTALS-REVIEW III", goal: "Reibung messen. Wahrheit ziehen.", task: "Fülle Review: KPI, Eliminationsliste, Mut-Score. Entscheide 1 Sache, die du ab jetzt konsequent NICHT mehr machst.", time: "45–60 Minuten", reflection: "Was war Mut – und was war nur Lärm?", metric: "Review gespeichert + 1 Nicht-mehr-Regel notiert." },

    { week:40,  phase: "Refinement", title: "1 Kernprojekt", goal: "Fokus final verdichten.", task: "Wähle 1 Kernprojekt für die letzten 13 Wochen. Streiche 2 Nebenprojekte (wirklich, nicht ‚pausieren‘).", time: "45 Minuten", reflection: "Was hältst du am Leben, obwohl es tot ist?", metric: "1 Kernprojekt + 2 Streichungen dokumentiert." },
    { week:41,  phase: "Refinement", title: "Signature-Grid", goal: "Stil sichtbar machen.", task: "Kuratiere 12 Arbeiten in einem Grid (Portfolio/IG/Pinterest). Ordne sie so, dass sie deine Aussage erzählen.", time: "90 Minuten", reflection: "Welche Arbeiten sind ‚du‘ – welche sind Anpassung?", metric: "12er-Grid erstellt + gespeichert." },
    { week:42,  phase: "Refinement", title: "Loop statt Stress", goal: "Wiederholung bauen, die dich frei macht.", task: "Definiere deinen Wochen-Loop: Produktion → Veröffentlichung → Angebot → Review. Plane die nächste Woche exakt so.", time: "60 Minuten", reflection: "Wo tust du so, als wäre Chaos kreativ?", metric: "Loop dokumentiert + nächste Woche geplant." },
    { week:43,  phase: "Refinement", title: "Reibung entfernen", goal: "Friction runter, Output rauf.", task: "Finde 3 Reibungspunkte (Tools/Ordner/Workflow). Löse 1 davon vollständig (nicht halb).", time: "90 Minuten", reflection: "Welche Kleinigkeit kostet dich täglich Energie?", metric: "1 Reibungspunkt gelöst + Nachweis (vorher/nachher)." },
    { week:44,  phase: "Refinement", title: "Angebot schärfen", goal: "Ein Angebot, das sitzt.", task: "Kürze deinen Angebotstext um 30%. Mache CTA klarer. Füge 1 Proof hinzu. Entferne 1 Feature, das verwässert.", time: "60 Minuten", reflection: "Wo verwässerst du dich, um niemanden zu verlieren?", metric: "Neue Version gespeichert + live/ready." },
    { week:45,  phase: "Refinement", title: "Wiederverwertungs-Stack", goal: "Mehr Reichweite pro Arbeit.", task: "Nimm 1 Kernpiece und erstelle 7 Derivate (Pin, Reel-Skript, Caption, Newsletter, Carousel, Quote, Teaser).", time: "2–3 Stunden", reflection: "Warum produzierst du neu statt smart?", metric: "1 Kernpiece + 7 Derivate existieren." },
    { week:46,  phase: "Refinement", title: "Archiv der besten 5", goal: "Qualität priorisieren.", task: "Wähle deine Top 5 Arbeiten. Schreibe je 1 Satz: warum sie wirkt + was sie beweist. Dann 1 Satz: was du daraus wiederholst.", time: "60 Minuten", reflection: "Was ist dein wiederkehrendes Muster, wenn du ehrlich bist?", metric: "5 Arbeiten + 10 Sätze dokumentiert." },
    { week:47,  phase: "Refinement", title: "Clean Close", goal: "Schuld aus offenen Loops nehmen.", task: "Schließe 3 offene Aufgaben, die du seit Monaten mitziehst: fertigstellen oder endgültig streichen.", time: "90 Minuten", reflection: "Welche Unfertigkeit hält dich in innerer Zahlung?", metric: "3 Loops geschlossen." },
    { week:48,  phase: "Refinement", title: "Der finale Release", goal: "Ein Abschluss, der sichtbar ist.", task: "Setze ein Release in 7 Tagen: Datum, Checkliste, Veröffentlichung. Kein Verschieben. Kein Diskutieren.", time: "7 Tage", reflection: "Was passiert, wenn du wirklich abschließt?", metric: "Release live + Link/Beweis." },
    { week:49,  phase: "Refinement", title: "Eliminationsliste 2.0", goal: "Radikale Reduktion.", task: "Reduziere 10% digitalen Ballast: Apps, Accounts, Newsletter, Dateien. Dokumentiere, was weg ist.", time: "60–90 Minuten", reflection: "Was besitzt dich, statt dass du es besitzt?", metric: "10% entfernt + Liste gespeichert." },
    { week:50,  phase: "Refinement", title: "Portfolio-Statement", goal: "Deine Arbeit spricht ohne Erklärung.", task: "Schreibe 1 Portfolio-Statement (max. 120 Wörter). Keine Vita. Nur Haltung, Fokus, Ergebnis.", time: "45 Minuten", reflection: "Welche Wahrheit über dich traust du dich zu sagen?", metric: "Statement gespeichert + platziert (Website/Doc)." },
    { week:51,  phase: "Refinement", title: "Ritual vorbereiten", goal: "Woche 52 wird kein Zufall.", task: "Sammle Zahlen: Output, Veröffentlichungen, Umsatz, Kooperationen. Wähle 5 Arbeiten, die du im Ritual ehrst.", time: "60 Minuten", reflection: "Welche Zahl überrascht dich – und warum?", metric: "Zahlenliste + Top 5 festgelegt." },
    { week:52,  phase: "Refinement", title: "RITUAL & ABSCHLUSS", goal: "Objektiv beenden. Identität verankern.", task: "Fülle Ritual: objektive Veränderung (Zahlen), Ritual-Plan, Abschluss-Statement. Optional: drucke Top 5 oder kuratiere ein finales Portfolio-Grid.", time: "60–90 Minuten", reflection: "Was hat sich objektiv verändert – nicht gefühlt?", metric: "Ritual gespeichert + 1 sichtbarer Abschluss (Print/Portfolio/Manifest)." }
  ];

  // ========= DOM HELPERS =========
  const $ = (id) => document.getElementById(id);

  // REQUIRED IDs (match your existing HTML)
  const els = {
    btnGoJournal: $("btnGoJournal"),
    btnGoHow: $("btnGoHow"),

    startDate: $("startDate"),
    btnStartToday: $("btnStartToday"),

    pillWeek: $("pillWeek"),
    pillPhase: $("pillPhase"),

    progressFill: $("progressFill"),
    progressText: $("progressText"),
    daysText: $("daysText"),

    btnPrev: $("btnPrev"),
    btnNext: $("btnNext"),
    weekJump: $("weekJump"),
    btnJump: $("btnJump"),

    weekKicker: $("weekKicker"),
    weekTitle: $("weekTitle"),
    weekPhaseLine: $("weekPhaseLine"),
    weekDone: $("weekDone"),

    weekGoal: $("weekGoal"),
    weekTask: $("weekTask"),
    weekTime: $("weekTime"),
    weekReflection: $("weekReflection"),
    weekMetric: $("weekMetric"),

    notes: $("notes"),
    saveState: $("saveState"),
    btnClearNotes: $("btnClearNotes"),

    reviewCard: $("reviewCard"),
    reviewKicker: $("reviewKicker"),
    reviewTitle: $("reviewTitle"),
    reviewLead: $("reviewLead"),
    reviewBadge: $("reviewBadge"),

    kpiOutput: $("kpiOutput"),
    kpiPublishes: $("kpiPublishes"),
    kpiRevenue: $("kpiRevenue"),
    kpiDoneProjects: $("kpiDoneProjects"),
    kpiContacts: $("kpiContacts"),
    elimList: $("elimList"),
    mutScore: $("mutScore"),
    mutScoreVal: $("mutScoreVal"),
    reviewNotes: $("reviewNotes"),
    btnSaveReview: $("btnSaveReview"),
    reviewSaveState: $("reviewSaveState"),

    ritualCard: $("ritualCard"),
    objChange: $("objChange"),
    ritualPlan: $("ritualPlan"),
    finalStatement: $("finalStatement"),
    btnSaveRitual: $("btnSaveRitual"),
    ritualSaveState: $("ritualSaveState"),

    btnExport: $("btnExport"),
    importFile: $("importFile"),
    btnReset: $("btnReset")
  };

  // Hard fail if critical elements are missing (prevents silent broken product)
  const must = [
    "btnGoJournal","btnGoHow","startDate","btnStartToday","pillWeek","pillPhase",
    "progressFill","progressText","daysText","btnPrev","btnNext","weekJump","btnJump",
    "weekKicker","weekTitle","weekPhaseLine","weekDone","weekGoal","weekTask","weekTime",
    "weekReflection","weekMetric","notes","saveState","btnClearNotes","reviewCard","ritualCard",
    "btnExport","importFile","btnReset"
  ];
  for (const k of must) {
    if (!els[k]) throw new Error(`app.js: Missing required element #${k}`);
  }

  // ========= STATE =========
  const state = loadState();
  let activeWeek = clampInt(state.ui.activeWeek || 1, 1, MAX_WEEKS);

  // ========= INIT =========
  init();
  renderAll();

  function init() {
    els.btnGoJournal.addEventListener("click", () => {
      document.getElementById("journal")?.scrollIntoView({ behavior: "smooth" });
      if (!state.startDate) {
        state.startDate = toISODate(new Date());
        els.startDate.value = state.startDate;
        save("Startdatum gesetzt.");
      }
      recalcActiveWeekFromStart(true);
      renderAll();
    });

    els.btnGoHow.addEventListener("click", () => {
      document.getElementById("how")?.scrollIntoView({ behavior: "smooth" });
    });

    hydrateStartDate();
    recalcActiveWeekFromStart(false);

    els.btnStartToday.addEventListener("click", () => {
      state.startDate = toISODate(new Date());
      els.startDate.value = state.startDate;
      save("Startdatum gespeichert.");
      recalcActiveWeekFromStart(true);
      renderAll();
    });

    els.startDate.addEventListener("change", () => {
      const val = els.startDate.value;
      if (!isValidISODate(val)) return;
      state.startDate = val;
      save("Startdatum gespeichert.");
      recalcActiveWeekFromStart(true);
      renderAll();
    });

    els.btnPrev.addEventListener("click", () => navTo(activeWeek - 1));
    els.btnNext.addEventListener("click", () => navTo(activeWeek + 1));

    els.btnJump.addEventListener("click", () => {
      const target = clampInt(parseInt(els.weekJump.value, 10) || 1, 1, MAX_WEEKS);
      navTo(target);
    });

    els.weekDone.addEventListener("change", () => {
      const wKey = String(activeWeek);
      state.weeks[wKey] = state.weeks[wKey] || {};
      state.weeks[wKey].done = !!els.weekDone.checked;
      save("Woche gespeichert.");
      renderProgress();
    });

    const debouncedNotesSave = debounce(() => {
      const wKey = String(activeWeek);
      state.weeks[wKey] = state.weeks[wKey] || {};
      state.weeks[wKey].notes = els.notes.value || "";
      save("Notizen gespeichert.");
    }, 250);

    els.notes.addEventListener("input", () => {
      els.saveState.textContent = "Speichere…";
      debouncedNotesSave();
    });

    els.btnClearNotes.addEventListener("click", () => {
      const wKey = String(activeWeek);
      state.weeks[wKey] = state.weeks[wKey] || {};
      state.weeks[wKey].notes = "";
      els.notes.value = "";
      save("Notizen gelöscht.");
    });

    // Review interactions
    if (els.mutScore && els.mutScoreVal) {
      els.mutScore.addEventListener("input", () => {
        els.mutScoreVal.textContent = String(els.mutScore.value);
      });
    }

    if (els.btnSaveReview) {
      els.btnSaveReview.addEventListener("click", () => {
        const wk = String(activeWeek);
        state.reviews[wk] = {
          kpi: {
            output: numOr0(els.kpiOutput?.value),
            publishes: numOr0(els.kpiPublishes?.value),
            revenue: numOr0(els.kpiRevenue?.value),
            doneProjects: numOr0(els.kpiDoneProjects?.value),
            contacts: numOr0(els.kpiContacts?.value)
          },
          elimList: els.elimList?.value || "",
          mutScore: clampInt(parseInt(els.mutScore?.value, 10) || 0, 0, 10),
          notes: els.reviewNotes?.value || "",
          savedAt: new Date().toISOString()
        };
        save("Review gespeichert.");
        if (els.reviewSaveState) els.reviewSaveState.textContent = "Review gespeichert.";
      });
    }

    // Ritual interactions
    if (els.btnSaveRitual) {
      els.btnSaveRitual.addEventListener("click", () => {
        state.ritual = {
          objChange: els.objChange?.value || "",
          ritualPlan: els.ritualPlan?.value || "",
          finalStatement: els.finalStatement?.value || "",
          savedAt: new Date().toISOString()
        };
        save("Ritual gespeichert.");
        if (els.ritualSaveState) els.ritualSaveState.textContent = "Ritual gespeichert.";
      });
    }

    // Export
    els.btnExport.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `disziplin-provokateur-backup-${toISODate(new Date())}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    // Import
    els.importFile.addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const merged = normalizeState(data);
        Object.assign(state, merged);
        activeWeek = clampInt(state.ui.activeWeek || 1, 1, MAX_WEEKS);
        hydrateStartDate();
        recalcActiveWeekFromStart(true);
        save("Import erfolgreich.");
        renderAll();
        els.importFile.value = "";
      } catch {
        alert("Import fehlgeschlagen. Bitte eine gültige JSON-Exportdatei auswählen.");
        els.importFile.value = "";
      }
    });

    // Reset
    els.btnReset.addEventListener("click", () => {
      const ok = confirm("Wirklich alles löschen? (Startdatum, Notizen, Fortschritt, Reviews, Ritual)");
      if (!ok) return;
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });
  }

  // ========= RENDER =========
  function renderAll() {
    renderHeader();
    renderWeek();
    renderReviewOrRitual();
    renderProgress();
  }

  function renderHeader() {
    const phase = getPhase(activeWeek);
    els.pillWeek.textContent = String(activeWeek);
    els.pillPhase.textContent = phase.name;

    const start = state.startDate ? parseISODate(state.startDate) : null;
    if (start) {
      const today = startOfDay(new Date());
      const days = Math.max(0, Math.floor((today - start) / 86400000));
      els.daysText.textContent = `Start: ${state.startDate} · Tag ${days + 1}`;
    } else {
      els.daysText.textContent = "Startdatum: —";
    }
  }

  function renderWeek() {
    const w = WEEKS[activeWeek - 1];
    const phase = getPhase(activeWeek);

    els.weekKicker.textContent = `Woche ${w.week}`;
    els.weekTitle.textContent = w.title;
    els.weekPhaseLine.textContent = `${phase.name} · ${phase.blurb}`;

    els.weekGoal.textContent = w.goal;
    els.weekTask.textContent = w.task;
    els.weekTime.textContent = w.time;
    els.weekReflection.textContent = w.reflection;
    els.weekMetric.textContent = w.metric;

    const saved = state.weeks[String(activeWeek)] || {};
    els.weekDone.checked = !!saved.done;
    els.notes.value = saved.notes || "";
    els.saveState.textContent = "Offline gespeichert.";
  }

  function renderReviewOrRitual() {
    const isReview = REVIEW_WEEKS.has(activeWeek);
    const isRitual = activeWeek === RITUAL_WEEK;

    els.reviewCard.classList.toggle("hidden", !isReview);
    els.ritualCard.classList.toggle("hidden", !isRitual);

    if (isReview) {
      if (els.reviewKicker) els.reviewKicker.textContent = "Review";
      if (els.reviewTitle) els.reviewTitle.textContent = `Quartals-Review · Woche ${activeWeek}`;
      if (els.reviewBadge) els.reviewBadge.textContent = `W${activeWeek}`;
      if (els.reviewLead) els.reviewLead.textContent = "KPI. Eliminierung. Mut. Dann weiter.";

      const data = state.reviews[String(activeWeek)] || null;

      if (els.kpiOutput) els.kpiOutput.value = data?.kpi?.output ?? "";
      if (els.kpiPublishes) els.kpiPublishes.value = data?.kpi?.publishes ?? "";
      if (els.kpiRevenue) els.kpiRevenue.value = data?.kpi?.revenue ?? "";
      if (els.kpiDoneProjects) els.kpiDoneProjects.value = data?.kpi?.doneProjects ?? "";
      if (els.kpiContacts) els.kpiContacts.value = data?.kpi?.contacts ?? "";

      if (els.elimList) els.elimList.value = data?.elimList ?? "";
      if (els.mutScore) els.mutScore.value = String(data?.mutScore ?? 0);
      if (els.mutScoreVal) els.mutScoreVal.textContent = String(els.mutScore?.value ?? "0");
      if (els.reviewNotes) els.reviewNotes.value = data?.notes ?? "";

      if (els.reviewSaveState) {
        els.reviewSaveState.textContent = data?.savedAt
          ? `Zuletzt gespeichert: ${formatTS(data.savedAt)}`
          : "Noch nicht gespeichert.";
      }
    }

    if (isRitual) {
      const data = state.ritual || null;
      if (els.objChange) els.objChange.value = data?.objChange ?? "";
      if (els.ritualPlan) els.ritualPlan.value = data?.ritualPlan ?? "";
      if (els.finalStatement) els.finalStatement.value = data?.finalStatement ?? "";
      if (els.ritualSaveState) {
        els.ritualSaveState.textContent = data?.savedAt
          ? `Zuletzt gespeichert: ${formatTS(data.savedAt)}`
          : "Noch nicht gespeichert.";
      }
    }
  }

  function renderProgress() {
    const doneCount = Object.values(state.weeks).filter((w) => w && w.done).length;
    const pct = Math.round((doneCount / MAX_WEEKS) * 100);
    els.progressText.textContent = `${pct}% abgeschlossen · ${doneCount}/${MAX_WEEKS} Wochen`;
    els.progressFill.style.width = `${pct}%`;

    const bar = document.querySelector(".progress__bar");
    if (bar) bar.setAttribute("aria-valuenow", String(doneCount));
  }

  // ========= NAV / DATE LOGIC =========
  function navTo(target) {
    activeWeek = clampInt(target, 1, MAX_WEEKS);
    state.ui.activeWeek = activeWeek;
    save("Navigation gespeichert.");
    renderAll();
  }

  function hydrateStartDate() {
    if (state.startDate && isValidISODate(state.startDate)) els.startDate.value = state.startDate;
  }

  function recalcActiveWeekFromStart(force) {
    if (!state.startDate) {
      if (!force) {
        state.startDate = toISODate(new Date());
        hydrateStartDate();
        save("Startdatum gesetzt.");
      } else {
        return;
      }
    }

    const start = parseISODate(state.startDate);
    if (!start) return;

    const today = startOfDay(new Date());
    const deltaDays = Math.floor((today - start) / 86400000);
    const week = clampInt(Math.floor(deltaDays / 7) + 1, 1, MAX_WEEKS);

    if (!state.ui.activeWeek || force) {
      activeWeek = week;
      state.ui.activeWeek = activeWeek;
      save("Aktuelle Woche aktualisiert.");
    }
  }

  function getPhase(week) {
    for (const p of PHASES) {
      if (week >= p.from && week <= p.to) return p;
    }
    return PHASES[0];
  }

  // ========= STORAGE =========
  function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return normalizeState({});
    try {
      return normalizeState(JSON.parse(raw));
    } catch {
      return normalizeState({});
    }
  }

  function normalizeState(input) {
    const base = {
      version: 2,
      startDate: "",
      weeks: {},     // { "1": {done:boolean, notes:string}, ... }
      reviews: {},   // { "13": {...}, "26": {...}, "39": {...} }
      ritual: null,  // { objChange, ritualPlan, finalStatement, savedAt }
      ui: { activeWeek: 1 },
      savedAt: ""
    };

    const out = { ...base };

    if (input && typeof input === "object") {
      out.startDate = isValidISODate(input.startDate) ? input.startDate : "";
      out.weeks = (input.weeks && typeof input.weeks === "object") ? input.weeks : {};
      out.reviews = (input.reviews && typeof input.reviews === "object") ? input.reviews : {};
      out.ritual = (input.ritual && typeof input.ritual === "object") ? input.ritual : null;
      out.ui = (input.ui && typeof input.ui === "object") ? { ...base.ui, ...input.ui } : { ...base.ui };
      out.savedAt = typeof input.savedAt === "string" ? input.savedAt : "";
    }

    return out;
  }

  function save(message) {
    state.savedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (els.saveState) els.saveState.textContent = message || "Offline gespeichert.";
  }

  // ========= UTILS =========
  function toISODate(d) {
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
  }

  function parseISODate(str) {
    if (!isValidISODate(str)) return null;
    const [y, m, d] = str.split("-").map((n) => parseInt(n, 10));
    const dt = new Date(y, m - 1, d);
    return isNaN(dt.getTime()) ? null : startOfDay(dt);
  }

  function isValidISODate(str) {
    return typeof str === "string" && /^\d{4}-\d{2}-\d{2}$/.test(str);
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function clampInt(n, min, max) {
    const x = Number.isFinite(n) ? n : min;
    return Math.max(min, Math.min(max, Math.trunc(x)));
  }

  function numOr0(val) {
    const n = parseFloat(String(val ?? "").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }

  function debounce(fn, delay) {
    let t = null;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  }

  function formatTS(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${dd}.${mm}.${yy} ${hh}:${mi}`;
  }
})();
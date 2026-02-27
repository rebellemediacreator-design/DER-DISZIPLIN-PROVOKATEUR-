(() => {
  "use strict";

  const STORAGE_KEY = "rebelle_52weeks_v2";
  const MAX_WEEKS = 52;

  const PHASES = [
    { name: "Foundation", range: [1, 13], blurb: "Fokus & Disziplin. Du baust ein tragfähiges Fundament." },
    { name: "Expansion", range: [14, 26], blurb: "Output & Sichtbarkeit. Du lieferst – ohne dich zu verstecken." },
    { name: "Confrontation", range: [27, 39], blurb: "Risiko & Reibung. Du wählst Wachstum statt Komfort." },
    { name: "Refinement", range: [40, 52], blurb: "Reduktion & Klarheit. Du streichst, was nicht trägt." }
  ];

  const REVIEW_WEEKS = new Set([13, 26, 39]);
  const RITUAL_WEEK = 52;

  // Minimal, aber messbar. Du kannst die Texte jederzeit inhaltlich austauschen
  // (Produkt-Update), ohne die Logik anzufassen.
  const WEEKS = Array.from({ length: MAX_WEEKS }, (_, i) => {
    const w = i + 1;
    const phase = getPhase(w).name;

    // Default-Set: neutral, klar, nicht weich.
    // Wenn du willst, baue ich dir danach 52 ultra-individuelle Weeks im RE:BELLE-Ton.
    const presets = {
      Foundation: [
        { title: "Start Without Permission", goal: "Momentum statt Warten.", task: "Lege ein Projekt fest (1 Satz). Definiere eine einzige messbare Ausgabe.", time: "45 Minuten", reflection: "Wo wartest du auf Erlaubnis?", metric: "1 Projekt-Satz + 1 messbare Ausgabe dokumentiert." },
        { title: "One Hour Monastery", goal: "Fokus kultivieren.", task: "Arbeite 60 Minuten ohne Handy/Multitasking. Nur eine Sache.", time: "60 Minuten", reflection: "Welche Ablenkung schreit am lautesten?", metric: "1 Fokus-Session abgeschlossen (Start/Ende notiert)." },
        { title: "Kill the Draft", goal: "Fertig statt perfekt.", task: "Beende etwas Kleines und exportiere es (PDF/JPG/Link).", time: "90 Minuten", reflection: "Was hält dich in der Zwischenwelt?", metric: "1 Export/Link existiert." },
        { title: "Routine With Teeth", goal: "Ritual statt Romantik.", task: "Definiere 3 fixe Slots (z.B. Mo/Mi/Fr) für kreativen Output.", time: "30 Minuten", reflection: "Welche Ausrede nutzt du am häufigsten?", metric: "3 Slots im Kalender/Notion eingetragen." }
      ],
      Expansion: [
        { title: "Publish Anyway", goal: "Sichtbarkeit ohne Perfektion.", task: "Veröffentliche 2 Arbeiten. Max. 30 Minuten Feinschliff pro Arbeit.", time: "7 Tage", reflection: "Was vermeidest du aus Angst vor Urteil?", metric: "2 Veröffentlichungen (Link dokumentiert)." },
        { title: "Make It Sell", goal: "Kreativität als Wert.", task: "Formuliere 1 Angebot: Problem → Lösung → Preis → CTA.", time: "60 Minuten", reflection: "Wo sabotierst du deinen Wert?", metric: "1 Angebotstext fertig." },
        { title: "Ask for the Yes", goal: "Kooperation aktivieren.", task: "Schreibe 3 Kontakte/Brands an (klar, kurz, konkret).", time: "45 Minuten", reflection: "Wovor schützt dich dein Schweigen?", metric: "3 gesendete Nachrichten." },
        { title: "Ship a System", goal: "Wiederholbarkeit bauen.", task: "Erstelle 1 wiederholbaren Workflow (Checkliste) für deinen Output.", time: "60 Minuten", reflection: "Was wäre leichter, wenn es Standard wäre?", metric: "1 Checkliste vorhanden." }
      ],
      Confrontation: [
        { title: "Do the Hard Thing", goal: "Reibung wählen.", task: "Mach die Aufgabe, die du am liebsten verschiebst. Erst 20 Minuten.", time: "20 Minuten", reflection: "Was würdest du tun, wenn niemand zusieht?", metric: "20 Minuten echte Arbeit am Widerstand." },
        { title: "Cut Comfort", goal: "Komfort reduzieren.", task: "Eliminiere 1 Ablenkung für 7 Tage (z.B. Social, Serien, News).", time: "7 Tage", reflection: "Was beruhigt dich – und bremst dich?", metric: "1 Ablenkung gestrichen + Notiz über Effekt." },
        { title: "Raise the Stakes", goal: "Einsatz erhöhen.", task: "Setze eine Deadline + Konsequenz (öffentlich oder finanziell).", time: "30 Minuten", reflection: "Was passiert, wenn du es wirklich ernst meinst?", metric: "Deadline + Konsequenz schriftlich." },
        { title: "Expose the Work", goal: "Mut trainieren.", task: "Zeige Work-in-Progress öffentlich (Story/Post/Newsletter).", time: "45 Minuten", reflection: "Welche Version von dir versteckst du?", metric: "1 WIP veröffentlicht." }
      ],
      Refinement: [
        { title: "Less, But Sharper", goal: "Schärfen durch Reduktion.", task: "Wähle 1 Kernprojekt. Streiche 2 Nebenprojekte konsequent.", time: "45 Minuten", reflection: "Was hältst du nur aus Gewohnheit?", metric: "1 Kernprojekt + 2 Streichungen dokumentiert." },
        { title: "Portfolio Verdict", goal: "Qualität sichtbar machen.", task: "Kuratiere 9 Arbeiten. Reihenfolge = Aussage.", time: "90 Minuten", reflection: "Was ist dein Signature – wirklich?", metric: "9er-Set fertig (Link/Export)." },
        { title: "Build the Loop", goal: "Wiederholbar gewinnen.", task: "Definiere deinen 4-Wochen-Loop (Produktion → Veröffentlichung → Angebot → Review).", time: "60 Minuten", reflection: "Was ist deine klare Wiederholung?", metric: "Loop dokumentiert." },
        { title: "Maintain the Edge", goal: "Standard setzen.", task: "Schreibe 1 Regel: Was du ab jetzt nicht mehr tust.", time: "20 Minuten", reflection: "Welche Grenze macht dich frei?", metric: "1 Regel notiert + sichtbar platziert." }
      ]
    };

    const set = presets[phase];
    const pick = set[(w - 1) % set.length];

    return {
      week: w,
      phase,
      title: pick.title,
      goal: pick.goal,
      task: pick.task,
      time: pick.time,
      reflection: pick.reflection,
      metric: pick.metric
    };
  });

  // --- DOM
  const el = (id) => document.getElementById(id);

  const startDate = el("startDate");
  const btnStartToday = el("btnStartToday");
  const pillWeek = el("pillWeek");
  const pillPhase = el("pillPhase");
  const progressFill = el("progressFill");
  const progressText = el("progressText");
  const daysText = el("daysText");

  const btnPrev = el("btnPrev");
  const btnNext = el("btnNext");
  const weekJump = el("weekJump");
  const btnJump = el("btnJump");

  const weekKicker = el("weekKicker");
  const weekTitle = el("weekTitle");
  const weekPhaseLine = el("weekPhaseLine");
  const weekDone = el("weekDone");

  const weekGoal = el("weekGoal");
  const weekTask = el("weekTask");
  const weekTime = el("weekTime");
  const weekReflection = el("weekReflection");
  const weekMetric = el("weekMetric");

  const notes = el("notes");
  const saveState = el("saveState");
  const btnClearNotes = el("btnClearNotes");

  const reviewCard = el("reviewCard");
  const reviewKicker = el("reviewKicker");
  const reviewTitle = el("reviewTitle");
  const reviewLead = el("reviewLead");
  const reviewBadge = el("reviewBadge");

  const kpiOutput = el("kpiOutput");
  const kpiPublishes = el("kpiPublishes");
  const kpiRevenue = el("kpiRevenue");
  const kpiDoneProjects = el("kpiDoneProjects");
  const kpiContacts = el("kpiContacts");
  const elimList = el("elimList");
  const mutScore = el("mutScore");
  const mutScoreVal = el("mutScoreVal");
  const reviewNotes = el("reviewNotes");
  const btnSaveReview = el("btnSaveReview");
  const reviewSaveState = el("reviewSaveState");

  const ritualCard = el("ritualCard");
  const objChange = el("objChange");
  const ritualPlan = el("ritualPlan");
  const finalStatement = el("finalStatement");
  const btnSaveRitual = el("btnSaveRitual");
  const ritualSaveState = el("ritualSaveState");

  const btnExport = el("btnExport");
  const importFile = el("importFile");
  const btnReset = el("btnReset");

  // --- State
  const state = loadState();
  let activeWeek = clampInt(state.ui.activeWeek || 1, 1, MAX_WEEKS);

  // --- Init
  hydrateStartDate();
  recalcActiveWeekFromStart();
  render();

  // --- Events
  btnStartToday.addEventListener("click", () => {
    const today = toISODate(new Date());
    startDate.value = today;
    state.startDate = today;
    saveStateNow("Startdatum gespeichert.");
    recalcActiveWeekFromStart(true);
    render();
  });

  startDate.addEventListener("change", () => {
    const val = startDate.value;
    if (!isValidISODate(val)) return;
    state.startDate = val;
    saveStateNow("Startdatum gespeichert.");
    recalcActiveWeekFromStart(true);
    render();
  });

  btnPrev.addEventListener("click", () => {
    activeWeek = clampInt(activeWeek - 1, 1, MAX_WEEKS);
    state.ui.activeWeek = activeWeek;
    saveStateNow("Navigation gespeichert.");
    render();
  });

  btnNext.addEventListener("click", () => {
    activeWeek = clampInt(activeWeek + 1, 1, MAX_WEEKS);
    state.ui.activeWeek = activeWeek;
    saveStateNow("Navigation gespeichert.");
    render();
  });

  btnJump.addEventListener("click", () => {
    const target = clampInt(parseInt(weekJump.value, 10) || 1, 1, MAX_WEEKS);
    activeWeek = target;
    state.ui.activeWeek = activeWeek;
    saveStateNow("Navigation gespeichert.");
    render();
  });

  weekDone.addEventListener("change", () => {
    const wKey = String(activeWeek);
    state.weeks[wKey] = state.weeks[wKey] || {};
    state.weeks[wKey].done = !!weekDone.checked;
    saveStateNow("Woche gespeichert.");
    renderProgress();
  });

  const debouncedNotesSave = debounce(() => {
    const wKey = String(activeWeek);
    state.weeks[wKey] = state.weeks[wKey] || {};
    state.weeks[wKey].notes = notes.value || "";
    saveStateNow("Notizen gespeichert.");
  }, 250);

  notes.addEventListener("input", () => {
    saveState.textContent = "Speichere…";
    debouncedNotesSave();
  });

  btnClearNotes.addEventListener("click", () => {
    const wKey = String(activeWeek);
    state.weeks[wKey] = state.weeks[wKey] || {};
    state.weeks[wKey].notes = "";
    notes.value = "";
    saveStateNow("Notizen gelöscht.");
  });

  mutScore.addEventListener("input", () => {
    mutScoreVal.textContent = String(mutScore.value);
  });

  btnSaveReview.addEventListener("click", () => {
    const wk = String(activeWeek);
    state.reviews[wk] = {
      kpi: {
        output: numOr0(kpiOutput.value),
        publishes: numOr0(kpiPublishes.value),
        revenue: numOr0(kpiRevenue.value),
        doneProjects: numOr0(kpiDoneProjects.value),
        contacts: numOr0(kpiContacts.value)
      },
      elimList: elimList.value || "",
      mutScore: clampInt(parseInt(mutScore.value, 10) || 0, 0, 10),
      notes: reviewNotes.value || "",
      savedAt: new Date().toISOString()
    };
    saveStateNow("Review gespeichert.");
    reviewSaveState.textContent = "Review gespeichert.";
  });

  btnSaveRitual.addEventListener("click", () => {
    state.ritual = {
      objChange: objChange.value || "",
      ritualPlan: ritualPlan.value || "",
      finalStatement: finalStatement.value || "",
      savedAt: new Date().toISOString()
    };
    saveStateNow("Ritual gespeichert.");
    ritualSaveState.textContent = "Ritual gespeichert.";
  });

  btnExport.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rebelle-52weeks-backup-${toISODate(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  importFile.addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data || typeof data !== "object") throw new Error("Ungültige Datei.");
      // minimal validation
      const merged = normalizeState(data);
      Object.assign(state, merged);
      activeWeek = clampInt(state.ui.activeWeek || 1, 1, MAX_WEEKS);
      hydrateStartDate();
      recalcActiveWeekFromStart(true);
      saveStateNow("Import erfolgreich.");
      render();
      importFile.value = "";
    } catch (err) {
      alert("Import fehlgeschlagen. Bitte eine gültige JSON-Exportdatei auswählen.");
      importFile.value = "";
    }
  });

  btnReset.addEventListener("click", () => {
    const ok = confirm("Wirklich alles löschen? (Startdatum, Notizen, Fortschritt, Reviews)");
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });

  // --- Render
  function render() {
    renderHeader();
    renderWeek();
    renderReviewOrRitual();
    renderProgress();
  }

  function renderHeader() {
    const phase = getPhase(activeWeek);
    pillWeek.textContent = String(activeWeek);
    pillPhase.textContent = phase.name;
    daysText.textContent = state.startDate ? `Start: ${state.startDate}` : "Startdatum: —";
  }

  function renderWeek() {
    const w = WEEKS[activeWeek - 1];
    const phase = getPhase(activeWeek);

    weekKicker.textContent = `Woche ${w.week}`;
    weekTitle.textContent = w.title;
    weekPhaseLine.textContent = `${phase.name} · ${phase.blurb}`;

    weekGoal.textContent = w.goal;
    weekTask.textContent = w.task;
    weekTime.textContent = w.time;
    weekReflection.textContent = w.reflection;
    weekMetric.textContent = w.metric;

    const wKey = String(activeWeek);
    const saved = state.weeks[wKey] || {};
    weekDone.checked = !!saved.done;
    notes.value = saved.notes || "";
    saveState.textContent = "Offline gespeichert.";
  }

  function renderReviewOrRitual() {
    const isReview = REVIEW_WEEKS.has(activeWeek);
    const isRitual = activeWeek === RITUAL_WEEK;

    reviewCard.hidden = !isReview;
    ritualCard.hidden = !isRitual;

    if (isReview) {
      const label = `Quartals-Review · Woche ${activeWeek}`;
      reviewKicker.textContent = "Review";
      reviewTitle.textContent = label;
      reviewBadge.textContent = `W${activeWeek}`;
      reviewLead.textContent = "KPI. Eliminierung. Mut. Dann weiter.";

      const data = state.reviews[String(activeWeek)] || null;
      kpiOutput.value = data?.kpi?.output ?? "";
      kpiPublishes.value = data?.kpi?.publishes ?? "";
      kpiRevenue.value = data?.kpi?.revenue ?? "";
      kpiDoneProjects.value = data?.kpi?.doneProjects ?? "";
      kpiContacts.value = data?.kpi?.contacts ?? "";
      elimList.value = data?.elimList ?? "";
      mutScore.value = String(data?.mutScore ?? 0);
      mutScoreVal.textContent = String(mutScore.value);
      reviewNotes.value = data?.notes ?? "";
      reviewSaveState.textContent = data?.savedAt ? `Zuletzt gespeichert: ${formatTS(data.savedAt)}` : "Noch nicht gespeichert.";
    }

    if (isRitual) {
      const data = state.ritual || null;
      objChange.value = data?.objChange ?? "";
      ritualPlan.value = data?.ritualPlan ?? "";
      finalStatement.value = data?.finalStatement ?? "";
      ritualSaveState.textContent = data?.savedAt ? `Zuletzt gespeichert: ${formatTS(data.savedAt)}` : "Noch nicht gespeichert.";
    }
  }

  function renderProgress() {
    const doneCount = Object.values(state.weeks).filter(w => w && w.done).length;
    const pct = Math.round((doneCount / MAX_WEEKS) * 100);
    progressText.textContent = `${pct}% abgeschlossen · ${doneCount}/${MAX_WEEKS} Wochen`;
    progressFill.style.width = `${pct}%`;

    const bar = document.querySelector(".progress__bar");
    if (bar) bar.setAttribute("aria-valuenow", String(doneCount));
  }

  // --- Date logic (Start jederzeit)
  function recalcActiveWeekFromStart(force = false) {
    if (!state.startDate) {
      // default: today (but not forced)
      if (force) return;
      state.startDate = toISODate(new Date());
      hydrateStartDate();
      saveStateNow("Startdatum gesetzt.");
    }

    const start = parseISODate(state.startDate);
    if (!start) return;

    const today = startOfDay(new Date());
    const deltaDays = Math.floor((today - start) / 86400000);
    const week = clampInt(Math.floor(deltaDays / 7) + 1, 1, MAX_WEEKS);

    // If user manually navigated, keep it — but on fresh start, align.
    if (!state.ui.activeWeek || force) {
      activeWeek = week;
      state.ui.activeWeek = activeWeek;
      saveStateNow("Aktuelle Woche aktualisiert.");
    }
  }

  function hydrateStartDate() {
    if (state.startDate && isValidISODate(state.startDate)) {
      startDate.value = state.startDate;
    }
  }

  // --- Helpers
  function getPhase(week) {
    for (const p of PHASES) {
      if (week >= p.range[0] && week <= p.range[1]) return p;
    }
    return PHASES[0];
  }

  function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return normalizeState({});
    try {
      const parsed = JSON.parse(raw);
      return normalizeState(parsed);
    } catch {
      return normalizeState({});
    }
  }

  function normalizeState(input) {
    const base = {
      version: 2,
      startDate: "",
      weeks: {},
      reviews: {},
      ritual: null,
      ui: { activeWeek: 1 },
      savedAt: ""
    };

    const out = { ...base };
    if (input && typeof input === "object") {
      out.version = 2;
      out.startDate = isValidISODate(input.startDate) ? input.startDate : "";
      out.weeks = (input.weeks && typeof input.weeks === "object") ? input.weeks : {};
      out.reviews = (input.reviews && typeof input.reviews === "object") ? input.reviews : {};
      out.ritual = (input.ritual && typeof input.ritual === "object") ? input.ritual : null;
      out.ui = (input.ui && typeof input.ui === "object") ? { ...base.ui, ...input.ui } : { ...base.ui };
      out.savedAt = typeof input.savedAt === "string" ? input.savedAt : "";
    }
    return out;
  }

  function saveStateNow(message) {
    state.savedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    saveState.textContent = message || "Offline gespeichert.";
  }

  function toISODate(d) {
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
  }

  function parseISODate(str) {
    if (!isValidISODate(str)) return null;
    const [y, m, d] = str.split("-").map(n => parseInt(n, 10));
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
    const n = parseFloat(String(val).replace(",", "."));
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
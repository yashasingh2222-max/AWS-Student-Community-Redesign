/* AWS Community Day — interactions
   No frameworks. Four things: registration modal flow (form -> loading -> confirmation),
   track tabs, live countdown, and client-side .ics calendar file generation. */
(function () {
  "use strict";

  var EVENT = {
    title: "AWS Community Day — IGDTUW",
    start: new Date("2024-02-03T09:00:00+05:30"),
    end: new Date("2024-02-03T17:30:00+05:30"),
    loc: "Auditorium, IGDTUW, Kashmere Gate, Delhi",
    desc: "A full day of cloud talks and hands-on learning for students. Check-in 8:15-9:00 am; bring the QR from your email + college ID."
  };

  /* ---------- mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");
  navToggle.addEventListener("click", function () {
    var open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    mobileNav.hidden = open;
  });
  mobileNav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { mobileNav.hidden = true; navToggle.setAttribute("aria-expanded", "false"); }
  });

  /* ---------- countdown ---------- */
  var cd = { d: document.getElementById("cd-d"), h: document.getElementById("cd-h") };
  function tick() {
    var now = new Date();
    if (now > EVENT.start) {
      cd.d.textContent = "00"; cd.h.textContent = "00";
      document.getElementById("countdown").title = "It's event day! Doors open 8:15 am.";
      return;
    }
    var ms = EVENT.start - now;
    cd.d.textContent = String(Math.floor(ms / 864e5)).padStart(2, "0");
    cd.h.textContent = String(Math.floor((ms % 864e5) / 36e5)).padStart(2, "0");
  }
  tick(); setInterval(tick, 60000);

  /* ---------- track tabs ---------- */
  var trackBtns = document.querySelectorAll(".track-btn");
  var panels = document.querySelectorAll("[data-track-panel]");
  trackBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      trackBtns.forEach(function (b) { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-selected", String(b === btn)); });
      panels.forEach(function (p) { p.hidden = p.getAttribute("data-track-panel") !== btn.getAttribute("data-track"); });
    });
  });

  /* ---------- .ics generation (no external service) ---------- */
  function pad(n) { return String(n).padStart(2, "0"); }
  function ics(dt) {
    return dt.getUTCFullYear() + pad(dt.getUTCMonth() + 1) + pad(dt.getUTCDate()) + "T" +
      pad(dt.getUTCHours()) + pad(dt.getUTCMinutes()) + pad(dt.getUTCSeconds()) + "Z";
  }
  function addToCalendar() {
    var icsText = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AWS Cloud Club IGDTUW//Community Day//EN",
      "BEGIN:VEVENT",
      "UID:" + Date.now() + "@awscloudclub-igdtuw",
      "DTSTAMP:" + ics(new Date()),
      "DTSTART:" + ics(EVENT.start),
      "DTEND:" + ics(EVENT.end),
      "SUMMARY:" + EVENT.title,
      "LOCATION:" + EVENT.loc,
      "DESCRIPTION:" + EVENT.desc.replace(/,/g, "\\,"),
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:AWS Community Day is tomorrow", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    var blob = new Blob([icsText], { type: "text/calendar" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "aws-community-day.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    var note = document.getElementById("calNote");
    if (note) { note.hidden = false; setTimeout(function () { note.hidden = true; }, 5000); }
  }
  document.getElementById("calBtn").addEventListener("click", addToCalendar);

  /* ---------- registration modal: form -> loading -> confirmation ---------- */
  var modal = document.getElementById("regModal");
  var form = document.getElementById("regForm");
  var lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    form.hidden = false;
    modal.querySelectorAll(".modal-step").forEach(function (s) { if (s !== form) s.hidden = true; });
    document.body.style.overflow = "hidden";
    form.querySelector("input").focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll("[data-open-register]").forEach(function (b) {
    b.addEventListener("click", function () { mobileNav.hidden = true; openModal(); });
  });
  modal.addEventListener("click", function (e) {
    if (e.target.closest("[data-close-modal]")) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  /* inline validation — friendly, per-field */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true, firstBad = null;
    form.querySelectorAll(".field").forEach(function (f) {
      var input = f.querySelector("input");
      var err = f.querySelector("[data-err]");
      if (!err) return;
      var bad = !input.value.trim() ||
        (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value));
      f.classList.toggle("invalid", bad);
      err.hidden = !bad;
      if (bad) { ok = false; if (!firstBad) firstBad = input; }
    });
    if (!ok) { firstBad.focus(); return; }

    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    form.hidden = true;
    var loading = modal.querySelector('[data-step="loading"]');
    loading.hidden = false;
    /* simulated latency so the loading state is honest, not decorative */
    setTimeout(function () {
      loading.hidden = true;
      document.getElementById("confName").textContent = name.split(" ")[0];
      document.getElementById("confEmail").textContent = email;
      modal.querySelector('[data-step="done"]').hidden = false;
    }, 1100);
  });
  form.querySelectorAll("input").forEach(function (input) {
    input.addEventListener("input", function () {
      var f = input.closest(".field");
      f.classList.remove("invalid");
      var err = f.querySelector("[data-err]");
      if (err) err.hidden = true;
    });
  });
  document.getElementById("confCalBtn").addEventListener("click", addToCalendar);
})();



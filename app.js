/* AWS Community Day — interactions

   No frameworks. Four things:
   registration modal flow (form -> loading -> confirmation),
   track tabs, live countdown, and client-side .ics calendar file generation.
*/

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

  if (navToggle && mobileNav) {

    navToggle.addEventListener("click", function () {

      var open =
        navToggle.getAttribute("aria-expanded") === "true";

      navToggle.setAttribute(
        "aria-expanded",
        String(!open)
      );

      mobileNav.hidden = open;

    });


    mobileNav.addEventListener("click", function (e) {

      if (e.target.tagName === "A") {

        mobileNav.hidden = true;

        navToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    });

  }


  /* ---------- countdown ---------- */

  var cd = {
    d: document.getElementById("cd-d"),
    h: document.getElementById("cd-h")
  };


  function tick() {

    if (!cd.d || !cd.h) {
      return;
    }

    var now = new Date();

    if (now > EVENT.start) {

      cd.d.textContent = "00";
      cd.h.textContent = "00";

      var countdown =
        document.getElementById("countdown");

      if (countdown) {
        countdown.title =
          "It's event day! Doors open 8:15 am.";
      }

      return;
    }


    var ms = EVENT.start - now;


    cd.d.textContent =
      String(
        Math.floor(ms / 864e5)
      ).padStart(2, "0");


    cd.h.textContent =
      String(
        Math.floor(
          (ms % 864e5) / 36e5
        )
      ).padStart(2, "0");

  }


  tick();

  setInterval(tick, 60000);


  /* ---------- track tabs ---------- */

  var trackBtns =
    document.querySelectorAll(".track-btn");

  var panels =
    document.querySelectorAll("[data-track-panel]");


  trackBtns.forEach(function (btn) {

    btn.addEventListener("click", function () {

      trackBtns.forEach(function (b) {

        b.classList.toggle(
          "is-active",
          b === btn
        );

        b.setAttribute(
          "aria-selected",
          String(b === btn)
        );

      });


      panels.forEach(function (p) {

        p.hidden =
          p.getAttribute("data-track-panel") !==
          btn.getAttribute("data-track");

      });

    });

  });


  /* ---------- .ics generation ---------- */

  function pad(n) {

    return String(n).padStart(2, "0");

  }


  function ics(dt) {

    return (
      dt.getUTCFullYear() +
      pad(dt.getUTCMonth() + 1) +
      pad(dt.getUTCDate()) +
      "T" +
      pad(dt.getUTCHours()) +
      pad(dt.getUTCMinutes()) +
      pad(dt.getUTCSeconds()) +
      "Z"
    );

  }


  function addToCalendar() {

    var icsText = [

      "BEGIN:VCALENDAR",

      "VERSION:2.0",

      "PRODID:-//AWS Cloud Club IGDTUW//Community Day//EN",

      "BEGIN:VEVENT",

      "UID:" +
      Date.now() +
      "@awscloudclub-igdtuw",

      "DTSTAMP:" +
      ics(new Date()),

      "DTSTART:" +
      ics(EVENT.start),

      "DTEND:" +
      ics(EVENT.end),

      "SUMMARY:" +
      EVENT.title,

      "LOCATION:" +
      EVENT.loc,

      "DESCRIPTION:" +
      EVENT.desc.replace(/,/g, "\\,"),

      "BEGIN:VALARM",

      "TRIGGER:-P1D",

      "ACTION:DISPLAY",

      "DESCRIPTION:AWS Community Day is tomorrow",

      "END:VALARM",

      "END:VEVENT",

      "END:VCALENDAR"

    ].join("\r\n");


    var blob =
      new Blob(
        [icsText],
        { type: "text/calendar" }
      );


    var a =
      document.createElement("a");


    a.href =
      URL.createObjectURL(blob);


    a.download =
      "aws-community-day.ics";


    document.body.appendChild(a);

    a.click();

    a.remove();


    setTimeout(function () {

      URL.revokeObjectURL(a.href);

    }, 4000);


    var note =
      document.getElementById("calNote");


    if (note) {

      note.hidden = false;


      setTimeout(function () {

        note.hidden = true;

      }, 5000);

    }

  }


  var calBtn =
    document.getElementById("calBtn");


  if (calBtn) {

    calBtn.addEventListener(
      "click",
      addToCalendar
    );

  }


  /* ---------- registration modal ---------- */

  var modal =
    document.getElementById("regModal");


  var form =
    document.getElementById("regForm");


  var lastFocus = null;


  function openModal() {

    if (!modal || !form) {
      return;
    }


    lastFocus =
      document.activeElement;


    modal.hidden = false;

    form.hidden = false;


    modal
      .querySelectorAll(".modal-step")
      .forEach(function (s) {

        if (s !== form) {
          s.hidden = true;
        }

      });


    document.body.style.overflow =
      "hidden";


    var firstInput =
      form.querySelector("input");


    if (firstInput) {
      firstInput.focus();
    }

  }


  function closeModal() {

    if (!modal) {
      return;
    }


    modal.hidden = true;


    document.body.style.overflow =
      "";


    if (
      lastFocus &&
      typeof lastFocus.focus === "function"
    ) {

      lastFocus.focus();

    }

  }


  /* ---------- open registration buttons ---------- */

  document
    .querySelectorAll("[data-open-register]")
    .forEach(function (b) {

      b.addEventListener("click", function () {

        if (mobileNav) {
          mobileNav.hidden = true;
        }


        openModal();

      });

    });


  /* ---------- close modal buttons ---------- */

  if (modal) {

    modal.addEventListener(
      "click",
      function (e) {

        var closeButton =
          e.target.closest("[data-close-modal]");


        if (closeButton) {

          e.preventDefault();

          closeModal();

        }

      }
    );

  }


  /* ---------- Escape key ---------- */

  document.addEventListener(
    "keydown",
    function (e) {

      if (
        e.key === "Escape" &&
        modal &&
        !modal.hidden
      ) {

        closeModal();

      }

    }
  );


  /* ---------- form validation ---------- */

  if (form) {

    form.addEventListener(
      "submit",
      function (e) {

        e.preventDefault();


        var ok = true;

        var firstBad = null;


        form
          .querySelectorAll(".field")
          .forEach(function (f) {

            var input =
              f.querySelector("input");


            var err =
              f.querySelector("[data-err]");


            if (!input || !err) {
              return;
            }


            /* FIXED EMAIL REGEX */

            var bad =
              !input.value.trim() ||
              (
                input.type === "email" &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
                  .test(input.value)
              );


            f.classList.toggle(
              "invalid",
              bad
            );


            err.hidden = !bad;


            if (bad) {

              ok = false;


              if (!firstBad) {
                firstBad = input;
              }

            }

          });


        if (!ok) {

          if (firstBad) {
            firstBad.focus();
          }

          return;

        }


        var name =
          form.elements.name.value.trim();


        var email =
          form.elements.email.value.trim();


        /* Hide registration form */

        form.hidden = true;


        /* Show loading */

        var loading =
          modal.querySelector(
            '[data-step="loading"]'
          );


        if (loading) {
          loading.hidden = false;
        }


        /* Simulated registration */

        setTimeout(function () {


          if (loading) {
            loading.hidden = true;
          }


          var confName =
            document.getElementById(
              "confName"
            );


          var confEmail =
            document.getElementById(
              "confEmail"
            );


          if (confName) {

            confName.textContent =
              name.split(" ")[0];

          }


          if (confEmail) {

            confEmail.textContent =
              email;

          }


          var done =
            modal.querySelector(
              '[data-step="done"]'
            );


          if (done) {
            done.hidden = false;
          }


        }, 1100);

      }
    );


    /* ---------- clear validation errors ---------- */

    form
      .querySelectorAll("input")
      .forEach(function (input) {

        input.addEventListener(
          "input",
          function () {

            var f =
              input.closest(".field");


            if (!f) {
              return;
            }


            f.classList.remove(
              "invalid"
            );


            var err =
              f.querySelector("[data-err]");


            if (err) {
              err.hidden = true;
            }

          }
        );

      });

  }


  /* ---------- speaker level filter ---------- */

  var filterBtns =
    document.querySelectorAll(".filter-btn");

  var spCards =
    document.querySelectorAll(".sp-card");

  var spEmpty =
    document.getElementById("spEmpty");

  var spCount =
    document.getElementById("spCount");


  function applyFilter(level) {

    var shown = 0;

    spCards.forEach(function (card) {

      var match =
        level === "all" ||
        card.getAttribute("data-level") === level;

      card.hidden = !match;

      if (match) {
        shown += 1;
      }

    });


    if (spEmpty) {
      spEmpty.hidden = shown !== 0;
    }


    if (spCount) {

      spCount.textContent =
        shown === 1
          ? "1 talk at this level"
          : shown + " talks at this level";

    }

  }


  filterBtns.forEach(function (btn) {

    btn.addEventListener("click", function () {

      filterBtns.forEach(function (b) {

        b.classList.toggle(
          "is-active",
          b === btn
        );

      });


      applyFilter(
        btn.getAttribute("data-level")
      );

    });

  });


  applyFilter("all");


  /* ---------- confirmation calendar button ---------- */

  var confCalBtn =
    document.getElementById(
      "confCalBtn"
    );


  if (confCalBtn) {

    confCalBtn.addEventListener(
      "click",
      addToCalendar
    );

  }


})();
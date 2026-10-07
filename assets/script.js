/* ==========================================================================
   Site behaviour: mobile nav, scroll reveal, contact form.
   ========================================================================== */

/* ---- Contact form configuration ---------------------------------------
   The site is static, so the form needs somewhere to deliver messages.
   Set ONE of these:

   formEndpoint  A form-backend URL, e.g. a Formspree endpoint
                 "https://formspree.io/f/xxxxxxxx" (free tier, no server).
                 Messages are POSTed as JSON and arrive in your inbox.

   mailto        An email address. If no endpoint is set, submitting opens
                 the visitor's mail app with the message pre-filled.

   Leave both empty and the form shows a "not connected yet" notice instead
   of silently dropping messages.
   ----------------------------------------------------------------------- */
const CONTACT_CONFIG = {
  formEndpoint: "",
  mailto: "",
};

(function () {
  "use strict";

  /* ---- Footer year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      links.classList.toggle("open", open);
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    document.addEventListener("click", function (e) {
      if (!links.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });

    window.matchMedia("(min-width: 721px)").addEventListener("change", function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Contact form ---- */
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var submitBtn = form.querySelector('button[type="submit"]');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showStatus(kind, message) {
    status.className = "form-status show " + kind;
    status.textContent = message;
  }

  function setError(field, message) {
    var wrap = field.closest(".field");
    wrap.classList.toggle("invalid", Boolean(message));
    wrap.querySelector(".error").textContent = message || "";
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validate() {
    var name = form.elements.name;
    var email = form.elements.email;
    var message = form.elements.message;
    var firstBad = null;

    var checks = [
      [name, name.value.trim().length < 2, "Please enter your name."],
      [email, !EMAIL_RE.test(email.value.trim()), "Please enter a valid email address."],
      [message, message.value.trim().length < 10, "Please write a message (at least 10 characters)."],
    ];

    checks.forEach(function (c) {
      setError(c[0], c[1] ? c[2] : "");
      if (c[1] && !firstBad) firstBad = c[0];
    });

    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  // Clear an error as soon as the user fixes the field
  ["name", "email", "message"].forEach(function (n) {
    form.elements[n].addEventListener("input", function () { setError(form.elements[n], ""); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form-status";

    // Honeypot: real people never fill this in
    if (form.elements.website && form.elements.website.value) return;
    if (!validate()) return;

    var data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      subject: form.elements.subject.value.trim(),
      message: form.elements.message.value.trim(),
    };

    if (CONTACT_CONFIG.formEndpoint) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      fetch(CONTACT_CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed: " + res.status);
          form.reset();
          showStatus("ok", "Thanks, " + data.name.split(" ")[0] + "! Your message is on its way.");
        })
        .catch(function () {
          showStatus("err", "Something went wrong sending your message. Please try again in a moment.");
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send message";
        });
      return;
    }

    if (CONTACT_CONFIG.mailto) {
      var subject = data.subject || "Message from " + data.name;
      var body = data.message + "\n\n— " + data.name + " (" + data.email + ")";
      window.location.href =
        "mailto:" + CONTACT_CONFIG.mailto +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      showStatus("ok", "Opening your email app to send the message…");
      return;
    }

    showStatus(
      "err",
      "This form isn't connected to an inbox yet. Please reach out via LinkedIn or GitHub for now."
    );
  });
})();

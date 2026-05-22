/* ===================================================================
   SOLUBRA — Interacciones del sitio
   1) Menú móvil  2) Header al hacer scroll  3) Reveal on scroll
   4) Contador de estadísticas  5) Formulario -> WhatsApp  6) Año footer
   =================================================================== */
(function () {
  "use strict";

  /* ---------- 1. MENÚ MÓVIL ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  function closeMenu() {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    // Cerrar al pulsar un enlace
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    // Cerrar con tecla Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- 2. SOMBRA DEL HEADER AL SCROLL ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 3. REVEAL ON SCROLL ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 4. CONTADOR DE ESTADÍSTICAS ---------- */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1600;
    var start = performance.now();

    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll(".counter");
  if (counters.length && "IntersectionObserver" in window) {
    var counterIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (c) { counterIO.observe(c); });
  } else {
    counters.forEach(function (c) {
      c.textContent = (c.getAttribute("data-count") || "") + (c.getAttribute("data-suffix") || "");
    });
  }

  /* ---------- 5. FORMULARIO -> WHATSAPP ---------- */
  var form = document.getElementById("contactForm");
  var WHATSAPP_NUMBER = "56961789088"; // <-- número de Solubra

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nombre = form.nombre.value.trim();
      var telefono = form.telefono.value.trim();
      var servicio = form.servicio.value;
      var mensaje = form.mensaje.value.trim();

      // Validación simple de campos requeridos
      var valid = true;
      [form.nombre, form.telefono, form.mensaje].forEach(function (input) {
        if (!input.value.trim()) {
          input.classList.add("invalid");
          valid = false;
        } else {
          input.classList.remove("invalid");
        }
      });
      if (!valid) {
        form.querySelector(".invalid").focus();
        return;
      }

      // Construir mensaje para WhatsApp
      var texto =
        "Hola Solubra, quiero solicitar una cotización.%0A%0A" +
        "*Nombre:* " + encodeURIComponent(nombre) + "%0A" +
        "*Teléfono:* " + encodeURIComponent(telefono) + "%0A" +
        "*Servicio:* " + encodeURIComponent(servicio) + "%0A" +
        "*Detalle:* " + encodeURIComponent(mensaje);

      window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + texto, "_blank", "noopener");
    });

    // Quitar estado de error al escribir
    form.querySelectorAll("input, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        input.classList.remove("invalid");
      });
    });
  }

  /* ---------- 6. AÑO DINÁMICO EN FOOTER ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

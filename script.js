/* DedSec2 — form handling */
(function () {
  "use strict";

  const form = document.getElementById("joinForm");
  const note = document.getElementById("formNote");

  if (!form || !note) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const alias   = form.elements["alias"]?.value.trim();
    const email   = form.elements["email"]?.value.trim();
    const message = form.elements["message"]?.value.trim();

    if (!alias || !email || !message) {
      note.style.color = "var(--danger)";
      note.textContent = "// All fields required. Fill the form before transmitting.";
      return;
    }

    note.style.color = "var(--success)";
    note.textContent = "// Request transmitted. Stand by for confirmation.";
    form.reset();
  });
})();

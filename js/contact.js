/* contact.js — mailto form handler */

(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameField    = document.getElementById('fullName');
  const companyField = document.getElementById('companyName');
  const emailField   = document.getElementById('emailAddress');
  const phoneField   = document.getElementById('phoneNumber');
  const subjectField = document.getElementById('subject');
  const messageField = document.getElementById('message');
  const successEl    = document.getElementById('formSuccess');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const subjectLine = encodeURIComponent(
      '[' + subjectField.value + '] from ' + nameField.value + ' — ' + companyField.value
    );
    const body = encodeURIComponent(
      'Name: '    + nameField.value    + '\n' +
      'Company: ' + companyField.value + '\n' +
      'Email: '   + emailField.value   + '\n' +
      'Phone: '   + phoneField.value   + '\n\n' +
      'Message:\n' + messageField.value
    );

    window.location.href =
      'mailto:info@fortuneits.com?subject=' + subjectLine + '&body=' + body;

    // Show success state
    form.style.display = 'none';
    if (successEl) successEl.classList.add('show');
  });
})();

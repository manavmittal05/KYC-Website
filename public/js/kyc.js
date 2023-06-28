const btn = document.getElementById('submitButton');
const overlay = document.getElementById('loading');

btn.addEventListener('click', () => {
    // overlay.classList.add('show');
    overlay.classList += ' show';
});
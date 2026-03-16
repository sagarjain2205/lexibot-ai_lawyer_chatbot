// upload.js — Drag & Drop PDF Upload

const uploadZone = document.getElementById('uploadZone');
const pdfInput   = document.getElementById('pdfInput');

// Global selected file — used by analyze.js
window.selectedFile = null;

// Click to browse
uploadZone.addEventListener('click', () => pdfInput.click());

// Drag over
uploadZone.addEventListener('dragover', e => {
  e.preventDefault();
  uploadZone.classList.add('dragover');
});

// Drag leave
uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('dragover');
});

// Drop
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') {
    handleFile(file);
  } else {
    showError('Please upload a valid PDF file.');
  }
});

// File input change
pdfInput.addEventListener('change', () => {
  if (pdfInput.files[0]) handleFile(pdfInput.files[0]);
});

// Handle file selection
function handleFile(file) {
  window.selectedFile = file;
  uploadZone.classList.add('has-file');

  const fileNameEl = document.getElementById('fileName');
  fileNameEl.classList.add('show');
  document.getElementById('fileNameText').textContent = file.name;

  hideError();
}

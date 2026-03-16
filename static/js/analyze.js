// analyze.js — Main Analysis Logic

/* ── Loading Messages ── */
const loadingMsgs = [
  'Reading legal documents...',
  'Consulting LLaMA AI...',
  'Analysing case facts...',
  'Searching similar cases...',
  'Calculating risk score...',
  'Preparing recommendation...'
];
let loadingInterval = null;

/* ── Start Loading ── */
function startLoading() {
  document.getElementById('defaultRight').style.display = 'none';
  document.getElementById('riskPanel').style.display    = 'block';
  document.getElementById('loadingOverlay').classList.add('show');
  document.getElementById('riskNum').textContent        = '—';
  document.getElementById('submitBtn').disabled         = true;
  hideError();

  let i = 0;
  document.getElementById('loadingText').textContent = loadingMsgs[0];
  loadingInterval = setInterval(() => {
    i = (i + 1) % loadingMsgs.length;
    document.getElementById('loadingText').textContent = loadingMsgs[i];
  }, 1800);
}

/* ── Stop Loading ── */
function stopLoading() {
  clearInterval(loadingInterval);
  document.getElementById('loadingOverlay').classList.remove('show');
  document.getElementById('submitBtn').disabled = false;
}

/* ── Typing Effect ── */
function typeText(el, text, speed = 8) {
  el.textContent = '';
  el.classList.add('typing-cursor');
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    el.scrollTop = el.scrollHeight;
    if (i >= text.length) {
      clearInterval(timer);
      el.classList.remove('typing-cursor');
    }
  }, speed);
}

/* ── Risk Score Display ── */
function showRisk(risk) {
  const score   = risk.score   || 50;
  const verdict = risk.verdict || 'Neutral';
  const reason  = risk.reason  || '';

  let color;
  if      (score >= 70) color = '#10b981';
  else if (score >= 40) color = '#f59e0b';
  else                  color = '#ef4444';

  const circle = document.getElementById('riskCircle');
  circle.style.background = `conic-gradient(${color} ${score * 3.6}deg, rgba(255,255,255,0.05) 0deg)`;
  circle.style.boxShadow  = `0 0 30px ${color}44`;

  const numEl = document.getElementById('riskNum');
  numEl.style.color = color;
  let displayed = 0;
  const counter = setInterval(() => {
    displayed += 2;
    numEl.textContent = Math.min(displayed, score);
    if (displayed >= score) clearInterval(counter);
  }, 20);

  document.getElementById('riskVerdict').textContent = verdict;
  document.getElementById('riskVerdict').style.color = color;
  document.getElementById('riskReason').textContent  = reason;

  const bar = document.getElementById('riskBar');
  bar.style.background = `linear-gradient(90deg, ${color}, ${color}88)`;
  setTimeout(() => { bar.style.width = score + '%'; }, 100);
}

/* ── Error Helpers ── */
function showError(msg) {
  const box = document.getElementById('errorBox');
  document.getElementById('errorText').textContent = msg;
  box.classList.add('show');
}

function hideError() {
  document.getElementById('errorBox').classList.remove('show');
}

/* ── Reset Everything ── */
function resetAll() {
  // File reset
  window.selectedFile = null;
  document.getElementById('pdfInput').value = '';
  document.getElementById('uploadZone').classList.remove('has-file');
  document.getElementById('fileName').classList.remove('show');
  document.getElementById('fileNameText').textContent = '';

  // Query reset
  document.getElementById('queryInput').value = '';
  document.getElementById('voiceTranscript').classList.remove('show');
  document.getElementById('voiceTranscript').textContent = '';

  // Output reset
  document.getElementById('outputSection').classList.remove('show');
  document.getElementById('summaryOut').textContent   = '';
  document.getElementById('recommendOut').textContent = '';
  document.getElementById('queryChip').textContent    = '';

  // Risk panel reset
  document.getElementById('riskPanel').style.display    = 'none';
  document.getElementById('defaultRight').style.display = 'flex';
  document.getElementById('riskBar').style.width        = '0%';

  hideError();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Main Analyze Function ── */
async function analyzeCase() {
  if (!window.selectedFile) {
    showError('Please upload a legal case PDF first.');
    return;
  }

  const query = document.getElementById('queryInput').value.trim();
  const fd = new FormData();
  fd.append('pdf',   window.selectedFile);
  fd.append('query', query);

  startLoading();

  try {
    const res  = await fetch('/analyze', { method: 'POST', body: fd });
    const data = await res.json();

    if (data.error) {
      showError(data.error);
      stopLoading();
      return;
    }

    stopLoading();
    showRisk(data.risk);

    const outSec = document.getElementById('outputSection');
    outSec.classList.add('show');

    typeText(document.getElementById('summaryOut'), data.summary, 6);
    document.getElementById('queryChip').textContent = '❓ ' + data.query;

    setTimeout(() => {
      typeText(document.getElementById('recommendOut'), data.recommendation, 5);
    }, 500);

    setTimeout(() => {
      outSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);

  } catch (err) {
    stopLoading();
    showError('Server error. Make sure app.py (Flask) is running.');
  }
}
// voice.js — Voice Recording & Transcription via Whisper

let mediaRecorder = null;
let audioChunks   = [];
let isRecording   = false;

async function toggleVoice() {
  if (!isRecording) {
    // Start recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks   = [];

      mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunks, { type: 'audio/mp3' });
        const fd   = new FormData();
        fd.append('audio', blob, 'voice.mp3');

        try {
          const res  = await fetch('/transcribe', { method: 'POST', body: fd });
          const data = await res.json();

          if (data.text) {
            // Put transcript in query box
            document.getElementById('queryInput').value = data.text;

            // Show transcript preview
            const vt = document.getElementById('voiceTranscript');
            vt.classList.add('show');
            vt.textContent = '🎙️ ' + data.text;
          }
        } catch (err) {
          showError('Could not transcribe audio. Try again.');
        }
      };

      mediaRecorder.start();
      isRecording = true;

      // Update button UI
      const btn = document.getElementById('voiceBtn');
      btn.classList.add('recording');
      document.getElementById('voiceBtnText').textContent = 'Recording... Click to Stop';

    } catch (err) {
      showError('Microphone access denied. Please allow microphone access.');
    }

  } else {
    // Stop recording
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(t => t.stop());
    isRecording = false;

    const btn = document.getElementById('voiceBtn');
    btn.classList.remove('recording');
    document.getElementById('voiceBtnText').textContent = 'Record Voice Query';
  }
}

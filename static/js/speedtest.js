document.addEventListener('DOMContentLoaded', () => {
  // Element references (match `templates/index.html`)
  const pingEl = document.getElementById('ping');
  const downloadEl = document.getElementById('download');
  const uploadEl = document.getElementById('upload');
  const startBtn = document.getElementById('startBtn');

  // Optional gauge: only initialize if canvas + Chart are available
  let gauge = null;
  function updateGauge(value) {
    if (!gauge) return;
    const maxSpeed = 100;
    const val = Math.min(value, maxSpeed);
    gauge.data.datasets[0].data = [val, maxSpeed - val];
    gauge.update();
  }

  // Map speed to color range: returns hex color
  function colorForSpeed(mbps) {
    if (mbps <= 10) return '#ff3b30'; // red - slow
    if (mbps <= 50) return '#ffcc00'; // yellow - medium
    return '#00c853'; // green - fast
  }

  // Animate progress bar from 0 to target (Mbps) over duration (ms)
  function animateProgressTo(targetMbps, duration = 800) {
    const fill = document.getElementById('gaugeProgressFill');
    const label = document.getElementById('gaugeProgressLabel');
    if (!fill || !label) return;
    const start = performance.now();
    const from = parseFloat(fill.dataset.current || '0');
    const to = Math.max(0, targetMbps);

    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const cur = from + (to - from) * t;
      const percent = Math.min(100, (cur / 100) * 100);
      fill.style.width = percent + '%';
      fill.style.background = colorForSpeed(cur);
      label.innerText = Math.round(cur) + ' Mbps';
      fill.dataset.current = cur;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const gaugeCanvas = document.getElementById('speedGauge');
  if (gaugeCanvas && typeof Chart !== 'undefined') {
    try {
      const ctx = gaugeCanvas.getContext('2d');
      gauge = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Speed', 'Remaining'],
          datasets: [{
            data: [0, 100],
            backgroundColor: ['#00c853', '#e0e0e0'],
            borderWidth: 0
          }]
        },
        options: {
          rotation: -90,
          circumference: 180,
          cutout: '70%',
          plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
      });
    } catch (err) {
      console.warn('Failed to init Chart gauge:', err);
      gauge = null;
    }
  }

  async function testPing() {
    try {
      const start = performance.now();
      const res = await fetch('/ping');
      if (!res.ok) throw new Error('ping failed');
      const end = performance.now();
      return (end - start).toFixed(2);
    } catch (err) {
      console.error('testPing error', err);
      return '--';
    }
  }

  async function testDownload() {
    try {
      const start = performance.now();
      const res = await fetch('/download');
      if (!res.ok) throw new Error('download failed');
      const blob = await res.blob();
      const end = performance.now();
      const size = blob.size || 0;
      const duration = Math.max((end - start) / 1000, 0.001);
      const speed = ((size * 8) / duration / 1_000_000).toFixed(2);
      return speed;
    } catch (err) {
      console.error('testDownload error', err);
      return '--';
    }
  }

  async function testUpload() {
    try {
      const data = new Uint8Array(5 * 1024 * 1024); // 5MB dummy
      const start = performance.now();
      const res = await fetch('/upload', { method: 'POST', body: data });
      if (!res.ok) throw new Error('upload failed');
      const end = performance.now();
      const result = await res.json();
      const sizeBytes = result.size_bytes || data.length;
      const duration = Math.max((end - start) / 1000, 0.001);
      const speed = ((sizeBytes * 8) / duration / 1_000_000).toFixed(2);
      return speed;
    } catch (err) {
      console.error('testUpload error', err);
      return '--';
    }
  }

  if (startBtn) {
    startBtn.addEventListener('click', async () => {
      try {
        startBtn.disabled = true;
        const origText = startBtn.innerText;
        startBtn.innerText = 'Testing...';

        const ping = await testPing();
        if (pingEl) pingEl.innerText = ping;
        updateGauge(0);

  const download = await testDownload();
  const dval = Number.isFinite(parseFloat(download)) ? parseFloat(download) : 0;
  if (downloadEl) downloadEl.innerText = download;
  updateGauge(dval);
  animateProgressTo(dval);

  const upload = await testUpload();
  const uval = Number.isFinite(parseFloat(upload)) ? parseFloat(upload) : 0;
  if (uploadEl) uploadEl.innerText = upload;
  updateGauge(uval);
  animateProgressTo(uval);

        startBtn.innerText = origText;
      } catch (err) {
        console.error('run tests error', err);
        startBtn.innerText = 'Error';
      } finally {
        startBtn.disabled = false;
      }
    });
  } else {
    console.warn('Start button not found (#startBtn) — tests will not start automatically.');
  }
});
          startBtn.innerText = origText;


(function () {
    // ─── Default dates only (no defaults for form content) ───────────
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const fullDate = `${yyyy}-${mm}-${dd}`;

    const setDefault = (id, val) => {
        const el = document.getElementById(id);
        if (el && el.value.trim() === '') el.value = val;
    };

    setDefault('recordDate', fullDate);
    setDefault('sigDate', fullDate);
    setDefault('medicineName', 'Vitamin You');
    setDefault('dosageFreq', 'Full day — morning cuddles, noon texts, midnight thoughts of you 🌙');

    // ─── Auto-grow textareas ──────────────────────────────────────────
    function autoGrow(el) {
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.max(el.scrollHeight, 56) + 'px';
    }

    ['medicineName', 'dosageFreq'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', () => autoGrow(el));
        el.addEventListener('paste', () => setTimeout(() => autoGrow(el), 10));
        autoGrow(el);
    });

    // ─── Download PNG via dom-to-image-more ──────────────────────────
    const downloadBtn = document.getElementById('downloadBtn');
    const capture = document.getElementById('rxCapture');

    async function downloadPNG() {
        if (!capture || !window.domtoimage) {
            alert('Image library not loaded. Please refresh and try again.');
            return;
        }

        const originalHTML = downloadBtn.innerHTML;
        downloadBtn.innerHTML = 'Generating…';
        downloadBtn.disabled = true;

        try {
            // Use scale option directly — avoids layout shift from CSS transform
            const dataUrl = await domtoimage.toPng(capture, {
                scale: 2.5,
                bgcolor: '#faf7f0',
                quality: 1,
            });

            const link = document.createElement('a');
            const ts = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            link.download = `DarkClinic_Rx_${ts}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('PNG Error:', err);
            alert('Could not generate PNG.\n\nUse the Print / Save PDF button as alternative.\n\nError: ' + err.message);
        } finally {
            downloadBtn.innerHTML = originalHTML;
            downloadBtn.disabled = false;
        }
    }

    if (downloadBtn) downloadBtn.addEventListener('click', downloadPNG);

    // ─── Print / PDF fallback ─────────────────────────────────────────
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => window.print());
    }

    // ─── Floating hearts ─────────────────────────────────────────────
    const heartsContainer = document.getElementById('heartsContainer');
    const heartSymbols = ['♡', '♥', '❤', '💛', '✦', '♡', '♥'];

    function spawnHeart() {
        if (!heartsContainer) return;
        const el = document.createElement('span');
        el.className = 'floating-heart';
        el.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        const size = 0.6 + Math.random() * 1.2;
        const left = 5 + Math.random() * 90;
        const duration = 6 + Math.random() * 8;
        const delay = Math.random() * 2;
        el.style.cssText = `
            left: ${left}%;
            font-size: ${size}rem;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            color: rgba(201, 168, 76, ${0.2 + Math.random() * 0.35});
        `;
        heartsContainer.appendChild(el);
        setTimeout(() => el.remove(), (duration + delay) * 1000);
    }

    // Spawn hearts periodically
    for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 800);
    setInterval(spawnHeart, 2200);

    console.log('Dark Clinic Medical — ready.');
})();

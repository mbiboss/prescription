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

        // ── Lock flex heights so dom-to-image captures correct layout ──
        const pZone = capture.querySelector('.prescription-zone');
        const dDual = capture.querySelector('.diagnosis-dual');
        const medCol = capture.querySelector('.med-column');
        const dosCol = capture.querySelector('.dosage-column');
        const medTA = capture.querySelector('#medicineName');
        const dosTA = capture.querySelector('#dosageFreq');

        const saved = {};
        function lockEl(el, prop, val) {
            if (!el) return;
            saved[prop] = el.style[prop];
            el.style[prop] = val;
        }

        // Snapshot computed heights before locking
        const pZoneH = pZone ? pZone.offsetHeight + 'px' : null;
        const dDualH = dDual ? dDual.offsetHeight + 'px' : null;
        const medH   = medTA  ? medTA.offsetHeight  + 'px' : null;
        const dosH   = dosTA  ? dosTA.offsetHeight  + 'px' : null;

        if (pZone)  { pZone.style.flex = 'none'; pZone.style.height = pZoneH; }
        if (dDual)  { dDual.style.flex = 'none'; dDual.style.height = dDualH; dDual.style.flexDirection = 'row'; }
        if (medCol) { medCol.style.width = '50%'; medCol.style.flex = 'none'; }
        if (dosCol) { dosCol.style.width = '50%'; dosCol.style.flex = 'none'; }
        if (medTA)  { medTA.style.flex = 'none'; medTA.style.height = medH; }
        if (dosTA)  { dosTA.style.flex = 'none'; dosTA.style.height = dosH; }

        // Pause CSS animations during capture
        capture.style.animation = 'none';
        capture.querySelectorAll('*').forEach(el => { el.style.animationPlayState = 'paused'; });

        try {
            const isDarkCard = capture.classList.contains('dark-card');
            const dataUrl = await domtoimage.toPng(capture, {
                scale: 2.5,
                bgcolor: isDarkCard ? '#1c1710' : '#faf7f0',
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
            // Restore styles
            if (pZone)  { pZone.style.flex = ''; pZone.style.height = ''; }
            if (dDual)  { dDual.style.flex = ''; dDual.style.height = ''; dDual.style.flexDirection = ''; }
            if (medCol) { medCol.style.width = ''; medCol.style.flex = ''; }
            if (dosCol) { dosCol.style.width = ''; dosCol.style.flex = ''; }
            if (medTA)  { medTA.style.flex = ''; medTA.style.height = medH; }
            if (dosTA)  { dosTA.style.flex = ''; dosTA.style.height = dosH; }
            capture.style.animation = '';
            capture.querySelectorAll('*').forEach(el => { el.style.animationPlayState = ''; });

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

    // ─── Theme toggle (card dark / light) ────────────────────────────
    const themeToggle = document.getElementById('themeToggle');
    const savedCard = localStorage.getItem('dcm-card-theme');
    if (savedCard === 'dark' && capture) {
        capture.classList.add('dark-card');
        if (themeToggle) themeToggle.classList.add('active');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = capture.classList.toggle('dark-card');
            themeToggle.classList.toggle('active', isDark);
            localStorage.setItem('dcm-card-theme', isDark ? 'dark' : 'light');
        });
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

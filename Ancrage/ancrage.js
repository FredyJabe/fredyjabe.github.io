(function () {
    const folderUrl = 'Ancrage/images/';
    const fallbackImages = [
        { src: 'images/Piment Alphonso.jpg', caption: 'Piment Alphonso' },
        { src: 'images/Runes nordiques dans le cou.jpg', caption: 'Runes nordiques' },
        { src: 'images/Sourire du Joker.jpg', caption: 'Sourire du Joker' },
        { src: 'images/Loup.jpg', caption: 'Loup' },
        { src: 'images/Doris.jpg', caption: 'Doris' },
        { src: 'images/Corbeau sur un crane.jpg', caption: 'Corbeau sur un crane' },
        { src: 'images/Papillon-Tigre.jpg', caption: 'Papillon-tigre' },
        { src: 'images/Coeurs familial.jpg', caption: 'Coeurs familial' },
        { src: 'images/Dessin cheval.jpg', caption: 'Dessin cheval' }
    ];

    let images = [];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getRandomImages(input) {
        return shuffleArray(input).slice(0, 5).map((item, idx) => ({
            src: item.src,
            caption: item.caption || `Image #${idx + 1}`
        }));
    }

    function isValidCarouselImage(url) {
        return !/(logo|favicon|icon)/i.test(url);
    }

    function parseImageLinksFromList(html, baseUrl) {
        const links = [];
        const regex = /href="([^"]+\.(?:png|jpe?g|gif|webp))"/gi;
        let match;
        while ((match = regex.exec(html)) !== null) {
            const url = match[1];
            if (/\.(png|jpe?g|gif|webp)$/i.test(url) && isValidCarouselImage(url)) {
                const normalized = url.startsWith('http') ? url : baseUrl + url.replace(/^\/?/, '');
                links.push({ src: normalized, caption: 'Ancrage galerie' });
            }
        }
        return links;
    }

    function getFileName(path) {
        const name = path.split('/').pop().split('?')[0].split('#')[0];
        return name || path;
    }

    async function discoverImages() {
        try {
            const res = await fetch(folderUrl);
            if (!res.ok) throw new Error('Directory fetch failed');
            const html = await res.text();
            const parsed = parseImageLinksFromList(html, folderUrl);
            if (parsed.length >= 5) {
                return getRandomImages(parsed);
            }
        } catch (err) {
            console.warn('Image discovery fall back:', err);
        }
        return getRandomImages(fallbackImages);
    }

    let index = 0;
    const imageEl = document.getElementById('carouselImage');
    const counterEl = document.getElementById('carouselCounter');
    const captionEl = document.getElementById('carouselCaption');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselView = document.querySelector('.carousel-view');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    function setSlide(i) {
        index = (i + images.length) % images.length;
        const item = images[index];
        imageEl.src = item.src;
        imageEl.alt = item.caption;
        counterEl.textContent = `${index + 1} / ${images.length}`;
        captionEl.textContent = item.caption;
    }

    function openLightbox() {
        const current = images[index];
        lightboxImage.src = current.src;
        lightboxImage.alt = current.caption;
        lightboxCaption.textContent = getFileName(current.src);
        lightbox.classList.add('visible');
        lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
        lightbox.classList.remove('visible');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImage.src = '';
        lightboxCaption.textContent = '';
    }

    function next() { setSlide(index + 1); }
    function prev() { setSlide(index - 1); }

    prevBtn.addEventListener('click', function (e) { e.preventDefault(); prev(); resetTimer(); });
    nextBtn.addEventListener('click', function (e) { e.preventDefault(); next(); resetTimer(); });
    carouselView.addEventListener('click', openLightbox);
    carouselView.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox();
        }
    });

    lightboxClose.addEventListener('click', function () { closeLightbox(); });
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
            closeLightbox();
        }
    });

    let timer;
    function startAutoPlay() {
        if (timer) clearInterval(timer);
        timer = setInterval(next, 4700);
    }

    function resetTimer() {
        startAutoPlay();
    }

    discoverImages().then((result) => {
        images = result;
        setSlide(0);
        startAutoPlay();
    }).catch((e) => {
        console.error('Carousel setup error', e);
        images = getRandomImages(fallbackImages);
        setSlide(0);
        startAutoPlay();
    });
})();
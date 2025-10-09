// version: 2.2
document.addEventListener('DOMContentLoaded', function() {
    // --- Modal Image Preloading ---
    const allModalButtons = document.querySelectorAll('.open-modal-btn');
    allModalButtons.forEach(btn => {
        const imgSrc = btn.dataset.imgSrc;
        if (imgSrc) {
            const preloader = new Image();
            preloader.src = imgSrc;
        }
    });

    // --- Scroll Animation Logic ---
    const animatedElements = document.querySelectorAll('.fade-in-up, .timeline-bar');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -200px 0px'
        });
        animatedElements.forEach((el) => {
            // Profile 섹션은 즉시 보이도록 처리
            if (el.closest('section')?.id === 'profile') {
                 el.classList.add('visible');
            } else {
                observer.observe(el);
            }
        });
    } else {
        animatedElements.forEach(el => el.classList.add('visible'));
    }

    // --- Accordion Logic ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            header.classList.toggle('active');
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                // 부드러운 스크롤을 위해 약간의 여유를 줌
                content.style.maxHeight = (content.scrollHeight + 20) + "px";
            }
        });
    });

    // --- Timeline Graph Logic ---
    const timelineBars = document.querySelectorAll('.timeline-bar');
    const timelineAxis = document.querySelector('.timeline-axis');
    if (timelineBars.length > 0 && timelineAxis) {
        const START_YEAR = 2014;
        const END_YEAR = new Date().getFullYear() + 1;
        const totalMonths = (END_YEAR - START_YEAR) * 12;
        const yPositions = ['20px', '70px', '120px'];

        timelineBars.forEach((bar, index) => {
            const startDateStr = bar.dataset.start;
            const endDateStr = bar.dataset.end;
            const [startYear, startMonth] = startDateStr.split('.').map(Number);
            let endYear, endMonth;
            if (endDateStr.toLowerCase() === 'present') {
                const now = new Date();
                endYear = now.getFullYear();
                endMonth = now.getMonth() + 1;
            } else {
                [endYear, endMonth] = endDateStr.split('.').map(Number);
            }
            const startOffsetMonths = (startYear - START_YEAR) * 12 + (startMonth - 1);
            const endOffsetMonths = (endYear - START_YEAR) * 12 + (endMonth - 1);
            const durationMonths = endOffsetMonths - startOffsetMonths + 1;
            const leftPercentage = (startOffsetMonths / totalMonths) * 100;
            const widthPercentage = (durationMonths / totalMonths) * 100;
            bar.style.left = `${leftPercentage}%`;
            bar.style.width = `${widthPercentage}%`;
            bar.style.top = yPositions[index % yPositions.length];
            const durationYears = Math.floor(durationMonths / 12);
            const durationRemainderMonths = durationMonths % 12;
            let durationText = '';
            if(durationYears > 0) durationText += `${durationYears}년 `;
            if(durationRemainderMonths > 0) durationText += `${durationRemainderMonths}개월`;
            const tooltip = bar.querySelector('.bar-tooltip');
            tooltip.textContent = `${startDateStr} ~ ${endDateStr} (${durationText.trim()})`;
        });

        timelineAxis.innerHTML = '';
        for (let year = START_YEAR; year <= END_YEAR; year++) {
            const marker = document.createElement('div');
            marker.className = 'axis-marker';
            marker.textContent = year;
            timelineAxis.appendChild(marker);
        }
    }

    // --- Navigation Logic ---
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.sidebar a');
    const sections = document.querySelectorAll('.section');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
            }
        });
    });

    mainContent.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (mainContent.scrollTop >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // --- Image Modal Logic ---
    const imageModal = document.getElementById('image-modal');
    const imageCloseButton = document.getElementById('image-close-button');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('image-modal-title');

    if (imageModal && imageCloseButton && modalImage && modalTitle) {
        allModalButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const imgSrc = btn.dataset.imgSrc;
                const titleText = btn.textContent.replace(/['‘’""]/g, '').replace(/ ?확인하기$/, '').trim();
                if (imgSrc) {
                    modalTitle.textContent = titleText;
                    modalImage.src = imgSrc;
                    imageModal.classList.add('visible');
                }
            });
        });

        function closeImageModal() {
            imageModal.classList.remove('visible');
        }

        imageCloseButton.addEventListener('click', closeImageModal);
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && imageModal.classList.contains('visible')) {
                closeImageModal();
            }
        });
    }

    // --- '하고 싶은 일' 모달 로직 ---
    const ideasButton = document.getElementById('ideas-button');
    const ideasModal = document.getElementById('ideas-modal');
    const ideasCloseButton = document.getElementById('ideas-close-button');

    if (ideasButton && ideasModal && ideasCloseButton) {
        ideasButton.addEventListener('click', () => {
            confetti({
                particleCount: 150,
                spread: 90,
                origin: { y: 0.7 },
                zIndex: 9999
            });
            ideasModal.classList.add('visible');
        });

        function closeIdeasModal() {
            ideasModal.classList.remove('visible');
        }

        ideasCloseButton.addEventListener('click', closeIdeasModal);
        ideasModal.addEventListener('click', (event) => {
            if (event.target === ideasModal) {
                closeIdeasModal();
            }
        });
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && ideasModal.classList.contains('visible')) {
                closeIdeasModal();
            }
        });
    }

    // --- Scroll UI Logic ---
    const scrollDownIndicator = document.getElementById('scroll-down-indicator');
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
    const educationSection = document.getElementById('education');

    if (scrollDownIndicator && scrollToTopBtn && educationSection) {
        scrollDownIndicator.addEventListener('click', (e) => {
            e.preventDefault();
            const currentScroll = mainContent.scrollTop;
            const windowHeight = mainContent.clientHeight;
            if (currentScroll < 50) {
                const firstSection = document.getElementById('projects');
                if (firstSection) {
                    mainContent.scrollTo({ top: firstSection.offsetTop - 30, behavior: 'smooth' });
                }
                return;
            }
            const defaultNextScroll = currentScroll + (windowHeight * 0.8);
            const sectionsArray = Array.from(sections);
            const nextSection = sectionsArray.find(section => section.offsetTop > currentScroll + 50);
            let nextSectionTop = nextSection ? nextSection.offsetTop - 30 : Infinity;
            const targetScrollPosition = Math.min(defaultNextScroll, nextSectionTop);
            mainContent.scrollTo({
                top: targetScrollPosition,
                behavior: 'smooth'
            });
        });

        scrollToTopBtn.addEventListener('click', () => {
            mainContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        mainContent.addEventListener('scroll', () => {
            const isAtBottom = mainContent.scrollHeight - mainContent.scrollTop - mainContent.clientHeight < 50;
            scrollDownIndicator.classList.toggle('hidden', isAtBottom);
        });

        const topBtnObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                scrollToTopBtn.classList.toggle('hidden', !entry.isIntersecting && mainContent.scrollTop < entry.target.offsetTop);
            });
        }, { threshold: 0.1 });

        topBtnObserver.observe(educationSection);
    }

    // --- Action Buttons Logic ---
    const pdfBtn = document.getElementById('pdf-btn');
    const printBtn = document.getElementById('print-btn');
    const shareBtn = document.getElementById('share-btn');

    // PDF 저장
    pdfBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const pdfUrl = 'PO_김도영_tossplace.pdf'; // 업로드된 PDF 파일 경로
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'PO_김도영_tossplace_이력서.pdf'; // 다운로드될 파일 이름
        link.style.display = 'none'; // 숨김 처리
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // 출력 - PDF 파일을 새 창에서 열기
    printBtn.addEventListener('click', () => {
        const pdfUrl = 'PO_김도영_tossplace.pdf';
        window.open(pdfUrl, '_blank');
    });

    // 공유
    shareBtn.addEventListener('click', async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: '김도영 | Product Owner 이력서',
                    text: '김도영의 이력서를 확인해보세요.',
                    url: url,
                });
            } else {
                // navigator.share를 지원하지 않는 브라우저 (PC 등)
                await navigator.clipboard.writeText(url);
                alert('이력서 링크가 클립보드에 복사되었습니다.');
            }
        } catch (err) {
            console.error('Share failed:', err);
            // 복사 실패 시 수동 복사 안내
            prompt('아래 주소를 복사하여 공유해주세요.', url);
        }
    });
});



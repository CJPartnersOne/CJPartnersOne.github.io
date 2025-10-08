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

   // --- [수정] Scroll Fade-in Animation Logic (v2) ---
    const fadeInElements = document.querySelectorAll('.fade-in-up');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.01, // [수정 1] 애니메이션 시작 조건을 더 완화 (1%만 보여도 시작)
            rootMargin: '0px 0px -50px 0px' // [수정 2] 화면 하단에서 50px 위에서부터 감지 시작
        });

        fadeInElements.forEach((el, index) => {
            // [수정 3] 첫 번째 애니메이션 요소는 즉시 보이도록 처리
            if (index === 0) {
                el.classList.add('visible');
            } else {
                observer.observe(el);
            }
        });
    } else {
        fadeInElements.forEach(el => el.classList.add('visible'));
    }
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


    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const imageModal = document.getElementById('image-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalImage = document.getElementById('modal-image');

    // === [추가] 이미지 캐시 저장용 ===
    const imageCache = {};

    if (imageModal && closeModalBtn && modalImage) {
        // 페이지 로드시 백그라운드에서 미리 이미지 로드
        openModalBtns.forEach(btn => {
            const imgSrc = btn.dataset.imgSrc;
            if (imgSrc && !imageCache[imgSrc]) {
                const img = new Image();
                img.src = imgSrc;
                img.onload = () => imageCache[imgSrc] = img;
            }
        });

        openModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const imgSrc = btn.dataset.imgSrc;
                if (!imgSrc) return;

                modalImage.style.opacity = '0';
                modalImage.src = ''; 
                imageModal.classList.add('visible');

                // 캐시에 있으면 즉시 표시
                if (imageCache[imgSrc]) {
                    modalImage.src = imgSrc;
                    modalImage.style.opacity = '1';
                } else {
                    // 혹시 캐시 안된 경우 대비
                    const tempImg = new Image();
                    tempImg.src = imgSrc;
                    tempImg.onload = () => {
                        imageCache[imgSrc] = tempImg;
                        modalImage.src = imgSrc;
                        modalImage.style.opacity = '1';
                    };
                }
            });
        });

        const closeImageModal = () => imageModal.classList.remove('visible');

        closeModalBtn.addEventListener('click', closeImageModal);
        imageModal.addEventListener('click', e => {
            if (e.target === imageModal) closeImageModal();
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && imageModal.classList.contains('visible')) {
                closeImageModal();
            }
        });
    }


    const ideasButton = document.getElementById('ideas-button');
    const ideasModal = document.getElementById('ideas-modal');
    const ideasCloseButton = document.getElementById('ideas-close-button');

    if (ideasButton && ideasModal && ideasCloseButton) {
        ideasButton.addEventListener('click', () => {
            // 폭죽 효과 실행!
            ideasModal.classList.add('visible');
            confetti({
                particleCount: 150, // 파티클 개수
                spread: 90,       // 퍼지는 각도
                origin: { y: 0.7 },
                zIndex: 9999  // 화면의 70% 높이에서 시작
            });
            
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

     // --- [수정] Scroll UI Logic (지능형 스크롤 v3) ---
    const scrollDownIndicator = document.getElementById('scroll-down-indicator');
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
    const educationSection = document.getElementById('education');

    if (scrollDownIndicator && scrollToTopBtn && educationSection) {
        // 스크롤 다운 버튼 클릭 시 (지능형 타겟 설정)
        scrollDownIndicator.addEventListener('click', (e) => {
            e.preventDefault();
            
            const currentScroll = mainContent.scrollTop;
            const windowHeight = mainContent.clientHeight;
            
            // 1. '한 화면 아래'로 스크롤할 위치를 계산합니다.
            const pageDownScroll = currentScroll + (windowHeight * 0.8);
            
            const sectionsArray = Array.from(sections);
            let nextSectionTop = Infinity; // 다음 섹션의 상단 위치를 무한대로 초기화

            // 2. 현재 스크롤 위치 바로 아래에 있는 '다음 섹션'을 찾습니다.
            const nextSection = sectionsArray.find(section => section.offsetTop > currentScroll + 50);
            
            if (nextSection) {
                nextSectionTop = nextSection.offsetTop - 30; // 다음 섹션 상단 위치 (여백 포함)
            }

            // 3. '한 화면 아래'와 '다음 섹션 상단' 중 더 가까운(작은) 값으로 이동합니다.
            const targetScrollPosition = Math.min(pageDownScroll, nextSectionTop);

            mainContent.scrollTo({
                top: targetScrollPosition,
                behavior: 'smooth'
            });
        });

        // 최상단으로 이동 버튼 클릭 시
        scrollToTopBtn.addEventListener('click', () => {
            mainContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // 스크롤 위치에 따른 UI 가시성 제어
        mainContent.addEventListener('scroll', () => {
            const isAtBottom = mainContent.scrollHeight - mainContent.scrollTop - mainContent.clientHeight < 50;
            if (isAtBottom) {
                scrollDownIndicator.classList.add('hidden');
            } else {
                scrollDownIndicator.classList.remove('hidden');
            }
        });

        // 'Education' 섹션 감지를 위한 Intersection Observer
        const topBtnObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    scrollToTopBtn.classList.remove('hidden');
                } else {
                    if (mainContent.scrollTop < entry.target.offsetTop) {
                        scrollToTopBtn.classList.add('hidden');
                    }
                }
            });
        }, { threshold: 0.1 });

        topBtnObserver.observe(educationSection);
    }
});



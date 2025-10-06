document.addEventListener('DOMContentLoaded', function() {
    // --- Timeline Graph Logic ---
    const timelineBars = document.querySelectorAll('.timeline-bar');
    const timelineAxis = document.querySelector('.timeline-axis');
    if (timelineBars.length > 0 && timelineAxis) {
        const START_YEAR = 2014;
        const END_YEAR = new Date().getFullYear() + 1;
        const totalMonths = (END_YEAR - START_YEAR) * 12;
        const yPositions = ['20px', '70px', '120px', '170px', '20px', '70px'];

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

    if (imageModal && closeModalBtn && modalImage) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const imgSrc = btn.dataset.imgSrc;
                if (imgSrc) {
                
                    modalImage.style.opacity = '0';
                    modalImage.src = ''; 
                    imageModal.classList.add('visible');

             
                    const preloader = new Image();
                    preloader.src = imgSrc;

             
                    preloader.onload = () => {
                        modalImage.src = imgSrc;
                        modalImage.style.opacity = '1';
                    };
                }
            });
        });

        function closeImageModal() {
            imageModal.classList.remove('visible');
        }

        closeModalBtn.addEventListener('click', closeImageModal);
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


    const ideasButton = document.getElementById('ideas-button');
    const ideasModal = document.getElementById('ideas-modal');
    const ideasCloseButton = document.getElementById('ideas-close-button');

    if (ideasButton && ideasModal && ideasCloseButton) {
        ideasButton.addEventListener('click', () => {
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
});

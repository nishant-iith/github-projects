document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });
    });

    // Prevent clicks on disabled links
    const disabledLinks = document.querySelectorAll('.project-link.disabled');
    disabledLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
        });
    });

    // Modified theme initialization
    const themeToggle = document.getElementById('theme-toggle');
    
    // Set dark theme as default if no theme is saved
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';

    // Update theme toggle handler
    themeToggle.addEventListener('change', () => {
        const theme = themeToggle.checked ? 'dark' : 'light';
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // Category filtering
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            projectCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Add loading animation
    window.addEventListener('load', () => {
        projectCards.forEach(card => {
            card.style.opacity = '0';
            card.style.animation = 'fadeIn 0.5s forwards';
        });
    });

    // Video Modal Functionality
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const youtubePlayer = document.getElementById('youtubePlayer');
    const videoBtns = document.querySelectorAll('.video-btn');
    const closeModal = document.querySelector('.close-modal');

    videoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const videoUrl = btn.dataset.video;
            const videoType = btn.dataset.type;

            // Hide both players initially
            videoPlayer.style.display = 'none';
            youtubePlayer.style.display = 'none';

            if (videoType === 'youtube') {
                // Updated YouTube embed URL format with additional parameters
                youtubePlayer.src = `https://www.youtube.com/embed/${videoUrl}?autoplay=1&rel=0`;
                youtubePlayer.style.display = 'block';
            } else {
                videoPlayer.src = videoUrl;
                videoPlayer.style.display = 'block';
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    closeModal.addEventListener('click', closeVideoModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVideoModal();
        }
    });

    function closeVideoModal() {
        modal.classList.remove('active');
        // Stop both video types
        videoPlayer.pause();
        videoPlayer.src = '';
        youtubePlayer.src = '';
        document.body.style.overflow = '';
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeVideoModal();
        }
    });
});

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

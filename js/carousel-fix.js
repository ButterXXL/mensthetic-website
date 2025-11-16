// New JavaScript-based Infinite Carousel
document.addEventListener('DOMContentLoaded', function() {
    const infiniteCarousel = document.querySelector('.infinite-carousel');
    if (!infiniteCarousel) return;
    
    const carouselTrack = infiniteCarousel.querySelector('.carousel-track');
    const cards = carouselTrack.querySelectorAll('.before-after-card');
    
    // Remove any CSS animations
    carouselTrack.style.animation = 'none';
    carouselTrack.style.webkitAnimation = 'none';
    
    // Settings
    const pixelsPerSecond = 15; // Slow, smooth scrolling
    let position = 0;
    let isPaused = false;
    let animationId = null;
    let lastTimestamp = null;
    
    // Calculate total width
    const cardWidth = cards[0].offsetWidth + 12; // card width + gap
    const totalWidth = cardWidth * (cards.length / 2); // Half because we have duplicates
    
    // Animation function
    function animate(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        
        const deltaTime = timestamp - lastTimestamp;
        lastTimestamp = timestamp;
        
        if (!isPaused) {
            // Move carousel
            position -= (pixelsPerSecond * deltaTime) / 1000;
            
            // Reset position when reaching halfway (seamless loop)
            if (Math.abs(position) >= totalWidth) {
                position = 0;
            }
            
            // Apply transform
            carouselTrack.style.transform = `translateX(${position}px)`;
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Start animation
    animationId = requestAnimationFrame(animate);
    
    // Pause on hover
    infiniteCarousel.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    
    infiniteCarousel.addEventListener('mouseleave', () => {
        isPaused = false;
    });
    
    // Simplified visibility handling - just pause, don't reset
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isPaused = true;
        } else {
            isPaused = false;
            // Don't reset timestamp - let it continue smoothly
        }
    });
    
    // Add click interactions to cards
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Add visual feedback
            card.style.transform = 'translateY(-4px) scale(1.02)';
            setTimeout(() => {
                card.style.transform = '';
            }, 200);
        });
    });
});
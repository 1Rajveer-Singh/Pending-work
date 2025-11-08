/**
 * Advanced Cursor Effects and Mouse Interactions
 */

class AdvancedCursor {
    constructor() {
        this.cursor = null;
        this.cursorFollower = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.followerX = 0;
        this.followerY = 0;
        this.init();
    }

    init() {
        this.createCursor();
        this.setupMouseTracking();
        this.setupCursorEffects();
        this.setupTextReveal();
    }

    createCursor() {
        // Main cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);

        // Cursor follower
        this.cursorFollower = document.createElement('div');
        this.cursorFollower.className = 'cursor-follower';
        document.body.appendChild(this.cursorFollower);

        // Hide default cursor on desktop
        if (window.innerWidth > 768) {
            document.body.style.cursor = 'none';
        }
    }

    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Update main cursor position immediately
            this.cursor.style.left = this.mouseX + 'px';
            this.cursor.style.top = this.mouseY + 'px';
        });

        // Smooth follower animation
        this.animateFollower();
    }

    animateFollower() {
        const lerp = (start, end, factor) => start + (end - start) * factor;
        
        const animate = () => {
            this.followerX = lerp(this.followerX, this.mouseX, 0.1);
            this.followerY = lerp(this.followerY, this.mouseY, 0.1);
            
            this.cursorFollower.style.left = this.followerX + 'px';
            this.cursorFollower.style.top = this.followerY + 'px';
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    setupCursorEffects() {
        // Interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .magnetic, .hover-glow');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('cursor-hover');
                this.cursorFollower.classList.add('cursor-hover');
                
                // Add ripple effect
                this.createRipple(element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('cursor-hover');
                this.cursorFollower.classList.remove('cursor-hover');
            });
        });

        // Text elements
        const textElements = document.querySelectorAll('h1, h2, h3, p');
        
        textElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('cursor-text');
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('cursor-text');
            });
        });
    }

    createRipple(element) {
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    setupTextReveal() {
        const revealElements = document.querySelectorAll('.text-reveal');
        
        revealElements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            
            [...text].forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.animationDelay = `${index * 0.05}s`;
                element.appendChild(span);
            });
        });
    }
}

// Initialize cursor effects on desktop only
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 768) {
        new AdvancedCursor();
    }
});
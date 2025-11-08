/**
 * Advanced Section Navigation and Scroll Indicators
 */

class SectionNavigator {
    constructor() {
        this.sections = [];
        this.currentSection = 0;
        this.init();
    }

    init() {
        this.findSections();
        this.createScrollIndicator();
        this.setupScrollTracking();
        this.setupKeyboardNavigation();
    }

    findSections() {
        this.sections = Array.from(document.querySelectorAll('section[id]')).map(section => ({
            id: section.id,
            element: section,
            title: section.querySelector('h1, h2, h3')?.textContent || section.id
        }));
    }

    createScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'section-scroll-indicator';
        
        this.sections.forEach((section, index) => {
            const dot = document.createElement('div');
            dot.className = 'scroll-dot';
            dot.dataset.section = section.id;
            dot.title = section.title;
            
            // Add tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'scroll-tooltip';
            tooltip.textContent = section.title;
            dot.appendChild(tooltip);
            
            dot.addEventListener('click', () => {
                this.navigateToSection(index);
            });
            
            indicator.appendChild(dot);
        });
        
        document.body.appendChild(indicator);
        this.updateActiveIndicator();
    }

    setupScrollTracking() {
        const observerOptions = {
            threshold: 0.6,
            rootMargin: '-20% 0px -20% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionIndex = this.sections.findIndex(s => s.element === entry.target);
                    if (sectionIndex !== -1) {
                        this.currentSection = sectionIndex;
                        this.updateActiveIndicator();
                    }
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            observer.observe(section.element);
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Only handle navigation if no input is focused
            if (document.activeElement.tagName === 'INPUT' || 
                document.activeElement.tagName === 'TEXTAREA') return;

            switch(e.key) {
                case 'ArrowDown':
                case 'PageDown':
                    e.preventDefault();
                    this.navigateToSection(this.currentSection + 1);
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.navigateToSection(this.currentSection - 1);
                    break;
                case 'Home':
                    e.preventDefault();
                    this.navigateToSection(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.navigateToSection(this.sections.length - 1);
                    break;
            }
        });
    }

    navigateToSection(index) {
        if (index < 0 || index >= this.sections.length) return;
        
        this.currentSection = index;
        const section = this.sections[index];
        
        section.element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        this.updateActiveIndicator();
        
        // Add navigation feedback
        this.showNavigationFeedback(section.title);
    }

    updateActiveIndicator() {
        const dots = document.querySelectorAll('.scroll-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSection);
        });
    }

    showNavigationFeedback(sectionTitle) {
        // Remove existing feedback
        const existing = document.querySelector('.navigation-feedback');
        if (existing) existing.remove();

        const feedback = document.createElement('div');
        feedback.className = 'navigation-feedback';
        feedback.textContent = sectionTitle;
        document.body.appendChild(feedback);

        setTimeout(() => feedback.classList.add('show'), 10);
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }
}

// Initialize section navigator
document.addEventListener('DOMContentLoaded', () => {
    new SectionNavigator();
});

// Add CSS for navigation feedback
const feedbackStyles = `
.scroll-tooltip {
    position: absolute;
    right: 25px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.scroll-dot:hover .scroll-tooltip {
    opacity: 1;
}

.navigation-feedback {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(77, 91, 249, 0.9);
    color: white;
    padding: 1rem 2rem;
    border-radius: 10px;
    font-size: 1.4rem;
    font-weight: 500;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
    backdrop-filter: blur(10px);
}

.navigation-feedback.show {
    opacity: 1;
}

@media (max-width: 768px) {
    .section-scroll-indicator {
        display: none;
    }
}
`;

const styleElement = document.createElement('style');
styleElement.textContent = feedbackStyles;
document.head.appendChild(styleElement);
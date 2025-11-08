/**
 * Advanced Interactive Features for Ultra-Modern Portfolio
 * Includes particle system, theme toggle, smooth scrolling, and modern animations
 */

class AdvancedPortfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupThemeToggle();
        this.setupParticleSystem();
        this.setupScrollProgress();
        this.setupSmoothScrolling();
        this.setupAnimationObserver();
        this.setupTypewriterEffect();
        this.setupMagneticButtons();
        this.setupFloatingActionButtons();
        this.setupAdvancedNavigation();
        this.setupSkillAnimations();
        this.setupContactForm();
    }

    // Loading Screen Animation
    setupLoadingScreen() {
        window.addEventListener('load', () => {
            const loadingScreen = document.querySelector('.loading-screen');
            if (loadingScreen) {
                setTimeout(() => {
                    loadingScreen.classList.add('fade-out');
                    setTimeout(() => {
                        loadingScreen.remove();
                    }, 500);
                }, 1500);
            }
        });
    }

    // Theme Toggle Functionality
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeToggle?.classList.add('dark');
        }

        themeToggle?.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const newTheme = isLight ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.classList.toggle('dark');
            
            // Add theme transition effect
            document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
    }

    // Advanced Particle System
    setupParticleSystem() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        document.body.appendChild(particleContainer);

        this.createParticles(particleContainer);
        
        // Interactive particles that follow mouse
        this.setupInteractiveParticles();
    }

    createParticles(container) {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            
            // Random positioning and animation delay
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
            
            // Random size variations
            const size = Math.random() * 4 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            container.appendChild(particle);
        }
    }

    setupInteractiveParticles() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: 0, y: 0 };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        // Create interactive particles
        class InteractiveParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = Math.random() * 2 - 1;
                this.vy = Math.random() * 2 - 1;
                this.radius = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const angle = Math.atan2(dy, dx);
                    const force = (100 - distance) / 100;
                    this.vx -= Math.cos(angle) * force * 0.5;
                    this.vy -= Math.sin(angle) * force * 0.5;
                }

                // Boundaries
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Friction
                this.vx *= 0.99;
                this.vy *= 0.99;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(77, 91, 249, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < 30; i++) {
            particles.push(new InteractiveParticle());
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    // Scroll Progress Indicator
    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);

        const progressBarFill = progressBar.querySelector('.scroll-progress-bar');

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBarFill.style.width = scrollPercent + '%';
        });
    }

    // Enhanced Smooth Scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Advanced Animation Observer
    setupAnimationObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Stagger animations for child elements
                    const children = entry.target.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
            observer.observe(el);
        });
    }

    // Dynamic Typewriter Effect
    setupTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('.typewriter-text');
        
        typewriterElements.forEach(element => {
            const texts = element.dataset.texts ? element.dataset.texts.split('|') : ['Web Developer', 'UI/UX Designer', 'Problem Solver'];
            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            
            const typeSpeed = 100;
            const deleteSpeed = 50;
            const pauseDelay = 2000;
            
            const type = () => {
                const currentText = texts[textIndex];
                
                if (!isDeleting) {
                    element.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;
                    
                    if (charIndex === currentText.length) {
                        setTimeout(() => {
                            isDeleting = true;
                            type();
                        }, pauseDelay);
                        return;
                    }
                } else {
                    element.textContent = currentText.substring(0, charIndex - 1);
                    charIndex--;
                    
                    if (charIndex === 0) {
                        isDeleting = false;
                        textIndex = (textIndex + 1) % texts.length;
                    }
                }
                
                setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
            };
            
            type();
        });
    }

    // Magnetic Button Effect
    setupMagneticButtons() {
        document.querySelectorAll('.magnetic').forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.15;
                const moveY = y * 0.15;
                
                button.style.setProperty('--mouse-x', moveX + 'px');
                button.style.setProperty('--mouse-y', moveY + 'px');
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.setProperty('--mouse-x', '0px');
                button.style.setProperty('--mouse-y', '0px');
            });
        });
    }

    // Floating Action Buttons
    setupFloatingActionButtons() {
        const fabContainer = document.createElement('div');
        fabContainer.className = 'fab-container';
        
        const scrollToTopFab = document.createElement('button');
        scrollToTopFab.className = 'fab primary';
        scrollToTopFab.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollToTopFab.title = 'Scroll to Top';
        
        const contactFab = document.createElement('button');
        contactFab.className = 'fab secondary';
        contactFab.innerHTML = '<i class="fas fa-envelope"></i>';
        contactFab.title = 'Contact Me';
        
        fabContainer.appendChild(scrollToTopFab);
        fabContainer.appendChild(contactFab);
        document.body.appendChild(fabContainer);
        
        // Scroll to top functionality
        scrollToTopFab.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Contact functionality
        contactFab.addEventListener('click', () => {
            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
        });
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                fabContainer.style.opacity = '1';
                fabContainer.style.transform = 'translateY(0)';
            } else {
                fabContainer.style.opacity = '0';
                fabContainer.style.transform = 'translateY(20px)';
            }
        });
    }

    // Advanced Navigation
    setupAdvancedNavigation() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.pageYOffset;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.pageYOffset;
            
            if (currentScrollY > 100) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar?.classList.add('hidden');
            } else {
                navbar?.classList.remove('hidden');
            }
            
            lastScrollY = currentScrollY;
        });
        
        // Active section highlighting
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Animated Skill Bars
    setupSkillAnimations() {
        const skillBars = document.querySelectorAll('.skill-progress .progress-bar');
        
        const animateSkillBars = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.style.width;
                    
                    progressBar.style.width = '0%';
                    setTimeout(() => {
                        progressBar.style.width = width;
                        progressBar.style.transition = 'width 1.5s ease-in-out';
                    }, 200);
                }
            });
        };
        
        const skillObserver = new IntersectionObserver(animateSkillBars, {
            threshold: 0.5
        });
        
        skillBars.forEach(bar => skillObserver.observe(bar));
    }

    // Advanced Contact Form
    setupContactForm() {
        const contactForm = document.querySelector('.contact-form');
        
        if (contactForm) {
            const inputs = contactForm.querySelectorAll('input, textarea');
            
            // Add floating label effect
            inputs.forEach(input => {
                const label = input.previousElementSibling;
                
                input.addEventListener('focus', () => {
                    label?.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label?.classList.remove('focused');
                    }
                });
                
                // Check on load
                if (input.value) {
                    label?.classList.add('focused');
                }
            });
            
            // Form submission with animation
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                    submitBtn.style.background = '#28a745';
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                        contactForm.reset();
                        
                        // Remove focused labels
                        inputs.forEach(input => {
                            const label = input.previousElementSibling;
                            label?.classList.remove('focused');
                        });
                    }, 2000);
                }, 2000);
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedPortfolio();
});

// Additional utility functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    });
}
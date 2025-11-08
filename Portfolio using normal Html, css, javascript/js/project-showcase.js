/**
 * Advanced Project Showcase with Filtering, Lightbox, and Interactive Cards
 */

class ProjectShowcase {
    constructor() {
        this.projects = [
            {
                id: 1,
                title: "AI-Powered Chat Application",
                description: "A real-time chat application built with React, Node.js, and Socket.IO featuring AI-powered responses and sentiment analysis.",
                category: "web",
                technologies: ["React", "Node.js", "Socket.IO", "MongoDB", "AI/ML"],
                image: "assets/images/Projects/project1.jpg",
                liveUrl: "https://example.com/chat-app",
                githubUrl: "https://github.com/1Rajveer-Singh/chat-app",
                featured: true
            },
            {
                id: 2,
                title: "E-Commerce Platform",
                description: "Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.",
                category: "web",
                technologies: ["MERN Stack", "Stripe", "Redux", "JWT"],
                image: "assets/images/Projects/project2.jpg",
                liveUrl: "https://example.com/ecommerce",
                githubUrl: "https://github.com/1Rajveer-Singh/ecommerce",
                featured: true
            },
            {
                id: 3,
                title: "Machine Learning Predictor",
                description: "Python-based ML model for predicting stock prices using LSTM neural networks and real-time data analysis.",
                category: "ml",
                technologies: ["Python", "TensorFlow", "Pandas", "NumPy"],
                image: "assets/images/Projects/project3.jpg",
                githubUrl: "https://github.com/1Rajveer-Singh/ml-predictor",
                featured: false
            },
            {
                id: 4,
                title: "Mobile Task Manager",
                description: "Cross-platform mobile app for task management with offline sync and collaborative features.",
                category: "mobile",
                technologies: ["React Native", "Firebase", "AsyncStorage"],
                image: "assets/images/Projects/project4.jpg",
                githubUrl: "https://github.com/1Rajveer-Singh/task-manager",
                featured: false
            }
        ];
        
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.createProjectsSection();
        this.setupFiltering();
        this.setupLightbox();
        this.setupProjectAnimations();
    }

    createProjectsSection() {
        const projectsSection = document.querySelector('#projects');
        if (!projectsSection) return;

        const projectsHTML = `
            <div class="section-header fade-in-up">
                <h2>My Projects</h2>
                <div class="underline"></div>
                <p class="section-description">Explore my latest work and creative solutions</p>
            </div>

            <div class="projects-filter fade-in-up">
                <button class="filter-btn active" data-filter="all">All Projects</button>
                <button class="filter-btn" data-filter="web">Web Development</button>
                <button class="filter-btn" data-filter="ml">Machine Learning</button>
                <button class="filter-btn" data-filter="mobile">Mobile Apps</button>
            </div>

            <div class="projects-grid">
                ${this.projects.map(project => this.createProjectCard(project)).join('')}
            </div>

            <div class="projects-cta fade-in-up">
                <p>Want to see more projects?</p>
                <a href="pages/projects.html" class="btn primary-btn magnetic hover-glow">
                    <i class="fas fa-external-link-alt"></i> View All Projects
                </a>
            </div>
        `;

        projectsSection.innerHTML = projectsHTML;
    }

    createProjectCard(project) {
        return `
            <div class="project-card card-3d scale-in" data-category="${project.category}">
                <div class="card-inner">
                    <div class="card-front">
                        <div class="project-image">
                            <img src="${project.image}" alt="${project.title}" loading="lazy">
                            <div class="project-overlay">
                                <div class="project-actions">
                                    <button class="btn-icon view-project" data-project-id="${project.id}">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    ${project.liveUrl ? `
                                        <a href="${project.liveUrl}" target="_blank" class="btn-icon">
                                            <i class="fas fa-external-link-alt"></i>
                                        </a>
                                    ` : ''}
                                    <a href="${project.githubUrl}" target="_blank" class="btn-icon">
                                        <i class="fab fa-github"></i>
                                    </a>
                                </div>
                            </div>
                            ${project.featured ? '<span class="featured-badge">Featured</span>' : ''}
                        </div>
                        <div class="project-content">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            <div class="project-tech">
                                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="card-back">
                        <div class="card-back-content">
                            <i class="fas fa-code" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                            <h3>Project Details</h3>
                            <p>Click to view more information about this project</p>
                            <button class="btn primary-btn view-details" data-project-id="${project.id}">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                this.currentFilter = filter;

                // Animate out cards
                projectCards.forEach(card => {
                    card.style.transform = 'scale(0.8)';
                    card.style.opacity = '0';
                });

                setTimeout(() => {
                    projectCards.forEach(card => {
                        if (filter === 'all' || card.dataset.category === filter) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.transform = 'scale(1)';
                                card.style.opacity = '1';
                            }, 50);
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }, 200);
            });
        });
    }

    setupLightbox() {
        // Create lightbox HTML
        const lightboxHTML = `
            <div class="lightbox-overlay" id="project-lightbox">
                <div class="lightbox-content">
                    <button class="lightbox-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="lightbox-body">
                        <div class="lightbox-image">
                            <img id="lightbox-img" src="" alt="">
                        </div>
                        <div class="lightbox-details">
                            <h2 id="lightbox-title"></h2>
                            <p id="lightbox-description"></p>
                            <div class="lightbox-tech" id="lightbox-tech"></div>
                            <div class="lightbox-actions">
                                <a id="lightbox-live" href="#" target="_blank" class="btn primary-btn" style="display: none;">
                                    <i class="fas fa-external-link-alt"></i> Live Demo
                                </a>
                                <a id="lightbox-github" href="#" target="_blank" class="btn secondary-btn">
                                    <i class="fab fa-github"></i> Source Code
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', lightboxHTML);

        // Setup lightbox events
        const lightbox = document.getElementById('project-lightbox');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        closeBtn.addEventListener('click', () => this.closeLightbox());
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) this.closeLightbox();
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                this.closeLightbox();
            }
        });

        // Setup view project buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-project') || e.target.closest('.view-details')) {
                const projectId = parseInt(e.target.closest('[data-project-id]').dataset.projectId);
                this.openLightbox(projectId);
            }
        });
    }

    openLightbox(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const lightbox = document.getElementById('project-lightbox');
        
        // Populate lightbox content
        document.getElementById('lightbox-img').src = project.image;
        document.getElementById('lightbox-title').textContent = project.title;
        document.getElementById('lightbox-description').textContent = project.description;
        
        // Technologies
        const techContainer = document.getElementById('lightbox-tech');
        techContainer.innerHTML = project.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        // Links
        const liveBtn = document.getElementById('lightbox-live');
        const githubBtn = document.getElementById('lightbox-github');
        
        if (project.liveUrl) {
            liveBtn.href = project.liveUrl;
            liveBtn.style.display = 'inline-flex';
        } else {
            liveBtn.style.display = 'none';
        }
        
        githubBtn.href = project.githubUrl;

        // Show lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        const lightbox = document.getElementById('project-lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupProjectAnimations() {
        // Hover animations for project cards
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) rotateX(5deg)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0deg)';
                card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
            });
        });

        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = `${Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1}s`;
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });

        projectCards.forEach(card => observer.observe(card));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectShowcase();
});
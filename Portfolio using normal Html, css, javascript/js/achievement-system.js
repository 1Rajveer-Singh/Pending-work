/**
 * Achievement System - Gamified User Engagement
 * Awards badges and achievements for portfolio interactions
 */

class AchievementSystem {
    constructor() {
        this.achievements = new Map();
        this.userProgress = {
            sectionsVisited: new Set(),
            projectsViewed: new Set(),
            timeSpent: 0,
            interactions: 0,
            reactionsGiven: 0,
            voiceCommands: 0,
            searchQueries: 0,
            codeRuns: 0
        };
        
        this.initAchievements();
        this.initUI();
        this.bindEvents();
        this.startTracking();
    }

    initAchievements() {
        const achievementData = [
            {
                id: 'first_visit',
                title: 'Welcome Explorer!',
                description: 'Visited the portfolio for the first time',
                icon: '👋',
                points: 10,
                condition: () => true,
                unlocked: false
            },
            {
                id: 'section_explorer',
                title: 'Section Explorer',
                description: 'Visited all main sections',
                icon: '🗺️',
                points: 25,
                condition: () => this.userProgress.sectionsVisited.size >= 5,
                unlocked: false
            },
            {
                id: 'project_enthusiast',
                title: 'Project Enthusiast',
                description: 'Viewed at least 3 projects',
                icon: '📁',
                points: 20,
                condition: () => this.userProgress.projectsViewed.size >= 3,
                unlocked: false
            },
            {
                id: 'time_traveler',
                title: 'Time Traveler',
                description: 'Spent more than 5 minutes exploring',
                icon: '⏰',
                points: 30,
                condition: () => this.userProgress.timeSpent > 300000, // 5 minutes
                unlocked: false
            },
            {
                id: 'interaction_master',
                title: 'Interaction Master',
                description: 'Made 20+ interactions',
                icon: '🎯',
                points: 35,
                condition: () => this.userProgress.interactions >= 20,
                unlocked: false
            },
            {
                id: 'voice_pioneer',
                title: 'Voice Pioneer',
                description: 'Used voice commands 5 times',
                icon: '🎤',
                points: 40,
                condition: () => this.userProgress.voiceCommands >= 5,
                unlocked: false
            },
            {
                id: 'search_detective',
                title: 'Search Detective',
                description: 'Performed 10 searches',
                icon: '🔍',
                points: 25,
                condition: () => this.userProgress.searchQueries >= 10,
                unlocked: false
            },
            {
                id: 'code_runner',
                title: 'Code Runner',
                description: 'Executed code in the playground',
                icon: '💻',
                points: 45,
                condition: () => this.userProgress.codeRuns >= 1,
                unlocked: false
            },
            {
                id: 'reaction_giver',
                title: 'Reaction Giver',
                description: 'Given 10 reactions',
                icon: '❤️',
                points: 20,
                condition: () => this.userProgress.reactionsGiven >= 10,
                unlocked: false
            },
            {
                id: 'theme_switcher',
                title: 'Theme Switcher',
                description: 'Switched between themes',
                icon: '🌓',
                points: 15,
                condition: () => this.userProgress.themeSwitches >= 1,
                unlocked: false
            },
            {
                id: 'portfolio_master',
                title: 'Portfolio Master',
                description: 'Unlocked all achievements!',
                icon: '👑',
                points: 100,
                condition: () => Array.from(this.achievements.values())
                    .filter(a => a.id !== 'portfolio_master').every(a => a.unlocked),
                unlocked: false
            }
        ];

        achievementData.forEach(achievement => {
            this.achievements.set(achievement.id, achievement);
        });
    }

    initUI() {
        const achievementHTML = `
            <div class="achievement-system">
                <button class="achievements-toggle" title="View Achievements">
                    <i class="fas fa-trophy"></i>
                    <span class="achievement-counter">0</span>
                </button>
                
                <div class="achievements-panel">
                    <div class="achievements-header">
                        <h3>🏆 Achievements</h3>
                        <div class="progress-summary">
                            <span id="unlocked-count">0</span>/<span id="total-count">${this.achievements.size}</span>
                            <div class="progress-bar">
                                <div class="progress-fill" id="progress-fill"></div>
                            </div>
                        </div>
                        <button class="achievements-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="achievements-content">
                        <div class="achievements-grid" id="achievements-grid"></div>
                        
                        <div class="user-stats">
                            <h4>📊 Your Statistics</h4>
                            <div class="stats-grid">
                                <div class="stat-card">
                                    <div class="stat-icon">🗺️</div>
                                    <div class="stat-info">
                                        <div class="stat-value" id="sections-stat">0</div>
                                        <div class="stat-label">Sections Visited</div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon">⏱️</div>
                                    <div class="stat-info">
                                        <div class="stat-value" id="time-stat">0m</div>
                                        <div class="stat-label">Time Spent</div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon">🎯</div>
                                    <div class="stat-info">
                                        <div class="stat-value" id="interactions-stat">0</div>
                                        <div class="stat-label">Interactions</div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon">🏆</div>
                                    <div class="stat-info">
                                        <div class="stat-value" id="points-stat">0</div>
                                        <div class="stat-label">Total Points</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add CSS
        const style = document.createElement('style');
        style.textContent = `
            .achievement-system { position: fixed; bottom: 140px; right: 20px; z-index: 9990; }
            .achievements-toggle { width: 60px; height: 60px; border-radius: 50%; border: none; background: linear-gradient(135deg, #f093fb, #f5576c); color: white; font-size: 20px; cursor: pointer; box-shadow: var(--shadow-lg); transition: all 0.3s ease; position: relative; }
            .achievements-toggle:hover { transform: scale(1.1); }
            .achievement-counter { position: absolute; top: -5px; right: -5px; background: #ff6b6b; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; }
            .achievements-panel { position: fixed; top: 50%; right: -400px; transform: translateY(-50%); width: 350px; height: 500px; background: var(--card-bg); border-radius: 20px; box-shadow: var(--shadow-xl); transition: all 0.4s ease; overflow: hidden; }
            .achievements-panel.open { right: 20px; }
            .achievements-header { padding: 20px; background: var(--section-bg); border-bottom: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 15px; }
            .achievements-header h3 { margin: 0; color: var(--primary-color); display: flex; align-items: center; justify-content: space-between; }
            .achievements-close { background: var(--danger-color); color: white; border: none; padding: 8px; border-radius: 50%; cursor: pointer; }
            .progress-summary { text-align: center; }
            .progress-bar { width: 100%; height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden; margin-top: 5px; }
            .progress-fill { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); transition: width 0.3s ease; }
            .achievements-content { padding: 20px; height: 400px; overflow-y: auto; }
            .achievements-grid { display: grid; gap: 15px; margin-bottom: 30px; }
            .achievement-item { display: flex; align-items: center; gap: 15px; padding: 15px; background: var(--section-bg); border-radius: 12px; border: 2px solid transparent; transition: all 0.3s ease; }
            .achievement-item.unlocked { border-color: var(--success-color); background: rgba(40, 167, 69, 0.1); }
            .achievement-icon { font-size: 24px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: var(--card-bg); border-radius: 50%; }
            .achievement-item.unlocked .achievement-icon { animation: bounce 0.6s ease; }
            .achievement-info { flex: 1; }
            .achievement-title { font-weight: 600; color: var(--text-color); margin-bottom: 5px; }
            .achievement-description { font-size: 12px; color: var(--text-muted); line-height: 1.4; }
            .achievement-points { background: var(--primary-color); color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
            .user-stats h4 { margin: 0 0 15px 0; color: var(--text-color); }
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .stat-card { display: flex; align-items: center; gap: 10px; padding: 12px; background: var(--section-bg); border-radius: 10px; }
            .stat-icon { font-size: 20px; }
            .stat-value { font-size: 16px; font-weight: 600; color: var(--primary-color); }
            .stat-label { font-size: 11px; color: var(--text-muted); }
            .achievement-unlock { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: var(--success-color); color: white; padding: 20px 30px; border-radius: 15px; box-shadow: var(--shadow-xl); z-index: 10000; opacity: 0; transform: translateX(-50%) translateY(-100px); transition: all 0.5s ease; }
            .achievement-unlock.show { opacity: 1; transform: translateX(-50%) translateY(0); }
            .unlock-content { display: flex; align-items: center; gap: 15px; }
            .unlock-icon { font-size: 30px; }
            .unlock-text h4 { margin: 0 0 5px 0; }
            .unlock-text p { margin: 0; font-size: 14px; opacity: 0.9; }
            @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }
            @media (max-width: 768px) { .achievements-panel { width: 300px; right: -320px; } .achievements-panel.open { right: 10px; } .achievement-system { bottom: 120px; right: 15px; } }
        `;
        document.head.appendChild(style);

        document.body.insertAdjacentHTML('beforeend', achievementHTML);
        this.initElements();
        this.renderAchievements();
    }

    initElements() {
        this.toggle = document.querySelector('.achievements-toggle');
        this.panel = document.querySelector('.achievements-panel');
        this.close = document.querySelector('.achievements-close');
        this.counter = document.querySelector('.achievement-counter');
        this.grid = document.getElementById('achievements-grid');
        this.unlockedCount = document.getElementById('unlocked-count');
        this.totalCount = document.getElementById('total-count');
        this.progressFill = document.getElementById('progress-fill');
        
        // Stat elements
        this.sectionsStatEl = document.getElementById('sections-stat');
        this.timeStatEl = document.getElementById('time-stat');
        this.interactionsStatEl = document.getElementById('interactions-stat');
        this.pointsStatEl = document.getElementById('points-stat');
    }

    bindEvents() {
        this.toggle.addEventListener('click', () => this.togglePanel());
        this.close.addEventListener('click', () => this.closePanel());
        
        // Track various interactions
        document.addEventListener('click', (e) => this.trackInteraction(e));
        
        // Track section visits
        if (window.IntersectionObserver) {
            const sections = document.querySelectorAll('section[id]');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.trackSectionVisit(entry.target.id);
                    }
                });
            }, { threshold: 0.5 });
            
            sections.forEach(section => observer.observe(section));
        }
        
        // Track theme switches
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.userProgress.themeSwitches = (this.userProgress.themeSwitches || 0) + 1;
                this.checkAchievements();
            });
        }
    }

    startTracking() {
        // Track time spent
        this.startTime = Date.now();
        setInterval(() => {
            this.userProgress.timeSpent = Date.now() - this.startTime;
            this.updateStats();
            this.checkAchievements();
        }, 5000);

        // Initial achievement unlock
        setTimeout(() => this.unlockAchievement('first_visit'), 2000);

        // Hook into other systems
        this.hookIntoOtherSystems();
    }

    hookIntoOtherSystems() {
        // Hook into voice commands
        if (window.voiceCommands) {
            const originalProcessCommand = window.voiceCommands.processCommand;
            window.voiceCommands.processCommand = (command) => {
                this.userProgress.voiceCommands++;
                this.trackInteraction();
                return originalProcessCommand.call(window.voiceCommands, command);
            };
        }

        // Hook into search system
        if (window.advancedSearch) {
            const originalPerformSearch = window.advancedSearch.performSearch;
            window.advancedSearch.performSearch = (query) => {
                if (query.trim()) {
                    this.userProgress.searchQueries++;
                    this.trackInteraction();
                }
                return originalPerformSearch.call(window.advancedSearch, query);
            };
        }

        // Hook into code playground
        if (window.codePlayground) {
            const originalRunCode = window.codePlayground.runCode;
            window.codePlayground.runCode = () => {
                this.userProgress.codeRuns++;
                this.trackInteraction();
                return originalRunCode.call(window.codePlayground);
            };
        }

        // Hook into collaboration system
        if (window.collaborationSystem) {
            const originalSendReaction = window.collaborationSystem.sendReaction;
            window.collaborationSystem.sendReaction = (emoji, x, y) => {
                this.userProgress.reactionsGiven++;
                this.trackInteraction();
                return originalSendReaction.call(window.collaborationSystem, emoji, x, y);
            };
        }
    }

    trackInteraction(event) {
        this.userProgress.interactions++;
        
        // Track project views
        if (event && event.target.closest('.project-card')) {
            const projectId = event.target.closest('.project-card').dataset.project || 
                            event.target.closest('.project-card').querySelector('.project-title')?.textContent;
            if (projectId) {
                this.userProgress.projectsViewed.add(projectId);
            }
        }
    }

    trackSectionVisit(sectionId) {
        this.userProgress.sectionsVisited.add(sectionId);
        this.trackInteraction();
    }

    checkAchievements() {
        this.achievements.forEach((achievement, id) => {
            if (!achievement.unlocked && achievement.condition()) {
                this.unlockAchievement(id);
            }
        });
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.get(achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.showUnlockNotification(achievement);
            this.updateUI();
            
            // Trigger confetti effect
            this.createConfetti();
        }
    }

    showUnlockNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-unlock';
        notification.innerHTML = `
            <div class="unlock-content">
                <div class="unlock-icon">${achievement.icon}</div>
                <div class="unlock-text">
                    <h4>Achievement Unlocked!</h4>
                    <p>${achievement.title}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    createConfetti() {
        // Simple confetti effect
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        
        for (let i = 0; i < 15; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                border-radius: 50%;
                pointer-events: none;
                z-index: 10001;
                animation: confettiFall ${1 + Math.random() * 2}s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }
        
        // Add confetti animation if it doesn't exist
        if (!document.querySelector('#confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes confettiFall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    togglePanel() {
        const isOpen = this.panel.classList.contains('open');
        if (isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }

    openPanel() {
        this.panel.classList.add('open');
        this.renderAchievements();
        this.updateStats();
    }

    closePanel() {
        this.panel.classList.remove('open');
    }

    renderAchievements() {
        const achievementArray = Array.from(this.achievements.values());
        
        this.grid.innerHTML = achievementArray.map(achievement => `
            <div class="achievement-item ${achievement.unlocked ? 'unlocked' : ''}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
                <div class="achievement-points">+${achievement.points}</div>
            </div>
        `).join('');
        
        this.updateUI();
    }

    updateUI() {
        const unlockedAchievements = Array.from(this.achievements.values()).filter(a => a.unlocked);
        const progress = (unlockedAchievements.length / this.achievements.size) * 100;
        
        this.counter.textContent = unlockedAchievements.length;
        this.unlockedCount.textContent = unlockedAchievements.length;
        this.totalCount.textContent = this.achievements.size;
        this.progressFill.style.width = progress + '%';
    }

    updateStats() {
        const totalPoints = Array.from(this.achievements.values())
            .filter(a => a.unlocked)
            .reduce((sum, a) => sum + a.points, 0);
        
        this.sectionsStatEl.textContent = this.userProgress.sectionsVisited.size;
        this.timeStatEl.textContent = Math.floor(this.userProgress.timeSpent / 60000) + 'm';
        this.interactionsStatEl.textContent = this.userProgress.interactions;
        this.pointsStatEl.textContent = totalPoints;
    }

    getProgress() {
        return {
            ...this.userProgress,
            unlockedAchievements: Array.from(this.achievements.values()).filter(a => a.unlocked).length,
            totalPoints: Array.from(this.achievements.values())
                .filter(a => a.unlocked)
                .reduce((sum, a) => sum + a.points, 0)
        };
    }
}

// Initialize achievement system
document.addEventListener('DOMContentLoaded', () => {
    window.achievementSystem = new AchievementSystem();
    console.log('Achievement System initialized');
});
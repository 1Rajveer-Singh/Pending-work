/**
 * Real-time Collaboration System
 * Simulates live visitor interactions and engagement
 */

class CollaborationSystem {
    constructor() {
        this.isOpen = false;
        this.visitors = new Map();
        this.activities = [];
        this.cursors = new Map();
        this.reactionCount = 0;
        this.stats = {
            totalVisitors: 0,
            activeVisitors: 0,
            totalReactions: 0,
            avgSessionTime: 0
        };
        
        this.initUI();
        this.startSimulation();
        this.bindEvents();
    }

    initUI() {
        const collaborationHTML = `
            <div class="collaboration-hub">
                <button class="collaboration-toggle">LIVE</button>
                
                <div class="collab-header">
                    <h3 class="collab-title">
                        <i class="fas fa-users"></i>
                        Live Visitors
                    </h3>
                    <div class="collab-status">
                        <span class="status-indicator"></span>
                        <span id="active-count">3 active now</span>
                    </div>
                </div>
                
                <div class="visitors-section">
                    <div class="section-title">
                        <i class="fas fa-eye"></i>
                        Currently Viewing
                    </div>
                    <div class="visitors-list" id="visitors-list"></div>
                </div>
                
                <div class="activity-section">
                    <div class="section-title">
                        <i class="fas fa-clock"></i>
                        Recent Activity
                    </div>
                    <div class="activity-feed" id="activity-feed"></div>
                </div>
                
                <div class="interaction-section">
                    <div class="section-title">
                        <i class="fas fa-heart"></i>
                        Quick Reactions
                    </div>
                    <div class="quick-reactions">
                        <button class="reaction-btn" data-reaction="👍">👍</button>
                        <button class="reaction-btn" data-reaction="❤️">❤️</button>
                        <button class="reaction-btn" data-reaction="🔥">🔥</button>
                        <button class="reaction-btn" data-reaction="👏">👏</button>
                        <button class="reaction-btn" data-reaction="😍">😍</button>
                        <button class="reaction-btn" data-reaction="🚀">🚀</button>
                        <button class="reaction-btn" data-reaction="💯">💯</button>
                        <button class="reaction-btn" data-reaction="⭐">⭐</button>
                    </div>
                    
                    <div class="collaboration-stats">
                        <div class="stat-item">
                            <span class="stat-label">Total Visitors:</span>
                            <span class="stat-value" id="total-visitors">127</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Today:</span>
                            <span class="stat-value" id="daily-visitors">23</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Reactions:</span>
                            <span class="stat-value" id="total-reactions">45</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Avg. Session:</span>
                            <span class="stat-value" id="avg-session">2m 34s</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="live-cursors"></div>
        `;

        document.body.insertAdjacentHTML('beforeend', collaborationHTML);
        this.initElements();
    }

    initElements() {
        this.hub = document.querySelector('.collaboration-hub');
        this.toggle = document.querySelector('.collaboration-toggle');
        this.visitorsList = document.getElementById('visitors-list');
        this.activityFeed = document.getElementById('activity-feed');
        this.activeCount = document.getElementById('active-count');
        this.cursorsContainer = document.querySelector('.live-cursors');
        this.reactionButtons = document.querySelectorAll('.reaction-btn');
        this.totalVisitorsEl = document.getElementById('total-visitors');
        this.dailyVisitorsEl = document.getElementById('daily-visitors');
        this.totalReactionsEl = document.getElementById('total-reactions');
        this.avgSessionEl = document.getElementById('avg-session');
    }

    bindEvents() {
        // Toggle collaboration panel
        this.toggle.addEventListener('click', () => this.toggle());

        // Reaction buttons
        this.reactionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reaction = e.target.dataset.reaction;
                this.sendReaction(reaction, e.clientX, e.clientY);
            });
        });

        // Track user interactions for collaborative features
        document.addEventListener('click', (e) => this.trackClick(e));
        document.addEventListener('scroll', () => this.trackScroll());
        
        // Simulate mouse movements from other users
        this.simulateCollaborativeCursors();
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.hub.classList.toggle('open', this.isOpen);
        
        if (this.isOpen && this.visitors.size === 0) {
            this.generateInitialVisitors();
        }
    }

    startSimulation() {
        // Generate initial visitors
        setTimeout(() => this.generateInitialVisitors(), 2000);
        
        // Periodic updates
        setInterval(() => this.updateVisitorActivity(), 5000);
        setInterval(() => this.generateRandomActivity(), 8000);
        setInterval(() => this.updateStats(), 10000);
        
        // Visitor lifecycle
        setInterval(() => this.simulateVisitorJoin(), 15000);
        setInterval(() => this.simulateVisitorLeave(), 20000);
    }

    generateInitialVisitors() {
        const names = [
            'Alex Chen', 'Sarah Kim', 'Mike Rodriguez', 'Emily Zhang', 
            'David Park', 'Jessica Liu', 'Ryan Patel', 'Maya Singh',
            'Tom Wilson', 'Lisa Johnson', 'Kevin Lee', 'Anna Martinez'
        ];
        
        const activities = [
            'viewing projects', 'reading about section', 'checking skills',
            'exploring portfolio', 'viewing contact info', 'browsing experience',
            'checking education', 'looking at achievements'
        ];

        // Add 3-5 initial visitors
        const visitorCount = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < visitorCount; i++) {
            const name = names[Math.floor(Math.random() * names.length)];
            const activity = activities[Math.floor(Math.random() * activities.length)];
            const joinTime = Date.now() - Math.random() * 300000; // Joined up to 5 minutes ago
            
            this.addVisitor(name, activity, joinTime);
        }
        
        this.updateVisitorsDisplay();
    }

    addVisitor(name, activity, joinTime = Date.now()) {
        const id = `visitor_${Date.now()}_${Math.random()}`;
        
        this.visitors.set(id, {
            name,
            activity,
            joinTime,
            lastSeen: Date.now(),
            interactions: 0
        });
        
        this.addActivity(`${name} joined and is ${activity}`);
        this.createVisitorCursor(id, name);
        this.stats.totalVisitors++;
        this.stats.activeVisitors++;
    }

    removeVisitor(visitorId) {
        const visitor = this.visitors.get(visitorId);
        if (visitor) {
            this.addActivity(`${visitor.name} left the portfolio`);
            this.visitors.delete(visitorId);
            this.removeVisitorCursor(visitorId);
            this.stats.activeVisitors--;
        }
    }

    updateVisitorActivity() {
        const activities = [
            'viewing projects', 'reading about section', 'checking skills',
            'exploring portfolio', 'viewing contact info', 'browsing experience',
            'scrolling through projects', 'reading testimonials', 'checking certifications'
        ];

        this.visitors.forEach((visitor, id) => {
            if (Math.random() < 0.4) { // 40% chance to change activity
                const newActivity = activities[Math.floor(Math.random() * activities.length)];
                visitor.activity = newActivity;
                visitor.lastSeen = Date.now();
                visitor.interactions++;
            }
        });

        this.updateVisitorsDisplay();
    }

    updateVisitorsDisplay() {
        const visitorArray = Array.from(this.visitors.values());
        
        this.visitorsList.innerHTML = visitorArray.map(visitor => {
            const timeAgo = this.getTimeAgo(visitor.lastSeen);
            const initials = visitor.name.split(' ').map(n => n[0]).join('');
            
            return `
                <div class="visitor-item">
                    <div class="visitor-avatar">${initials}</div>
                    <div class="visitor-info">
                        <div class="visitor-name">${visitor.name}</div>
                        <div class="visitor-activity">${visitor.activity} • ${timeAgo}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        this.activeCount.textContent = `${this.visitors.size} active now`;
    }

    addActivity(activity) {
        const timestamp = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        this.activities.unshift({
            text: activity,
            timestamp: Date.now(),
            display: `${timestamp} - ${activity}`
        });
        
        // Keep only last 20 activities
        if (this.activities.length > 20) {
            this.activities.pop();
        }
        
        this.updateActivityFeed();
    }

    updateActivityFeed() {
        this.activityFeed.innerHTML = this.activities.slice(0, 8).map(activity => 
            `<div class="activity-item">${activity.display}</div>`
        ).join('');
    }

    generateRandomActivity() {
        const randomEvents = [
            'Someone bookmarked this portfolio',
            'New visitor from LinkedIn',
            'Portfolio shared on social media',
            'Someone downloaded the resume',
            'New connection request received',
            'Portfolio viewed from mobile device',
            'Someone spent 5+ minutes browsing',
            'International visitor from Canada',
            'Recruiter viewed the projects section'
        ];

        if (Math.random() < 0.6) { // 60% chance
            const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
            this.addActivity(event);
        }
    }

    simulateVisitorJoin() {
        if (this.visitors.size < 6 && Math.random() < 0.7) {
            const names = [
                'James Smith', 'Maria Garcia', 'John Davis', 'Linda Brown',
                'Robert Johnson', 'Patricia Miller', 'Michael Wilson', 'Jennifer Moore'
            ];
            
            const activities = [
                'exploring projects', 'reading bio', 'checking out skills',
                'browsing portfolio', 'viewing achievements', 'looking at experience'
            ];
            
            const name = names[Math.floor(Math.random() * names.length)];
            const activity = activities[Math.floor(Math.random() * activities.length)];
            
            // Don't add if name already exists
            const existingNames = Array.from(this.visitors.values()).map(v => v.name);
            if (!existingNames.includes(name)) {
                this.addVisitor(name, activity);
                this.updateVisitorsDisplay();
            }
        }
    }

    simulateVisitorLeave() {
        if (this.visitors.size > 2 && Math.random() < 0.3) {
            const visitorIds = Array.from(this.visitors.keys());
            const randomId = visitorIds[Math.floor(Math.random() * visitorIds.length)];
            this.removeVisitor(randomId);
            this.updateVisitorsDisplay();
        }
    }

    createVisitorCursor(visitorId, name) {
        const cursor = document.createElement('div');
        cursor.className = 'live-cursor';
        cursor.id = `cursor-${visitorId}`;
        cursor.innerHTML = `<div class="cursor-label">${name}</div>`;
        
        // Random initial position
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 100);
        
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
        
        this.cursorsContainer.appendChild(cursor);
        this.cursors.set(visitorId, { element: cursor, x, y });
        
        // Start cursor movement
        this.animateVisitorCursor(visitorId);
    }

    removeVisitorCursor(visitorId) {
        const cursorData = this.cursors.get(visitorId);
        if (cursorData) {
            cursorData.element.remove();
            this.cursors.delete(visitorId);
        }
    }

    animateVisitorCursor(visitorId) {
        const cursorData = this.cursors.get(visitorId);
        if (!cursorData || !this.visitors.has(visitorId)) return;

        // Random movement
        const moveX = (Math.random() - 0.5) * 200;
        const moveY = (Math.random() - 0.5) * 200;
        
        cursorData.x = Math.max(0, Math.min(window.innerWidth - 50, cursorData.x + moveX));
        cursorData.y = Math.max(0, Math.min(window.innerHeight - 50, cursorData.y + moveY));
        
        cursorData.element.style.left = cursorData.x + 'px';
        cursorData.element.style.top = cursorData.y + 'px';
        
        // Continue animation
        setTimeout(() => this.animateVisitorCursor(visitorId), 2000 + Math.random() * 3000);
    }

    simulateCollaborativeCursors() {
        // Update cursor positions periodically
        setInterval(() => {
            this.cursors.forEach((cursorData, visitorId) => {
                if (Math.random() < 0.3) { // 30% chance to move
                    this.animateVisitorCursor(visitorId);
                }
            });
        }, 1000);
    }

    sendReaction(emoji, x, y) {
        // Create floating reaction
        const reaction = document.createElement('div');
        reaction.className = 'floating-reaction';
        reaction.textContent = emoji;
        reaction.style.left = x + 'px';
        reaction.style.top = y + 'px';
        
        document.body.appendChild(reaction);
        
        // Remove after animation
        setTimeout(() => reaction.remove(), 2000);
        
        // Update stats
        this.reactionCount++;
        this.stats.totalReactions++;
        this.updateStatsDisplay();
        
        // Add to activity feed
        this.addActivity(`Someone reacted with ${emoji}`);
        
        // Simulate other users reacting
        if (Math.random() < 0.4) {
            setTimeout(() => {
                const reactions = ['👍', '❤️', '🔥', '👏', '😍'];
                const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
                const randomX = Math.random() * window.innerWidth;
                const randomY = Math.random() * window.innerHeight;
                this.sendReaction(randomReaction, randomX, randomY);
            }, 1000 + Math.random() * 2000);
        }
    }

    trackClick(event) {
        // Track user clicks for collaborative analytics
        if (Math.random() < 0.1) { // 10% chance to show in activity
            const element = event.target.tagName.toLowerCase();
            let activity = 'Someone clicked ';
            
            if (element === 'button') activity += 'a button';
            else if (element === 'a') activity += 'a link';
            else if (event.target.closest('.project-card')) activity += 'on a project';
            else if (event.target.closest('#contact')) activity += 'on contact section';
            else activity += 'somewhere on the page';
            
            this.addActivity(activity);
        }
    }

    trackScroll() {
        // Track scrolling behavior
        if (Math.random() < 0.05) { // 5% chance
            const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent > 80) {
                this.addActivity('Someone reached the bottom of the page');
            } else if (scrollPercent > 50) {
                this.addActivity('Someone is exploring the portfolio');
            }
        }
    }

    updateStats() {
        // Simulate realistic stat updates
        this.stats.totalVisitors += Math.floor(Math.random() * 3);
        this.stats.avgSessionTime = Math.floor(Math.random() * 300) + 120; // 2-7 minutes
        
        this.updateStatsDisplay();
    }

    updateStatsDisplay() {
        this.totalVisitorsEl.textContent = this.stats.totalVisitors;
        this.dailyVisitorsEl.textContent = Math.floor(this.stats.totalVisitors * 0.3);
        this.totalReactionsEl.textContent = this.stats.totalReactions;
        
        const minutes = Math.floor(this.stats.avgSessionTime / 60);
        const seconds = this.stats.avgSessionTime % 60;
        this.avgSessionEl.textContent = `${minutes}m ${seconds}s`;
    }

    getTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    }

    getCollaborationStats() {
        return {
            activeVisitors: this.visitors.size,
            totalActivities: this.activities.length,
            totalReactions: this.reactionCount,
            isSystemActive: this.visitors.size > 0
        };
    }
}

// Initialize collaboration system
document.addEventListener('DOMContentLoaded', () => {
    window.collaborationSystem = new CollaborationSystem();
    console.log('Real-time Collaboration System initialized');
});
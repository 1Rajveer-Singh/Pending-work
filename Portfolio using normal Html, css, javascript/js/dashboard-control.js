/**
 * Smart Dashboard Control Center
 * Central command center for all portfolio systems
 */

class DashboardControl {
    constructor() {
        this.isOpen = false;
        this.systems = new Map();
        this.metrics = {
            performance: 0,
            engagement: 0,
            interactions: 0,
            uptime: Date.now()
        };
        this.analyticsIntegration = null;
        this.logs = [];
        this.notifications = 0;
        
        this.initUI();
        this.initSystems();
        this.bindEvents();
        this.startMonitoring();
    }

    initUI() {
        const dashboardHTML = `
            <div class="dashboard-control-center">
                <button class="dashboard-toggle" title="Control Center (Ctrl+D)">
                    <i class="fas fa-tachometer-alt"></i>
                    <span class="notification-badge" style="display: none;">0</span>
                </button>
                
                <div class="dashboard-panel">
                    <div class="dashboard-header">
                        <h3 class="dashboard-title">
                            <i class="fas fa-tachometer-alt"></i>
                            Control Center
                        </h3>
                        <button class="dashboard-close">
                            <i class="fas fa-times"></i>
                        </button>
                        
                        <div class="system-status">
                            <div class="status-indicator" id="system-status">
                                <span>All Systems</span>
                                <span>🟢 Operational</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dashboard-content">
                        <!-- Performance Metrics -->
                        <div class="control-section">
                            <div class="section-title">
                                <i class="fas fa-chart-line"></i>
                                Performance Metrics
                            </div>
                            <div class="metrics-section">
                                <div class="performance-gauge">
                                    <svg width="80" height="40" viewBox="0 0 80 40">
                                        <path class="gauge-arc" d="M 10 30 A 20 20 0 0 1 70 30"></path>
                                        <path class="gauge-progress" id="performance-arc" d="M 10 30 A 20 20 0 0 1 70 30"></path>
                                    </svg>
                                    <div class="gauge-text" id="performance-score">0</div>
                                </div>
                                <div class="metrics-grid">
                                    <div class="metric-item">
                                        <div class="metric-value" id="load-time">0ms</div>
                                        <div class="metric-label">Load Time</div>
                                    </div>
                                    <div class="metric-item">
                                        <div class="metric-value" id="interactions">0</div>
                                        <div class="metric-label">Interactions</div>
                                    </div>
                                    <div class="metric-item">
                                        <div class="metric-value" id="active-systems">0</div>
                                        <div class="metric-label">Active Systems</div>
                                    </div>
                                    <div class="metric-item">
                                        <div class="metric-value" id="uptime">0s</div>
                                        <div class="metric-label">Uptime</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- System Controls -->
                        <div class="control-section">
                            <div class="section-title">
                                <i class="fas fa-cogs"></i>
                                System Controls
                            </div>
                            <div class="control-grid" id="system-controls"></div>
                        </div>
                        
                        <!-- Quick Actions -->
                        <div class="control-section">
                            <div class="section-title">
                                <i class="fas fa-bolt"></i>
                                Quick Actions
                            </div>
                            <div class="quick-actions">
                                <button class="action-btn" id="reset-analytics">
                                    <i class="fas fa-chart-bar"></i><br>Reset Analytics
                                </button>
                                <button class="action-btn" id="clear-cache">
                                    <i class="fas fa-broom"></i><br>Clear Cache
                                </button>
                                <button class="action-btn" id="performance-boost">
                                    <i class="fas fa-rocket"></i><br>Boost Mode
                                </button>
                                <button class="action-btn" id="export-data">
                                    <i class="fas fa-download"></i><br>Export Data
                                </button>
                            </div>
                        </div>
                        
                        <!-- Theme Controls -->
                        <div class="control-section">
                            <div class="section-title">
                                <i class="fas fa-palette"></i>
                                Appearance
                            </div>
                            <div class="theme-controls">
                                <div class="theme-option theme-light" data-theme="light" title="Light Theme"></div>
                                <div class="theme-option theme-dark" data-theme="dark" title="Dark Theme"></div>
                                <div class="theme-option theme-auto active" data-theme="auto" title="Auto Theme"></div>
                            </div>
                        </div>
                        
                        <!-- System Logs -->
                        <div class="control-section">
                            <div class="section-title">
                                <i class="fas fa-terminal"></i>
                                System Logs
                            </div>
                            <div class="system-logs" id="system-logs"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dashboardHTML);
        this.initElements();
    }

    initElements() {
        this.toggle = document.querySelector('.dashboard-toggle');
        this.panel = document.querySelector('.dashboard-panel');
        this.closeBtn = document.querySelector('.dashboard-close');
        this.notificationBadge = document.querySelector('.notification-badge');
        this.systemStatus = document.getElementById('system-status');
        this.controlsGrid = document.getElementById('system-controls');
        this.logsContainer = document.getElementById('system-logs');
        
        // Metrics elements
        this.performanceScore = document.getElementById('performance-score');
        this.performanceArc = document.getElementById('performance-arc');
        this.loadTimeEl = document.getElementById('load-time');
        this.interactionsEl = document.getElementById('interactions');
        this.activeSystemsEl = document.getElementById('active-systems');
        this.uptimeEl = document.getElementById('uptime');
    }

    initSystems() {
        // Register all portfolio systems
        this.registerSystem('voiceCommands', {
            name: 'Voice Commands',
            icon: 'fas fa-microphone',
            description: 'Natural language voice control',
            active: !!window.voiceCommands,
            toggle: () => this.toggleSystem('voiceCommands'),
            status: () => window.voiceCommands?.isListening ? 'Listening' : 'Ready'
        });

        this.registerSystem('advancedSearch', {
            name: 'Smart Search',
            icon: 'fas fa-search',
            description: 'Intelligent content discovery',
            active: !!window.advancedSearch,
            toggle: () => this.toggleSystem('advancedSearch'),
            status: () => window.advancedSearch?.isOpen ? 'Open' : 'Ready'
        });

        this.registerSystem('codePlayground', {
            name: 'Code Playground',
            icon: 'fas fa-code',
            description: 'Interactive coding environment',
            active: !!window.codePlayground,
            toggle: () => this.toggleSystem('codePlayground'),
            status: () => window.codePlayground?.isOpen ? 'Active' : 'Ready'
        });

        this.registerSystem('performanceAnalytics', {
            name: 'Performance Analytics',
            icon: 'fas fa-chart-line',
            description: 'Real-time insights and metrics',
            active: !!window.performanceAnalytics,
            toggle: () => this.toggleSystem('performanceAnalytics'),
            status: () => window.performanceAnalytics?.isActive ? 'Monitoring' : 'Ready'
        });

        this.registerSystem('aiCodeReview', {
            name: 'AI Code Review',
            icon: 'fas fa-brain',
            description: 'Intelligent code analysis',
            active: !!window.aiCodeReview,
            toggle: () => this.toggleSystem('aiCodeReview'),
            status: () => window.aiCodeReview?.isActive ? 'Analyzing' : 'Ready'
        });

        this.registerSystem('aiChat', {
            name: 'AI Assistant',
            icon: 'fas fa-robot',
            description: 'Intelligent chat support',
            active: !!window.aiChatAssistant,
            toggle: () => this.toggleSystem('aiChat'),
            status: () => window.aiChatAssistant?.isOpen ? 'Chatting' : 'Ready'
        });

        this.registerSystem('collaboration', {
            name: 'Live Collaboration',
            icon: 'fas fa-users',
            description: 'Real-time visitor interaction',
            active: !!window.collaborationSystem,
            toggle: () => this.toggleSystem('collaboration'),
            status: () => window.collaborationSystem?.isOpen ? 'Live' : 'Active'
        });

        this.registerSystem('achievements', {
            name: 'Achievement System',
            icon: 'fas fa-trophy',
            description: 'Gamified user engagement',
            active: !!window.achievementSystem,
            toggle: () => this.toggleSystem('achievements'),
            status: () => {
                const unlocked = window.achievementSystem?.getProgress()?.unlockedAchievements || 0;
                return `${unlocked} Unlocked`;
            }
        });

        this.registerSystem('analytics', {
            name: 'Advanced Analytics',
            icon: 'fas fa-chart-bar',
            description: 'User behavior tracking',
            active: !!window.advancedAnalytics,
            toggle: () => this.toggleSystem('analytics'),
            status: () => 'Tracking'
        });

        this.registerSystem('particles', {
            name: 'Particle System',
            icon: 'fas fa-sparkles',
            description: 'Dynamic background effects',
            active: true,
            toggle: () => this.toggleSystem('particles'),
            status: () => 'Animating'
        });

        this.renderSystemControls();
    }

    registerSystem(id, config) {
        this.systems.set(id, config);
        this.log('info', `System registered: ${config.name}`);
    }

    renderSystemControls() {
        this.controlsGrid.innerHTML = Array.from(this.systems.entries()).map(([id, system]) => `
            <div class="control-card ${system.active ? 'active' : ''}" data-system="${id}">
                <div class="card-header">
                    <div class="card-title">
                        <i class="${system.icon}"></i>
                        ${system.name}
                    </div>
                    <div class="card-toggle ${system.active ? 'active' : ''}" data-system="${id}"></div>
                </div>
                <div class="card-description">${system.description}</div>
                <div class="card-status" id="status-${id}">${system.status ? system.status() : 'Ready'}</div>
            </div>
        `).join('');
    }

    bindEvents() {
        // Toggle dashboard
        this.toggle.addEventListener('click', () => this.toggleDashboard());
        this.closeBtn.addEventListener('click', () => this.closeDashboard());

        // System toggles
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('card-toggle')) {
                const systemId = e.target.dataset.system;
                const system = this.systems.get(systemId);
                if (system && system.toggle) {
                    system.toggle();
                }
            }
        });

        // Quick actions
        document.getElementById('reset-analytics')?.addEventListener('click', () => {
            this.resetAnalytics();
        });

        document.getElementById('clear-cache')?.addEventListener('click', () => {
            this.clearCache();
        });

        document.getElementById('performance-boost')?.addEventListener('click', () => {
            this.performanceBoost();
        });

        document.getElementById('export-data')?.addEventListener('click', () => {
            this.exportData();
        });

        // Theme controls
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.setTheme(theme);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                this.toggleDashboard();
            }
            if (e.key === 'Escape' && this.isOpen) {
                this.closeDashboard();
            }
        });

        // Close on outside click
        this.panel.addEventListener('click', (e) => e.stopPropagation());
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.toggle.contains(e.target)) {
                this.closeDashboard();
            }
        });
    }

    startMonitoring() {
        // Update metrics every 2 seconds
        setInterval(() => {
            this.updateMetrics();
            this.updateSystemStatus();
        }, 2000);

        // Performance monitoring
        this.monitorPerformance();

        // Log initial status
        this.log('success', 'Dashboard Control Center initialized');
        this.log('info', `${this.systems.size} systems registered`);
    }

    toggleDashboard() {
        if (this.isOpen) {
            this.closeDashboard();
        } else {
            this.openDashboard();
        }
    }

    openDashboard() {
        this.isOpen = true;
        this.panel.classList.add('open');
        this.updateMetrics();
        this.updateSystemStatus();
        this.log('info', 'Dashboard opened');
    }

    closeDashboard() {
        this.isOpen = false;
        this.panel.classList.remove('open');
    }

    toggleSystem(systemId) {
        const system = this.systems.get(systemId);
        if (!system) return;

        const newState = !system.active;
        system.active = newState;

        // Apply system-specific logic
        switch (systemId) {
            case 'particles':
                this.toggleParticles(newState);
                break;
            case 'voiceCommands':
                if (window.voiceCommands) {
                    newState ? window.voiceCommands.enable() : window.voiceCommands.disable();
                }
                break;
            case 'advancedSearch':
                if (window.advancedSearch && !newState) {
                    window.advancedSearch.close();
                }
                break;
            case 'performanceAnalytics':
                if (window.performanceAnalytics) {
                    newState ? window.performanceAnalytics.show() : window.performanceAnalytics.hide();
                }
                break;
            case 'aiCodeReview':
                if (window.aiCodeReview) {
                    newState ? window.aiCodeReview.show() : window.aiCodeReview.hide();
                }
                break;
            case 'aiChat':
                if (window.aiChatAssistant && !newState) {
                    window.aiChatAssistant.close();
                }
                break;
        }

        this.renderSystemControls();
        this.log(newState ? 'success' : 'warning', 
                `${system.name} ${newState ? 'enabled' : 'disabled'}`);
        
        this.addNotification();
    }

    toggleParticles(enabled) {
        const particleCanvas = document.querySelector('#particle-canvas');
        if (particleCanvas) {
            particleCanvas.style.display = enabled ? 'block' : 'none';
        }
    }

    updateMetrics() {
        // Calculate performance score
        const loadTime = performance.now();
        const interactionCount = this.getInteractionCount();
        const activeSystems = Array.from(this.systems.values()).filter(s => s.active).length;
        const uptime = Math.floor((Date.now() - this.metrics.uptime) / 1000);

        // Update performance score (0-100)
        const performanceScore = Math.min(100, Math.max(0, 
            100 - (loadTime / 50) + (interactionCount / 10) + (activeSystems * 5)
        ));

        this.metrics.performance = Math.round(performanceScore);
        this.metrics.interactions = interactionCount;

        // Update UI
        this.performanceScore.textContent = this.metrics.performance;
        this.loadTimeEl.textContent = Math.round(loadTime) + 'ms';
        this.interactionsEl.textContent = interactionCount;
        this.activeSystemsEl.textContent = activeSystems;
        this.uptimeEl.textContent = this.formatUptime(uptime);

        // Update performance arc
        const circumference = 62.83; // 2 * π * r (r=10)
        const offset = circumference - (performanceScore / 100) * circumference;
        this.performanceArc.style.strokeDasharray = circumference;
        this.performanceArc.style.strokeDashoffset = offset;

        // Change color based on performance
        if (performanceScore >= 80) {
            this.performanceArc.style.stroke = '#28a745';
        } else if (performanceScore >= 60) {
            this.performanceArc.style.stroke = '#ffc107';
        } else {
            this.performanceArc.style.stroke = '#dc3545';
        }
    }

    updateSystemStatus() {
        const activeSystems = Array.from(this.systems.values()).filter(s => s.active).length;
        const totalSystems = this.systems.size;
        
        let statusText = '🟢 All Operational';
        let statusClass = '';

        if (activeSystems === 0) {
            statusText = '🔴 Systems Offline';
            statusClass = 'error';
        } else if (activeSystems < totalSystems * 0.5) {
            statusText = '🟡 Partial Operation';
            statusClass = 'warning';
        }

        this.systemStatus.innerHTML = `
            <span>Systems (${activeSystems}/${totalSystems})</span>
            <span>${statusText}</span>
        `;
        this.systemStatus.className = `status-indicator ${statusClass}`;

        // Update individual system status
        this.systems.forEach((system, id) => {
            const statusEl = document.getElementById(`status-${id}`);
            if (statusEl && system.status) {
                statusEl.textContent = system.status();
            }
        });
    }

    getInteractionCount() {
        let count = 0;
        
        // Aggregate interaction counts from all systems
        if (window.achievementSystem) {
            count += window.achievementSystem.getProgress().interactions || 0;
        }
        
        if (window.performanceAnalytics) {
            count += window.performanceAnalytics.getSummary().interactions || 0;
        }

        return count;
    }

    resetAnalytics() {
        if (window.advancedAnalytics) {
            window.advancedAnalytics.reset();
            this.log('info', 'Analytics data reset');
        }
        this.showActionFeedback('Analytics Reset');
    }

    clearCache() {
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => caches.delete(name));
            });
        }
        localStorage.clear();
        sessionStorage.clear();
        this.log('info', 'Cache cleared');
        this.showActionFeedback('Cache Cleared');
    }

    performanceBoost() {
        // Disable heavy animations temporarily
        document.body.style.setProperty('--animation-duration', '0.1s');
        
        setTimeout(() => {
            document.body.style.removeProperty('--animation-duration');
            this.log('info', 'Performance boost deactivated');
        }, 30000);
        
        this.log('success', 'Performance boost activated for 30s');
        this.showActionFeedback('Performance Boosted');
    }

    exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            systems: Object.fromEntries(this.systems),
            logs: this.logs.slice(-50),
            achievements: window.achievementSystem?.getProgress(),
            analytics: window.advancedAnalytics?.getStats()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.log('info', 'Data exported successfully');
        this.showActionFeedback('Data Exported');
    }

    setTheme(theme) {
        document.querySelectorAll('.theme-option').forEach(opt => {
            opt.classList.remove('active');
        });
        document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
        
        // Apply theme
        if (theme === 'auto') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        
        this.log('info', `Theme changed to ${theme}`);
    }

    monitorPerformance() {
        if ('performance' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'navigation') {
                        this.log('info', `Page load: ${Math.round(entry.loadEventEnd)}ms`);
                    }
                }
            });
            observer.observe({ entryTypes: ['navigation'] });
        }
    }

    log(level, message) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = { timestamp, level, message };
        
        this.logs.unshift(logEntry);
        if (this.logs.length > 100) {
            this.logs.pop();
        }
        
        this.updateLogsDisplay();
        
        if (level === 'error') {
            this.addNotification();
        }
    }

    updateLogsDisplay() {
        if (this.logsContainer) {
            this.logsContainer.innerHTML = this.logs.slice(0, 20).map(log => `
                <div class="log-entry">
                    <span class="log-timestamp">${log.timestamp}</span>
                    <span class="log-level ${log.level}">[${log.level.toUpperCase()}]</span>
                    <span class="log-message">${log.message}</span>
                </div>
            `).join('');
            
            this.logsContainer.scrollTop = 0;
        }
    }

    addNotification() {
        this.notifications++;
        this.notificationBadge.textContent = this.notifications;
        this.notificationBadge.style.display = 'flex';
        
        if (this.isOpen) {
            setTimeout(() => {
                this.notifications = 0;
                this.notificationBadge.style.display = 'none';
            }, 1000);
        }
    }

    showActionFeedback(action) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--success-color);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: 600;
            z-index: 10001;
            box-shadow: var(--shadow-lg);
            animation: slideInDown 0.3s ease;
        `;
        feedback.textContent = action;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.style.animation = 'slideOutUp 0.3s ease forwards';
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }

    formatUptime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) return `${hours}h ${minutes}m`;
        if (minutes > 0) return `${minutes}m ${secs}s`;
        return `${secs}s`;
    }

    getDashboardStats() {
        return {
            isOpen: this.isOpen,
            activeSystems: Array.from(this.systems.values()).filter(s => s.active).length,
            totalSystems: this.systems.size,
            metrics: this.metrics,
            notifications: this.notifications,
            logsCount: this.logs.length
        };
    }
}

// Initialize dashboard control
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardControl = new DashboardControl();
    console.log('Smart Dashboard Control Center initialized');
});
/**
 * Performance Dashboard - Real-time monitoring and analytics
 */

class PerformanceDashboard {
    constructor() {
        this.metrics = {
            pageLoadTime: 0,
            fcp: 0,
            interactions: 0,
            scrollDepth: 0,
            timeOnPage: Date.now(),
            deviceInfo: this.getDeviceInfo()
        };
        
        this.init();
    }

    init() {
        this.measurePerformance();
        this.trackUserInteractions();
        this.trackScrollDepth();
        this.createDashboard();
    }

    measurePerformance() {
        // Measure page load time
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                this.metrics.pageLoadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                // Measure First Contentful Paint
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.name === 'first-contentful-paint') {
                            this.metrics.fcp = entry.startTime;
                        }
                    }
                });
                observer.observe({entryTypes: ['paint']});
                
                this.updateDashboard();
            }
        });
    }

    trackUserInteractions() {
        let interactionCount = 0;
        
        ['click', 'keydown', 'scroll', 'touchstart'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                interactionCount++;
                this.metrics.interactions = interactionCount;
                this.updateDashboard();
            });
        });
    }

    trackScrollDepth() {
        let maxScrollDepth = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (scrollTop / documentHeight) * 100;
            
            if (scrollPercentage > maxScrollDepth) {
                maxScrollDepth = scrollPercentage;
                this.metrics.scrollDepth = Math.round(scrollPercentage);
                this.updateDashboard();
            }
        });
    }

    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            screenWidth: screen.width,
            screenHeight: screen.height,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink
            } : null,
            memory: navigator.deviceMemory || 'unknown'
        };
    }

    createDashboard() {
        // Only show in development or when ?debug=true
        const isDebug = location.search.includes('debug=true') || location.hostname === 'localhost';
        if (!isDebug) return;

        const dashboard = document.createElement('div');
        dashboard.id = 'performance-dashboard';
        dashboard.innerHTML = `
            <div class="dashboard-header">
                <h3>Performance Dashboard</h3>
                <button class="dashboard-toggle">
                    <i class="fas fa-chart-bar"></i>
                </button>
            </div>
            <div class="dashboard-content">
                <div class="metric">
                    <span class="metric-label">Page Load:</span>
                    <span class="metric-value" id="page-load">-</span>
                </div>
                <div class="metric">
                    <span class="metric-label">FCP:</span>
                    <span class="metric-value" id="fcp">-</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Interactions:</span>
                    <span class="metric-value" id="interactions">0</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Scroll Depth:</span>
                    <span class="metric-value" id="scroll-depth">0%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Time on Page:</span>
                    <span class="metric-value" id="time-on-page">0s</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Screen:</span>
                    <span class="metric-value">${this.metrics.deviceInfo.screenWidth}x${this.metrics.deviceInfo.screenHeight}</span>
                </div>
                ${this.metrics.deviceInfo.connection ? `
                <div class="metric">
                    <span class="metric-label">Connection:</span>
                    <span class="metric-value">${this.metrics.deviceInfo.connection.effectiveType}</span>
                </div>
                ` : ''}
            </div>
        `;

        document.body.appendChild(dashboard);

        // Dashboard toggle functionality
        const toggle = dashboard.querySelector('.dashboard-toggle');
        const content = dashboard.querySelector('.dashboard-content');
        
        toggle.addEventListener('click', () => {
            content.classList.toggle('collapsed');
        });

        // Update time on page every second
        setInterval(() => {
            const timeOnPage = Math.round((Date.now() - this.metrics.timeOnPage) / 1000);
            document.getElementById('time-on-page').textContent = `${timeOnPage}s`;
        }, 1000);

        this.updateDashboard();
    }

    updateDashboard() {
        if (!document.getElementById('performance-dashboard')) return;

        const elements = {
            'page-load': this.metrics.pageLoadTime ? `${Math.round(this.metrics.pageLoadTime)}ms` : '-',
            'fcp': this.metrics.fcp ? `${Math.round(this.metrics.fcp)}ms` : '-',
            'interactions': this.metrics.interactions,
            'scroll-depth': `${this.metrics.scrollDepth}%`
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    exportMetrics() {
        const exportData = {
            ...this.metrics,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-metrics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize performance dashboard
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceDashboard();
});

// Add CSS for performance dashboard
const dashboardStyles = `
#performance-dashboard {
    position: fixed;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 10px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    z-index: 10000;
    min-width: 200px;
    backdrop-filter: blur(10px);
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 5px;
}

.dashboard-header h3 {
    margin: 0;
    font-size: 14px;
    color: #4d5bf9;
}

.dashboard-toggle {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 2px;
}

.dashboard-content {
    transition: all 0.3s ease;
}

.dashboard-content.collapsed {
    height: 0;
    overflow: hidden;
}

.metric {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
}

.metric-label {
    color: #ccc;
}

.metric-value {
    color: #4d5bf9;
    font-weight: bold;
}

@media (max-width: 768px) {
    #performance-dashboard {
        display: none;
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = dashboardStyles;
document.head.appendChild(styleSheet);
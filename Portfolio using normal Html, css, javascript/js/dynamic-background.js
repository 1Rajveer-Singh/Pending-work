/**
 * Dynamic Background Pattern Generator
 */

class DynamicBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.patterns = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.createCanvas();
        this.setupPatterns();
        this.setupInteractions();
        this.animate();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'dynamic-background';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-10';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = '0.1';
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        document.body.appendChild(this.canvas);
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupPatterns() {
        const patternCount = 15;
        
        for (let i = 0; i < patternCount; i++) {
            this.patterns.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 100 + 50,
                speed: Math.random() * 0.5 + 0.1,
                angle: Math.random() * Math.PI * 2,
                rotation: Math.random() * 0.02 + 0.005,
                opacity: Math.random() * 0.3 + 0.1,
                type: Math.floor(Math.random() * 3) // 0: circle, 1: triangle, 2: square
            });
        }
    }

    setupInteractions() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Change patterns based on theme
        document.addEventListener('themechange', () => {
            this.updatePatternColors();
        });
    }

    drawPattern(pattern) {
        this.ctx.save();
        this.ctx.translate(pattern.x, pattern.y);
        this.ctx.rotate(pattern.angle);
        this.ctx.globalAlpha = pattern.opacity;
        
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, pattern.size);
        gradient.addColorStop(0, 'rgba(77, 91, 249, 0.3)');
        gradient.addColorStop(1, 'rgba(77, 91, 249, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.strokeStyle = 'rgba(77, 91, 249, 0.2)';
        this.ctx.lineWidth = 2;
        
        switch(pattern.type) {
            case 0: // Circle
                this.ctx.beginPath();
                this.ctx.arc(0, 0, pattern.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
                break;
                
            case 1: // Triangle
                this.ctx.beginPath();
                this.ctx.moveTo(0, -pattern.size / 2);
                this.ctx.lineTo(-pattern.size / 2, pattern.size / 2);
                this.ctx.lineTo(pattern.size / 2, pattern.size / 2);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
                break;
                
            case 2: // Square
                this.ctx.fillRect(-pattern.size / 2, -pattern.size / 2, pattern.size, pattern.size);
                this.ctx.strokeRect(-pattern.size / 2, -pattern.size / 2, pattern.size, pattern.size);
                break;
        }
        
        this.ctx.restore();
    }

    updatePatterns() {
        this.patterns.forEach(pattern => {
            // Mouse interaction
            const dx = this.mouse.x - pattern.x;
            const dy = this.mouse.y - pattern.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                pattern.x -= dx * force * 0.01;
                pattern.y -= dy * force * 0.01;
            }
            
            // Normal movement
            pattern.x += Math.cos(pattern.angle) * pattern.speed;
            pattern.y += Math.sin(pattern.angle) * pattern.speed;
            pattern.angle += pattern.rotation;
            
            // Wrap around screen
            if (pattern.x > this.canvas.width + pattern.size) pattern.x = -pattern.size;
            if (pattern.x < -pattern.size) pattern.x = this.canvas.width + pattern.size;
            if (pattern.y > this.canvas.height + pattern.size) pattern.y = -pattern.size;
            if (pattern.y < -pattern.size) pattern.y = this.canvas.height + pattern.size;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updatePatterns();
        this.patterns.forEach(pattern => this.drawPattern(pattern));
        
        requestAnimationFrame(() => this.animate());
    }

    updatePatternColors() {
        // This could be enhanced to change colors based on theme
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        this.canvas.style.opacity = isDark ? '0.05' : '0.1';
    }
}

// Initialize dynamic background
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 768) { // Only on desktop for performance
        new DynamicBackground();
    }
});
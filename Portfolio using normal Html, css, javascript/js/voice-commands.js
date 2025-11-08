/**
 * Voice Command System for Portfolio
 * Provides hands-free navigation and interaction
 */

class VoiceCommandSystem {
    constructor() {
        this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        this.isListening = false;
        this.isEnabled = true;
        this.recognition = null;
        this.commands = new Map();
        this.lastCommand = '';
        this.commandHistory = [];
        
        if (this.isSupported) {
            this.initRecognition();
            this.initUI();
            this.registerCommands();
            this.bindEvents();
        }
    }

    initRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI('listening');
            console.log('Voice recognition started');
        };

        this.recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase().trim();
            this.processCommand(command);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.showFeedback(`Voice Error: ${event.error}`, 'error');
            this.stopListening();
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUI('idle');
        };
    }

    initUI() {
        // Create voice command widget
        const widget = document.createElement('div');
        widget.className = 'voice-command-widget';
        widget.innerHTML = `
            <button class="voice-mic-button" title="Click or say 'Hey Portfolio' to start">
                <i class="fas fa-microphone"></i>
            </button>
            <div class="voice-status">
                <p class="voice-status-text">Voice Commands Ready</p>
                <p class="voice-command-text">Say "Hey Portfolio" or click mic</p>
            </div>
        `;

        // Create help modal
        const helpModal = document.createElement('div');
        helpModal.className = 'voice-commands-help';
        helpModal.innerHTML = `
            <h3><i class="fas fa-microphone"></i> Voice Commands</h3>
            <div class="voice-command-list">
                <div class="voice-command-item">
                    <span class="command-phrase">"Go to projects" / "Show projects"</span>
                    <span class="command-description">Navigate to projects section</span>
                </div>
                <div class="voice-command-item">
                    <span class="command-phrase">"Go to skills" / "Show skills"</span>
                    <span class="command-description">Navigate to skills section</span>
                </div>
                <div class="voice-command-item">
                    <span class="command-phrase">"Contact me" / "Go to contact"</span>
                    <span class="command-description">Navigate to contact section</span>
                </div>
                <div class="voice-command-item">
                    <span class="command-phrase">"Toggle theme" / "Switch theme"</span>
                    <span class="command-description">Switch between light/dark mode</span>
                </div>
                <div class="voice-command-item">
                    <span class="command-phrase">"Open chat" / "Start chat"</span>
                    <span class="command-description">Open AI chat assistant</span>
                </div>
                <div class="voice-command-item">
                    <span class="command-phrase">"Go to top" / "Scroll up"</span>
                    <span class="command-description">Scroll to top of page</span>
                </div>
                <div class="voice-command-item">
                    <span class="command-phrase">"Help" / "Show commands"</span>
                    <span class="command-description">Show this help dialog</span>
                </div>
                <div class="voice-command-item">
                    <span class="command-phrase">"Close" / "Stop listening"</span>
                    <span class="command-description">Stop voice recognition</span>
                </div>
            </div>
        `;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'voice-overlay';

        document.body.appendChild(widget);
        document.body.appendChild(helpModal);
        document.body.appendChild(overlay);

        this.widget = widget;
        this.helpModal = helpModal;
        this.overlay = overlay;
        this.micButton = widget.querySelector('.voice-mic-button');
        this.statusText = widget.querySelector('.voice-status-text');
        this.commandText = widget.querySelector('.voice-command-text');

        // Show widget after a delay
        setTimeout(() => {
            this.widget.classList.add('active');
        }, 2000);
    }

    registerCommands() {
        // Navigation commands
        this.commands.set(/go to (home|top)|scroll up|go up/i, () => {
            document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' });
            this.showFeedback('Navigating to top');
        });

        this.commands.set(/go to (projects|work)|show projects|view projects/i, () => {
            document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
            this.showFeedback('Showing projects');
        });

        this.commands.set(/go to (skills|abilities)|show skills|view skills/i, () => {
            document.querySelector('#skills')?.scrollIntoView({ behavior: 'smooth' });
            this.showFeedback('Showing skills');
        });

        this.commands.set(/go to (contact|reach)|contact me|get in touch/i, () => {
            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            this.showFeedback('Opening contact section');
        });

        this.commands.set(/go to (about|bio)|about me|tell me about/i, () => {
            document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
            this.showFeedback('Showing about section');
        });

        this.commands.set(/go to (education|study)|show education/i, () => {
            document.querySelector('#education')?.scrollIntoView({ behavior: 'smooth' });
            this.showFeedback('Showing education');
        });

        // Theme commands
        this.commands.set(/(toggle|switch|change) theme|dark mode|light mode/i, () => {
            const themeToggle = document.querySelector('.theme-toggle');
            if (themeToggle) {
                themeToggle.click();
                this.showFeedback('Theme toggled');
            }
        });

        // Chat commands
        this.commands.set(/(open|start|show) chat|chat with me|talk to me/i, () => {
            const chatWidget = document.querySelector('.ai-chat-widget');
            if (chatWidget && !chatWidget.classList.contains('open')) {
                chatWidget.querySelector('.chat-toggle')?.click();
                this.showFeedback('Opening chat assistant');
            }
        });

        // Project filtering
        this.commands.set(/show (web|website) projects|filter web/i, () => {
            const webFilter = document.querySelector('[data-filter="web"]');
            if (webFilter) {
                webFilter.click();
                this.showFeedback('Showing web projects');
            }
        });

        this.commands.set(/show (app|mobile|application) projects|filter app/i, () => {
            const appFilter = document.querySelector('[data-filter="app"]');
            if (appFilter) {
                appFilter.click();
                this.showFeedback('Showing app projects');
            }
        });

        this.commands.set(/show all projects|filter all|reset filter/i, () => {
            const allFilter = document.querySelector('[data-filter="all"]');
            if (allFilter) {
                allFilter.click();
                this.showFeedback('Showing all projects');
            }
        });

        // Help commands
        this.commands.set(/help|show commands|what can (you|i) do|voice help/i, () => {
            this.showHelp();
        });

        // Control commands
        this.commands.set(/(stop|close|quiet|end) (listening|voice)|stop/i, () => {
            this.showFeedback('Voice commands stopped');
            this.disable();
        });

        this.commands.set(/(restart|resume|continue) (listening|voice)/i, () => {
            this.enable();
            this.showFeedback('Voice commands resumed');
        });

        // Performance commands
        this.commands.set(/show (performance|stats|metrics)/i, () => {
            const performanceDashboard = document.querySelector('.performance-dashboard');
            if (performanceDashboard) {
                performanceDashboard.style.display = 'block';
                this.showFeedback('Showing performance dashboard');
            }
        });

        // Fun commands
        this.commands.set(/(hey|hi|hello) portfolio|greetings|good (morning|afternoon|evening)/i, () => {
            const greetings = [
                'Hello! Welcome to Rajveer\'s portfolio!',
                'Hi there! How can I help you explore?',
                'Greetings! Ready to discover amazing projects?',
                'Hello! Voice commands are ready to assist you!'
            ];
            this.showFeedback(greetings[Math.floor(Math.random() * greetings.length)]);
        });

        this.commands.set(/(surprise|random|show me something) (me|cool|interesting)/i, () => {
            const actions = [
                () => this.commands.get(/toggle theme/i)(),
                () => this.commands.get(/show projects/i)(),
                () => this.commands.get(/open chat/i)(),
                () => this.commands.get(/show performance/i)()
            ];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            randomAction();
            this.showFeedback('Surprise! ✨');
        });
    }

    bindEvents() {
        this.micButton.addEventListener('click', () => {
            if (this.isListening) {
                this.stopListening();
            } else {
                this.startListening();
            }
        });

        // Close help modal
        this.overlay.addEventListener('click', () => {
            this.hideHelp();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'V') {
                e.preventDefault();
                this.startListening();
            }
            if (e.key === 'Escape' && this.helpModal.classList.contains('show')) {
                this.hideHelp();
            }
        });

        // Always listen for "hey portfolio" activation phrase
        if (this.recognition) {
            this.recognition.continuous = true;
            this.recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
                
                if (transcript.includes('hey portfolio') || transcript.includes('portfolio')) {
                    this.startListening();
                    return;
                }
                
                if (this.isListening) {
                    this.processCommand(transcript);
                }
            };
        }
    }

    startListening() {
        if (!this.isSupported || !this.isEnabled) return;

        try {
            this.recognition.start();
            this.updateUI('listening');
        } catch (error) {
            console.error('Error starting voice recognition:', error);
            this.showFeedback('Microphone access denied', 'error');
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
        this.updateUI('idle');
    }

    processCommand(command) {
        console.log('Processing voice command:', command);
        this.lastCommand = command;
        this.commandHistory.push({
            command,
            timestamp: new Date(),
            executed: false
        });

        this.updateUI('processing');
        
        let commandExecuted = false;
        
        for (let [pattern, action] of this.commands) {
            if (pattern.test(command)) {
                try {
                    action();
                    commandExecuted = true;
                    this.commandHistory[this.commandHistory.length - 1].executed = true;
                    break;
                } catch (error) {
                    console.error('Error executing command:', error);
                    this.showFeedback('Command execution error', 'error');
                }
            }
        }

        if (!commandExecuted) {
            this.showFeedback(`Command not recognized: "${command}"`, 'error');
        }

        setTimeout(() => {
            this.stopListening();
        }, 1000);
    }

    updateUI(state) {
        this.micButton.className = 'voice-mic-button';
        
        switch (state) {
            case 'listening':
                this.micButton.classList.add('listening');
                this.micButton.innerHTML = '<div class="voice-waveform">' +
                    '<div class="voice-wave"></div>'.repeat(5) +
                    '</div>';
                this.statusText.textContent = 'Listening...';
                this.commandText.textContent = 'Speak your command now';
                break;
                
            case 'processing':
                this.micButton.classList.add('processing');
                this.micButton.innerHTML = '<i class="fas fa-cog"></i>';
                this.statusText.textContent = 'Processing...';
                this.commandText.textContent = `Command: "${this.lastCommand}"`;
                break;
                
            default:
                this.micButton.innerHTML = '<i class="fas fa-microphone"></i>';
                this.statusText.textContent = 'Voice Commands Ready';
                this.commandText.textContent = 'Say "Hey Portfolio" or click mic';
        }
    }

    showFeedback(message, type = 'success') {
        const feedback = document.createElement('div');
        feedback.className = `voice-feedback ${type}`;
        feedback.textContent = message;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => feedback.classList.add('show'), 100);
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 500);
        }, 3000);
    }

    showHelp() {
        this.overlay.classList.add('show');
        this.helpModal.classList.add('show');
    }

    hideHelp() {
        this.overlay.classList.remove('show');
        this.helpModal.classList.remove('show');
    }

    enable() {
        this.isEnabled = true;
        this.widget.style.opacity = '1';
        this.widget.style.pointerEvents = 'auto';
    }

    disable() {
        this.isEnabled = false;
        this.stopListening();
        this.widget.style.opacity = '0.5';
        this.widget.style.pointerEvents = 'none';
    }

    getCommandHistory() {
        return this.commandHistory;
    }

    getStats() {
        const total = this.commandHistory.length;
        const successful = this.commandHistory.filter(cmd => cmd.executed).length;
        
        return {
            totalCommands: total,
            successfulCommands: successful,
            successRate: total > 0 ? (successful / total * 100).toFixed(1) : 0,
            isSupported: this.isSupported,
            isEnabled: this.isEnabled,
            isListening: this.isListening
        };
    }
}

// Initialize voice command system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        window.voiceCommands = new VoiceCommandSystem();
        console.log('Voice Command System initialized');
    } else {
        console.log('Voice recognition not supported in this browser');
    }
});
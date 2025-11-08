/**
 * AI-Powered Chat Widget for Portfolio
 * Simulates intelligent responses to visitor questions
 */

class AIPortfolioAssistant {
    constructor() {
        this.isOpen = false;
        this.responses = {
            greetings: [
                "Hi there! 👋 I'm Rajveer's AI assistant. How can I help you learn more about his work?",
                "Hello! Welcome to Rajveer's portfolio. I'm here to answer any questions you might have!",
                "Greetings! I'm an AI assistant that can tell you all about Rajveer Singh's projects and skills."
            ],
            skills: [
                "Rajveer is proficient in Python, Java, JavaScript, React, Node.js, and machine learning technologies. He's particularly passionate about AI and full-stack development!",
                "His technical stack includes MERN (MongoDB, Express, React, Node.js), Python for data science, and various cloud technologies. He's always learning new frameworks!"
            ],
            projects: [
                "Rajveer has worked on several exciting projects including AI-powered chat applications, e-commerce platforms, and machine learning predictors. Would you like to see his project gallery?",
                "His portfolio showcases web development projects, ML models, and mobile applications. Each project demonstrates different aspects of his technical expertise."
            ],
            contact: [
                "You can reach Rajveer at 1.rajveersinghcse@gmail.com or connect with him on LinkedIn. He's always open to discussing new opportunities!",
                "Feel free to use the contact form on this page, or reach out via email or LinkedIn. He typically responds within 24 hours."
            ],
            education: [
                "Rajveer is currently pursuing his B.Tech in Computer Science & Engineering at Jodhpur Institute of Engineering & Technology. He's in his 3rd year and maintaining excellent academic performance.",
                "He's a dedicated student at JIET, Jodhpur, focusing on computer science fundamentals while gaining practical experience through projects and internships."
            ],
            default: [
                "That's an interesting question! While I can tell you about Rajveer's skills, projects, education, and how to contact him, I might not have specific details about that. Feel free to reach out to him directly!",
                "I'd love to help, but I might not have that specific information. You can ask me about his technical skills, projects, education, or contact details. Or better yet, get in touch with Rajveer directly!"
            ]
        };
        
        this.conversationHistory = [];
        this.init();
    }

    init() {
        this.createChatWidget();
        this.setupEventListeners();
        this.setupTypingEffect();
    }

    createChatWidget() {
        const chatWidget = document.createElement('div');
        chatWidget.className = 'chat-widget';
        chatWidget.innerHTML = `
            <div class="chat-toggle" id="chat-toggle">
                <i class="fas fa-robot"></i>
                <div class="chat-notification">
                    <span>Ask me about Rajveer!</span>
                </div>
            </div>
            <div class="chat-window" id="chat-window">
                <div class="chat-header">
                    <div class="chat-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="chat-info">
                        <h4>Portfolio Assistant</h4>
                        <span class="chat-status">Online • AI-Powered</span>
                    </div>
                    <button class="chat-close" id="chat-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chat-messages" id="chat-messages">
                    <div class="chat-message ai-message">
                        <div class="message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">
                            <div class="message-text">
                                ${this.getRandomResponse('greetings')}
                            </div>
                            <div class="message-time">${this.getCurrentTime()}</div>
                        </div>
                    </div>
                    <div class="suggested-questions">
                        <div class="suggestion-title">Quick questions:</div>
                        <button class="suggestion-btn" data-question="What are Rajveer's skills?">
                            💻 Technical Skills
                        </button>
                        <button class="suggestion-btn" data-question="Tell me about his projects">
                            🚀 Projects
                        </button>
                        <button class="suggestion-btn" data-question="How can I contact him?">
                            📧 Contact Info
                        </button>
                        <button class="suggestion-btn" data-question="What is his education background?">
                            🎓 Education
                        </button>
                    </div>
                </div>
                <div class="chat-input-container">
                    <div class="typing-indicator" id="typing-indicator">
                        <div class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span>AI is typing...</span>
                    </div>
                    <div class="chat-input">
                        <input type="text" id="chat-input" placeholder="Ask me anything about Rajveer..." maxlength="200">
                        <button id="chat-send">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(chatWidget);
    }

    setupEventListeners() {
        const chatToggle = document.getElementById('chat-toggle');
        const chatClose = document.getElementById('chat-close');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');

        chatToggle.addEventListener('click', () => this.toggleChat());
        chatClose.addEventListener('click', () => this.toggleChat());
        chatSend.addEventListener('click', () => this.sendMessage());
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Suggestion buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-btn')) {
                const question = e.target.dataset.question;
                this.sendMessage(question);
            }
        });

        // Show notification after 5 seconds
        setTimeout(() => {
            const notification = document.querySelector('.chat-notification');
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 4000);
        }, 5000);
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatToggle = document.getElementById('chat-toggle');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatWindow.classList.add('open');
            chatToggle.classList.add('active');
            document.getElementById('chat-input').focus();
        } else {
            chatWindow.classList.remove('open');
            chatToggle.classList.remove('active');
        }
    }

    sendMessage(messageText = null) {
        const input = document.getElementById('chat-input');
        const message = messageText || input.value.trim();
        
        if (!message) return;
        
        this.addMessage(message, 'user');
        if (!messageText) input.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        // Simulate AI processing time
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(message);
            this.addMessage(response, 'ai');
        }, Math.random() * 1500 + 500);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        if (sender === 'ai') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">${text}</div>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${text}</div>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            `;
        }
        
        // Remove suggestions after first user message
        if (sender === 'user') {
            const suggestions = messagesContainer.querySelector('.suggested-questions');
            if (suggestions) suggestions.remove();
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Animation
        setTimeout(() => messageDiv.classList.add('animate'), 10);
        
        this.conversationHistory.push({ sender, text, time: new Date() });
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (this.containsWords(lowerMessage, ['skill', 'technology', 'programming', 'language', 'tech'])) {
            return this.getRandomResponse('skills');
        } else if (this.containsWords(lowerMessage, ['project', 'work', 'portfolio', 'build', 'development'])) {
            return this.getRandomResponse('projects');
        } else if (this.containsWords(lowerMessage, ['contact', 'reach', 'email', 'phone', 'linkedin'])) {
            return this.getRandomResponse('contact');
        } else if (this.containsWords(lowerMessage, ['education', 'study', 'college', 'university', 'degree'])) {
            return this.getRandomResponse('education');
        } else if (this.containsWords(lowerMessage, ['hello', 'hi', 'hey', 'greet'])) {
            return this.getRandomResponse('greetings');
        } else {
            return this.getRandomResponse('default');
        }
    }

    containsWords(text, words) {
        return words.some(word => text.includes(word));
    }

    getRandomResponse(category) {
        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    showTyping() {
        const typingIndicator = document.getElementById('typing-indicator');
        typingIndicator.style.display = 'flex';
    }

    hideTyping() {
        const typingIndicator = document.getElementById('typing-indicator');
        typingIndicator.style.display = 'none';
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    setupTypingEffect() {
        // Add typing effect to AI messages
        const style = document.createElement('style');
        style.textContent = `
            .message-text {
                overflow: hidden;
                border-right: 2px solid transparent;
                animation: typing 1.5s steps(40, end);
            }
            
            @keyframes typing {
                from { width: 0; border-right-color: var(--primary-color); }
                to { width: 100%; border-right-color: transparent; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize AI assistant
document.addEventListener('DOMContentLoaded', () => {
    new AIPortfolioAssistant();
});
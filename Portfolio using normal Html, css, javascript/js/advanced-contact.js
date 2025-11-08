/**
 * Advanced Contact Form with Real-time Validation and Animations
 */

class AdvancedContactForm {
    constructor() {
        this.emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
        this.init();
    }

    init() {
        this.enhanceContactForm();
        this.setupFormValidation();
        this.setupFloatingLabels();
        this.setupSubmissionHandler();
        this.setupSocialIntegration();
    }

    enhanceContactForm() {
        const contactSection = document.querySelector('#contact');
        if (!contactSection) return;

        // Find the existing form and enhance it
        const existingForm = contactSection.querySelector('.contact-form');
        if (existingForm) {
            this.addAdvancedFormFeatures(existingForm);
        }
    }

    addAdvancedFormFeatures(form) {
        // Add floating labels and enhanced styling
        const formGroups = form.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                // Create floating label structure
                group.classList.add('floating-label');
                label.classList.add('floating-label-text');
                
                // Add focus ring
                const focusRing = document.createElement('div');
                focusRing.className = 'focus-ring';
                group.appendChild(focusRing);
                
                // Add validation message container
                const validationMsg = document.createElement('div');
                validationMsg.className = 'validation-message';
                group.appendChild(validationMsg);
                
                // Add character counter for textarea
                if (input.tagName === 'TEXTAREA') {
                    const counter = document.createElement('div');
                    counter.className = 'char-counter';
                    counter.textContent = '0 / 500';
                    group.appendChild(counter);
                    
                    input.addEventListener('input', () => {
                        const length = input.value.length;
                        counter.textContent = `${length} / 500`;
                        counter.style.color = length > 450 ? '#dc3545' : '#777';
                    });
                }
            }
        });

        // Add form progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'form-progress';
        progressBar.innerHTML = '<div class="form-progress-bar"></div>';
        form.insertBefore(progressBar, form.firstChild);

        // Add form statistics
        const formStats = document.createElement('div');
        formStats.className = 'form-stats';
        formStats.innerHTML = `
            <div class="form-stat">
                <i class="fas fa-clock"></i>
                <span>Avg. response: 24 hours</span>
            </div>
            <div class="form-stat">
                <i class="fas fa-shield-alt"></i>
                <span>Secure & encrypted</span>
            </div>
            <div class="form-stat">
                <i class="fas fa-check-circle"></i>
                <span>100% privacy guaranteed</span>
            </div>
        `;
        form.appendChild(formStats);
    }

    setupFloatingLabels() {
        const floatingGroups = document.querySelectorAll('.floating-label');
        
        floatingGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('.floating-label-text');
            
            if (input && label) {
                // Initial state check
                if (input.value) {
                    label.classList.add('active');
                }
                
                input.addEventListener('focus', () => {
                    label.classList.add('active');
                    group.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label.classList.remove('active');
                    }
                    group.classList.remove('focused');
                });
                
                input.addEventListener('input', () => {
                    if (input.value) {
                        label.classList.add('active');
                    } else {
                        label.classList.remove('active');
                    }
                    this.updateFormProgress();
                });
            }
        });
    }

    setupFormValidation() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    validateField(field) {
        const group = field.closest('.form-group');
        const validationMsg = group.querySelector('.validation-message');
        let isValid = true;
        let message = '';

        // Remove previous validation states
        group.classList.remove('valid', 'invalid');
        
        if (field.value.trim() === '') {
            if (field.hasAttribute('required')) {
                isValid = false;
                message = 'This field is required';
            }
        } else {
            // Specific validations
            switch (field.type) {
                case 'email':
                    if (!this.emailPattern.test(field.value)) {
                        isValid = false;
                        message = 'Please enter a valid email address';
                    }
                    break;
                case 'tel':
                    if (!this.phonePattern.test(field.value)) {
                        isValid = false;
                        message = 'Please enter a valid phone number';
                    }
                    break;
                default:
                    if (field.name === 'message' && field.value.length < 10) {
                        isValid = false;
                        message = 'Message must be at least 10 characters long';
                    }
                    break;
            }
        }

        // Update UI
        if (isValid && field.value.trim() !== '') {
            group.classList.add('valid');
            validationMsg.textContent = '';
        } else if (!isValid) {
            group.classList.add('invalid');
            validationMsg.textContent = message;
        }

        this.updateFormProgress();
        return isValid;
    }

    updateFormProgress() {
        const form = document.querySelector('.contact-form');
        const requiredFields = form.querySelectorAll('[required]');
        const validFields = form.querySelectorAll('.form-group.valid');
        
        const progress = (validFields.length / requiredFields.length) * 100;
        const progressBar = form.querySelector('.form-progress-bar');
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
            progressBar.style.background = progress === 100 ? 
                'linear-gradient(90deg, #28a745, #20c997)' : 
                'linear-gradient(90deg, var(--primary-color), var(--primary-light))';
        }
    }

    setupSubmissionHandler() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate all fields
            const inputs = form.querySelectorAll('input, textarea');
            let allValid = true;
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    allValid = false;
                }
            });
            
            if (!allValid) {
                this.showNotification('Please fix the errors before submitting', 'error');
                return;
            }
            
            await this.submitForm(form);
        });
    }

    async submitForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = `
            <div class="btn-loading">
                <div class="spinner"></div>
                <span>Sending...</span>
            </div>
        `;
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await this.simulateSubmission(new FormData(form));
            
            // Success state
            submitBtn.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>Message Sent!</span>
            `;
            submitBtn.style.background = '#28a745';
            
            // Show success notification
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                this.resetForm(form);
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
            
        } catch (error) {
            // Error state
            submitBtn.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span>Failed to Send</span>
            `;
            submitBtn.style.background = '#dc3545';
            
            this.showNotification('Failed to send message. Please try again.', 'error');
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }
    }

    simulateSubmission(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    resetForm(form) {
        // Reset floating labels
        const labels = form.querySelectorAll('.floating-label-text');
        labels.forEach(label => label.classList.remove('active'));
        
        // Reset validation states
        const groups = form.querySelectorAll('.form-group');
        groups.forEach(group => {
            group.classList.remove('valid', 'invalid', 'focused');
            const validationMsg = group.querySelector('.validation-message');
            if (validationMsg) validationMsg.textContent = '';
        });
        
        // Reset progress bar
        const progressBar = form.querySelector('.form-progress-bar');
        if (progressBar) progressBar.style.width = '0%';
        
        // Reset character counters
        const counters = form.querySelectorAll('.char-counter');
        counters.forEach(counter => {
            counter.textContent = '0 / 500';
            counter.style.color = '#777';
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        });
        
        // Show animation
        setTimeout(() => notification.classList.add('show'), 100);
    }

    setupSocialIntegration() {
        // Add social contact options
        const contactSection = document.querySelector('#contact');
        if (!contactSection) return;

        const socialContact = document.createElement('div');
        socialContact.className = 'social-contact fade-in-up';
        socialContact.innerHTML = `
            <h3>Other Ways to Reach Me</h3>
            <div class="social-contact-grid">
                <a href="mailto:1.rajveersinghcse@gmail.com" class="social-contact-item hover-glow magnetic">
                    <i class="fas fa-envelope"></i>
                    <div>
                        <h4>Email</h4>
                        <p>1.rajveersinghcse@gmail.com</p>
                    </div>
                </a>
                <a href="https://www.linkedin.com/in/rajveer-singh-997219291" class="social-contact-item hover-glow magnetic" target="_blank">
                    <i class="fab fa-linkedin"></i>
                    <div>
                        <h4>LinkedIn</h4>
                        <p>Connect professionally</p>
                    </div>
                </a>
                <a href="https://github.com/1Rajveer-Singh" class="social-contact-item hover-glow magnetic" target="_blank">
                    <i class="fab fa-github"></i>
                    <div>
                        <h4>GitHub</h4>
                        <p>View my projects</p>
                    </div>
                </a>
            </div>
        `;
        
        contactSection.appendChild(socialContact);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedContactForm();
});
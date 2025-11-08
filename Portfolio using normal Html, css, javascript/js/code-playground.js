/**
 * Dynamic Code Playground
 * Interactive coding environment with live execution
 */

class CodePlayground {
    constructor() {
        this.isOpen = false;
        this.currentLanguage = 'javascript';
        this.examples = this.getCodeExamples();
        
        this.initUI();
        this.bindEvents();
    }

    initUI() {
        const playgroundHTML = `
            <div class="code-playground">
                <button class="playground-toggle" title="Open Code Playground (Ctrl+Shift+P)">
                    <i class="fas fa-code"></i>
                </button>
                
                <div class="playground-modal">
                    <div class="playground-container">
                        <div class="playground-header">
                            <h3 class="playground-title">
                                <i class="fas fa-code"></i>
                                Interactive Code Playground
                            </h3>
                            <div class="playground-controls">
                                <select class="playground-lang-selector">
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="html">HTML</option>
                                    <option value="css">CSS</option>
                                </select>
                                <button class="playground-run-btn">
                                    <i class="fas fa-play"></i>
                                    Run Code
                                </button>
                                <button class="playground-close">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="playground-tabs">
                            <button class="playground-tab active" data-tab="editor">Editor</button>
                            <button class="playground-tab" data-tab="output">Output</button>
                            <button class="playground-tab" data-tab="examples">Examples</button>
                        </div>
                        
                        <div class="playground-content">
                            <div class="playground-editor">
                                <div class="editor-header">
                                    <span>Code Editor</span>
                                    <div class="editor-actions">
                                        <button class="btn-clear" title="Clear Code">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                        <button class="btn-copy" title="Copy Code">
                                            <i class="fas fa-copy"></i>
                                        </button>
                                    </div>
                                </div>
                                <textarea class="code-editor" placeholder="Start coding here..."></textarea>
                            </div>
                            
                            <div class="playground-output">
                                <div class="output-header">
                                    <span>Output</span>
                                    <div class="output-actions">
                                        <button class="btn-clear-output" title="Clear Output">
                                            <i class="fas fa-eraser"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="code-output">Ready to run your code...</div>
                            </div>
                        </div>
                        
                        <div class="code-examples" style="display: none;">
                            <div class="examples-grid"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', playgroundHTML);
        this.initElements();
        this.loadExamples();
    }

    initElements() {
        this.toggle = document.querySelector('.playground-toggle');
        this.modal = document.querySelector('.playground-modal');
        this.container = document.querySelector('.playground-container');
        this.langSelector = document.querySelector('.playground-lang-selector');
        this.runButton = document.querySelector('.playground-run-btn');
        this.closeButton = document.querySelector('.playground-close');
        this.codeEditor = document.querySelector('.code-editor');
        this.codeOutput = document.querySelector('.code-output');
        this.tabs = document.querySelectorAll('.playground-tab');
        this.editorSection = document.querySelector('.playground-editor');
        this.outputSection = document.querySelector('.playground-output');
        this.examplesSection = document.querySelector('.code-examples');
        this.examplesGrid = document.querySelector('.examples-grid');
    }

    bindEvents() {
        // Toggle playground
        this.toggle.addEventListener('click', () => this.open());
        this.closeButton.addEventListener('click', () => this.close());

        // Language selector
        this.langSelector.addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.updateEditor();
        });

        // Run code
        this.runButton.addEventListener('click', () => this.runCode());

        // Tab navigation
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });

        // Code editor features
        this.codeEditor.addEventListener('keydown', (e) => {
            this.handleEditorKeydown(e);
        });

        // Clear buttons
        document.querySelector('.btn-clear')?.addEventListener('click', () => {
            this.codeEditor.value = '';
        });

        document.querySelector('.btn-copy')?.addEventListener('click', () => {
            navigator.clipboard.writeText(this.codeEditor.value);
            this.showNotification('Code copied to clipboard!');
        });

        document.querySelector('.btn-clear-output')?.addEventListener('click', () => {
            this.codeOutput.textContent = 'Output cleared.';
            this.codeOutput.className = 'code-output';
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.open();
            }
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && this.isOpen) {
                e.preventDefault();
                this.runCode();
            }
        });

        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }

    open() {
        this.isOpen = true;
        this.modal.classList.add('open');
        this.codeEditor.focus();
        this.updateEditor();
    }

    close() {
        this.isOpen = false;
        this.modal.classList.remove('open');
    }

    switchTab(tabName) {
        // Update tab buttons
        this.tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Show/hide sections
        const sections = {
            editor: this.editorSection.parentElement,
            output: this.outputSection,
            examples: this.examplesSection
        };

        Object.keys(sections).forEach(section => {
            if (section === 'editor' || section === 'output') {
                sections[section].style.display = tabName === 'editor' || tabName === 'output' ? 'flex' : 'none';
            } else {
                sections[section].style.display = tabName === section ? 'block' : 'none';
            }
        });

        if (tabName === 'examples') {
            document.querySelector('.playground-content').style.display = 'none';
            this.examplesSection.style.display = 'block';
        } else {
            document.querySelector('.playground-content').style.display = 'flex';
            this.examplesSection.style.display = 'none';
        }
    }

    updateEditor() {
        const example = this.examples[this.currentLanguage]?.[0];
        if (example && !this.codeEditor.value.trim()) {
            this.codeEditor.value = example.code;
        }
        this.codeEditor.placeholder = `Write your ${this.currentLanguage} code here...`;
    }

    handleEditorKeydown(e) {
        // Tab key handling
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.codeEditor.selectionStart;
            const end = this.codeEditor.selectionEnd;
            
            this.codeEditor.value = 
                this.codeEditor.value.substring(0, start) + 
                '  ' + 
                this.codeEditor.value.substring(end);
            
            this.codeEditor.selectionStart = this.codeEditor.selectionEnd = start + 2;
        }

        // Auto-bracket completion
        const brackets = {
            '(': ')',
            '[': ']',
            '{': '}',
            '"': '"',
            "'": "'"
        };

        if (brackets[e.key]) {
            e.preventDefault();
            const start = this.codeEditor.selectionStart;
            const end = this.codeEditor.selectionEnd;
            const selectedText = this.codeEditor.value.substring(start, end);
            
            this.codeEditor.value = 
                this.codeEditor.value.substring(0, start) + 
                e.key + selectedText + brackets[e.key] + 
                this.codeEditor.value.substring(end);
            
            this.codeEditor.selectionStart = this.codeEditor.selectionEnd = start + 1;
        }
    }

    runCode() {
        const code = this.codeEditor.value.trim();
        if (!code) {
            this.showOutput('No code to execute.', 'error');
            return;
        }

        this.showOutput('Running...', 'info');
        this.runButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';

        setTimeout(() => {
            try {
                this.executeCode(code);
            } catch (error) {
                this.showOutput(`Error: ${error.message}`, 'error');
            } finally {
                this.runButton.innerHTML = '<i class="fas fa-play"></i> Run Code';
            }
        }, 500);
    }

    executeCode(code) {
        switch (this.currentLanguage) {
            case 'javascript':
                this.executeJavaScript(code);
                break;
            case 'python':
                this.executePython(code);
                break;
            case 'html':
                this.executeHTML(code);
                break;
            case 'css':
                this.executeCSS(code);
                break;
            default:
                this.showOutput('Language not supported for execution.', 'error');
        }
    }

    executeJavaScript(code) {
        // Create a safe execution environment
        const originalConsole = console.log;
        const output = [];
        
        console.log = (...args) => {
            output.push(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
        };

        try {
            // Create a function to capture return values
            const wrappedCode = `
                (function() {
                    ${code}
                })();
            `;
            
            const result = eval(wrappedCode);
            
            if (output.length === 0 && result !== undefined) {
                output.push(String(result));
            }
            
            this.showOutput(output.join('\\n') || 'Code executed successfully!', 'success');
        } catch (error) {
            this.showOutput(`JavaScript Error: ${error.message}`, 'error');
        } finally {
            console.log = originalConsole;
        }
    }

    executePython(code) {
        // Simulate Python execution (would need actual Python interpreter)
        const pythonSimulator = {
            'print("Hello, World!")': 'Hello, World!',
            'print("Hello World")': 'Hello World',
            '2 + 2': '4',
            'len("hello")': '5',
            'list(range(5))': '[0, 1, 2, 3, 4]'
        };

        const simpleCode = code.replace(/\\s+/g, ' ').trim();
        
        if (pythonSimulator[simpleCode]) {
            this.showOutput(pythonSimulator[simpleCode], 'success');
        } else if (code.includes('print(')) {
            // Basic print statement handling
            const matches = code.match(/print\\((.+)\\)/g);
            if (matches) {
                const outputs = matches.map(match => {
                    const content = match.match(/print\\((.+)\\)/)[1];
                    return content.replace(/["']/g, '');
                });
                this.showOutput(outputs.join('\\n'), 'success');
            } else {
                this.showOutput('Python execution simulation - limited functionality', 'info');
            }
        } else {
            this.showOutput('Python execution requires a Python interpreter. This is a simulation.', 'info');
        }
    }

    executeHTML(code) {
        // Create preview window
        const previewWindow = window.open('', '_blank', 'width=600,height=400');
        previewWindow.document.write(code);
        previewWindow.document.close();
        this.showOutput('HTML preview opened in new window', 'success');
    }

    executeCSS(code) {
        // Create CSS preview with sample HTML
        const sampleHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .demo { padding: 20px; margin: 10px; border: 1px solid #ccc; }
                    ${code}
                </style>
            </head>
            <body>
                <div class="demo">
                    <h1>Sample Heading</h1>
                    <p>This is sample text to demonstrate your CSS.</p>
                    <button>Sample Button</button>
                </div>
            </body>
            </html>
        `;
        
        const previewWindow = window.open('', '_blank', 'width=600,height=400');
        previewWindow.document.write(sampleHTML);
        previewWindow.document.close();
        this.showOutput('CSS preview opened in new window', 'success');
    }

    showOutput(text, type = 'success') {
        this.codeOutput.textContent = text;
        this.codeOutput.className = `code-output ${type === 'error' ? 'error-output' : type === 'success' ? 'success-output' : ''}`;
        
        // Auto-switch to output tab
        this.switchTab('output');
    }

    loadExamples() {
        this.examplesGrid.innerHTML = '';
        
        const currentExamples = this.examples[this.currentLanguage] || [];
        
        currentExamples.forEach(example => {
            const exampleCard = document.createElement('div');
            exampleCard.className = 'example-card';
            exampleCard.innerHTML = `
                <div class="example-title">${example.title}</div>
                <div class="example-description">${example.description}</div>
            `;
            
            exampleCard.addEventListener('click', () => {
                this.codeEditor.value = example.code;
                this.switchTab('editor');
                this.codeEditor.focus();
            });
            
            this.examplesGrid.appendChild(exampleCard);
        });
    }

    getCodeExamples() {
        return {
            javascript: [
                {
                    title: 'Hello World',
                    description: 'Basic console output',
                    code: `console.log("Hello, World!");
console.log("Welcome to the Code Playground!");`
                },
                {
                    title: 'Variables & Arrays',
                    description: 'Working with data types',
                    code: `const name = "Rajveer";
const skills = ["JavaScript", "Python", "React"];
console.log(\`Hi, I'm \${name}\`);
console.log("My skills:", skills);`
                },
                {
                    title: 'Function Example',
                    description: 'Creating and calling functions',
                    code: `function calculateAge(birthYear) {
    return new Date().getFullYear() - birthYear;
}

const age = calculateAge(2000);
console.log(\`Age: \${age} years\`);`
                },
                {
                    title: 'DOM Manipulation',
                    description: 'Working with the DOM',
                    code: `// Create a new element
const div = document.createElement('div');
div.textContent = 'Hello from JavaScript!';
div.style.color = 'blue';

// This would add it to the page
// document.body.appendChild(div);
console.log('Element created:', div.outerHTML);`
                }
            ],
            python: [
                {
                    title: 'Hello World',
                    description: 'Basic print statement',
                    code: `print("Hello, World!")
print("Welcome to Python!")`
                },
                {
                    title: 'Variables & Lists',
                    description: 'Working with data',
                    code: `name = "Rajveer"
skills = ["Python", "JavaScript", "React"]
print(f"Hi, I'm {name}")
print("My skills:", skills)`
                },
                {
                    title: 'Function Example',
                    description: 'Defining functions',
                    code: `def calculate_age(birth_year):
    from datetime import datetime
    return datetime.now().year - birth_year

age = calculate_age(2000)
print(f"Age: {age} years")`
                },
                {
                    title: 'List Comprehension',
                    description: 'Python list magic',
                    code: `numbers = [1, 2, 3, 4, 5]
squares = [n**2 for n in numbers]
print("Numbers:", numbers)
print("Squares:", squares)`
                }
            ],
            html: [
                {
                    title: 'Basic HTML',
                    description: 'Simple HTML structure',
                    code: `<!DOCTYPE html>
<html>
<head>
    <title>My Portfolio</title>
</head>
<body>
    <h1>Welcome to My Portfolio</h1>
    <p>This is a sample HTML page.</p>
    <a href="#projects">View Projects</a>
</body>
</html>`
                },
                {
                    title: 'Form Example',
                    description: 'HTML form elements',
                    code: `<!DOCTYPE html>
<html>
<body>
    <h2>Contact Form</h2>
    <form>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name"><br><br>
        
        <label for="email">Email:</label>
        <input type="email" id="email" name="email"><br><br>
        
        <input type="submit" value="Submit">
    </form>
</body>
</html>`
                }
            ],
            css: [
                {
                    title: 'Basic Styling',
                    description: 'Simple CSS styles',
                    code: `.demo h1 {
    color: #4d5bf9;
    text-align: center;
    font-size: 2em;
}

.demo p {
    color: #666;
    line-height: 1.6;
}

.demo button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}`
                },
                {
                    title: 'Animation Example',
                    description: 'CSS animations',
                    code: `.demo {
    animation: slideIn 1s ease-in-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.demo button:hover {
    transform: scale(1.1);
    transition: transform 0.3s ease;
}`
                }
            ]
        };
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 10001;
            font-weight: 600;
            box-shadow: var(--shadow-lg);
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize code playground
document.addEventListener('DOMContentLoaded', () => {
    window.codePlayground = new CodePlayground();
    console.log('Code Playground initialized');
});
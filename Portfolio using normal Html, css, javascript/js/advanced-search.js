/**
 * Advanced Search Engine for Portfolio
 * Provides intelligent content discovery and navigation
 */

class AdvancedSearchEngine {
    constructor() {
        this.searchIndex = new Map();
        this.isOpen = false;
        this.searchHistory = [];
        this.activeFilter = 'all';
        this.selectedIndex = -1;
        this.currentResults = [];
        
        this.initUI();
        this.buildSearchIndex();
        this.bindEvents();
    }

    initUI() {
        // Create search engine HTML structure
        const searchHTML = `
            <div class="search-engine">
                <button class="search-toggle" title="Search Portfolio (Ctrl+K)">
                    <i class="fas fa-search"></i>
                </button>
                
                <div class="search-panel">
                    <div class="search-header">
                        <h3>
                            <span><i class="fas fa-search"></i> Search Portfolio</span>
                            <button class="search-close">
                                <i class="fas fa-times"></i>
                            </button>
                        </h3>
                        <div class="search-input-container">
                            <input type="text" class="search-input" placeholder="Search projects, skills, sections..." autocomplete="off">
                            <i class="fas fa-search search-icon"></i>
                        </div>
                    </div>
                    
                    <div class="search-filters">
                        <div class="filter-tabs">
                            <button class="filter-tab active" data-filter="all">All</button>
                            <button class="filter-tab" data-filter="projects">Projects</button>
                            <button class="filter-tab" data-filter="skills">Skills</button>
                            <button class="filter-tab" data-filter="sections">Sections</button>
                            <button class="filter-tab" data-filter="education">Education</button>
                            <button class="filter-tab" data-filter="experience">Experience</button>
                        </div>
                    </div>
                    
                    <div class="search-results">
                        <div class="search-stats"></div>
                        <div class="results-container"></div>
                    </div>
                    
                    <div class="search-suggestions">
                        <h4>Quick Search</h4>
                        <div class="suggestion-tags">
                            <span class="suggestion-tag" data-query="react">React</span>
                            <span class="suggestion-tag" data-query="javascript">JavaScript</span>
                            <span class="suggestion-tag" data-query="python">Python</span>
                            <span class="suggestion-tag" data-query="web development">Web Dev</span>
                            <span class="suggestion-tag" data-query="machine learning">ML</span>
                            <span class="suggestion-tag" data-query="projects">Projects</span>
                            <span class="suggestion-tag" data-query="contact">Contact</span>
                        </div>
                    </div>
                    
                    <div class="search-advanced">
                        <div class="search-options">
                            <label class="search-option">
                                <input type="checkbox" id="exact-match"> Exact match
                            </label>
                            <label class="search-option">
                                <input type="checkbox" id="case-sensitive"> Case sensitive
                            </label>
                            <label class="search-option">
                                <input type="checkbox" id="whole-words"> Whole words only
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', searchHTML);

        // Get DOM elements
        this.searchToggle = document.querySelector('.search-toggle');
        this.searchPanel = document.querySelector('.search-panel');
        this.searchInput = document.querySelector('.search-input');
        this.searchClose = document.querySelector('.search-close');
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.resultsContainer = document.querySelector('.results-container');
        this.searchStats = document.querySelector('.search-stats');
        this.suggestionTags = document.querySelectorAll('.suggestion-tag');
    }

    buildSearchIndex() {
        // Index all searchable content
        this.addToIndex('sections', {
            'home': {
                title: 'Home',
                description: 'Welcome section with introduction and hero content',
                tags: ['intro', 'welcome', 'hero', 'main'],
                element: '#home',
                type: 'section'
            },
            'about': {
                title: 'About Me',
                description: 'Personal information, background, and professional summary',
                tags: ['bio', 'profile', 'background', 'personal'],
                element: '#about',
                type: 'section'
            },
            'skills': {
                title: 'Skills & Technologies',
                description: 'Technical skills, programming languages, and tools',
                tags: ['abilities', 'tech', 'programming', 'languages'],
                element: '#skills',
                type: 'section'
            },
            'projects': {
                title: 'Projects & Portfolio',
                description: 'Showcase of completed projects and work samples',
                tags: ['work', 'portfolio', 'showcase', 'development'],
                element: '#projects',
                type: 'section'
            },
            'education': {
                title: 'Education & Qualifications',
                description: 'Academic background and certifications',
                tags: ['study', 'academic', 'qualifications', 'learning'],
                element: '#education',
                type: 'section'
            },
            'contact': {
                title: 'Contact Information',
                description: 'Get in touch, social links, and contact form',
                tags: ['reach', 'email', 'social', 'connect'],
                element: '#contact',
                type: 'section'
            }
        });

        // Index skills
        this.addToIndex('skills', {
            'python': {
                title: 'Python Programming',
                description: 'High-level programming language for data science and web development',
                tags: ['programming', 'language', 'backend', 'data science', 'ai', 'ml'],
                element: '#skills',
                type: 'skill'
            },
            'javascript': {
                title: 'JavaScript',
                description: 'Dynamic programming language for web development',
                tags: ['programming', 'frontend', 'web', 'dynamic', 'es6'],
                element: '#skills',
                type: 'skill'
            },
            'react': {
                title: 'React.js',
                description: 'Popular JavaScript library for building user interfaces',
                tags: ['frontend', 'ui', 'library', 'component', 'jsx'],
                element: '#skills',
                type: 'skill'
            },
            'html': {
                title: 'HTML5',
                description: 'Markup language for creating web content structure',
                tags: ['markup', 'web', 'structure', 'semantic'],
                element: '#skills',
                type: 'skill'
            },
            'css': {
                title: 'CSS3',
                description: 'Styling language for web presentation and design',
                tags: ['styling', 'design', 'responsive', 'animation'],
                element: '#skills',
                type: 'skill'
            },
            'java': {
                title: 'Java',
                description: 'Object-oriented programming language',
                tags: ['programming', 'oop', 'enterprise', 'backend'],
                element: '#skills',
                type: 'skill'
            },
            'nodejs': {
                title: 'Node.js',
                description: 'JavaScript runtime for server-side development',
                tags: ['backend', 'server', 'javascript', 'runtime'],
                element: '#skills',
                type: 'skill'
            },
            'git': {
                title: 'Git Version Control',
                description: 'Distributed version control system',
                tags: ['version control', 'collaboration', 'github'],
                element: '#skills',
                type: 'skill'
            }
        });

        // Index projects (dynamic based on project showcase)
        setTimeout(() => {
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach((card, index) => {
                const title = card.querySelector('.project-title')?.textContent || `Project ${index + 1}`;
                const description = card.querySelector('.project-description')?.textContent || '';
                const technologies = Array.from(card.querySelectorAll('.project-tech')).map(tech => tech.textContent);
                
                this.searchIndex.get('projects').set(title.toLowerCase().replace(/\s+/g, '-'), {
                    title,
                    description,
                    tags: [...technologies, 'project', 'development', 'coding'],
                    element: card,
                    type: 'project'
                });
            });
        }, 1000);

        // Index education content
        this.addToIndex('education', {
            'btech-cse': {
                title: 'B.Tech Computer Science & Engineering',
                description: 'Bachelor of Technology in Computer Science from JIET, Jodhpur',
                tags: ['degree', 'computer science', 'engineering', 'jiet', 'jodhpur'],
                element: '#education',
                type: 'education'
            },
            'jiet': {
                title: 'Jodhpur Institute of Engineering & Technology',
                description: 'Premier engineering college in Jodhpur, Rajasthan',
                tags: ['college', 'institute', 'jodhpur', 'rajasthan'],
                element: '#education',
                type: 'education'
            }
        });

        console.log('Search index built successfully');
    }

    addToIndex(category, items) {
        if (!this.searchIndex.has(category)) {
            this.searchIndex.set(category, new Map());
        }
        
        const categoryIndex = this.searchIndex.get(category);
        for (const [key, value] of Object.entries(items)) {
            categoryIndex.set(key, value);
        }
    }

    bindEvents() {
        // Toggle search panel
        this.searchToggle.addEventListener('click', () => this.toggle());
        this.searchClose.addEventListener('click', () => this.close());

        // Search input
        this.searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });

        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });

        // Filter tabs
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.setActiveFilter(tab.dataset.filter);
            });
        });

        // Suggestion tags
        this.suggestionTags.forEach(tag => {
            tag.addEventListener('click', () => {
                this.searchInput.value = tag.dataset.query;
                this.performSearch(tag.dataset.query);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.searchPanel.contains(e.target) && !this.searchToggle.contains(e.target)) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.searchPanel.classList.add('open');
        this.searchInput.focus();
        
        // Show initial suggestions
        this.showSuggestions();
    }

    close() {
        this.isOpen = false;
        this.searchPanel.classList.remove('open');
        this.searchInput.value = '';
        this.resultsContainer.innerHTML = '';
        this.selectedIndex = -1;
    }

    setActiveFilter(filter) {
        this.activeFilter = filter;
        
        // Update UI
        this.filterTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.filter === filter);
        });
        
        // Re-perform search with current query
        this.performSearch(this.searchInput.value);
    }

    performSearch(query) {
        if (!query.trim()) {
            this.showSuggestions();
            return;
        }

        const results = this.search(query);
        this.currentResults = results;
        this.selectedIndex = -1;
        this.renderResults(results, query);
        
        // Add to search history
        if (!this.searchHistory.includes(query)) {
            this.searchHistory.unshift(query);
            if (this.searchHistory.length > 10) {
                this.searchHistory.pop();
            }
        }
    }

    search(query) {
        const results = [];
        const queryLower = query.toLowerCase();
        const options = this.getSearchOptions();

        for (const [category, items] of this.searchIndex) {
            // Apply filter
            if (this.activeFilter !== 'all' && category !== this.activeFilter) {
                continue;
            }

            for (const [key, item] of items) {
                const score = this.calculateRelevanceScore(item, queryLower, options);
                if (score > 0) {
                    results.push({
                        ...item,
                        key,
                        category,
                        score
                    });
                }
            }
        }

        // Sort by relevance score
        return results.sort((a, b) => b.score - a.score).slice(0, 20);
    }

    calculateRelevanceScore(item, query, options) {
        let score = 0;
        const searchText = options.caseSensitive ? 
            `${item.title} ${item.description} ${item.tags.join(' ')}` :
            `${item.title} ${item.description} ${item.tags.join(' ')}`.toLowerCase();

        const queryToMatch = options.caseSensitive ? query : query.toLowerCase();

        if (options.exactMatch) {
            if (searchText === queryToMatch) score += 100;
        } else {
            // Title match (highest score)
            if (item.title.toLowerCase().includes(queryToMatch)) {
                score += 50;
                if (item.title.toLowerCase().startsWith(queryToMatch)) {
                    score += 25;
                }
            }

            // Description match
            if (item.description.toLowerCase().includes(queryToMatch)) {
                score += 20;
            }

            // Tags match
            item.tags.forEach(tag => {
                if (tag.toLowerCase().includes(queryToMatch)) {
                    score += 15;
                }
            });

            // Fuzzy matching for typos
            if (this.fuzzyMatch(item.title.toLowerCase(), queryToMatch)) {
                score += 10;
            }
        }

        return score;
    }

    fuzzyMatch(text, query) {
        // Simple fuzzy matching algorithm
        let textIndex = 0;
        let queryIndex = 0;
        
        while (textIndex < text.length && queryIndex < query.length) {
            if (text[textIndex] === query[queryIndex]) {
                queryIndex++;
            }
            textIndex++;
        }
        
        return queryIndex === query.length;
    }

    getSearchOptions() {
        return {
            exactMatch: document.getElementById('exact-match')?.checked || false,
            caseSensitive: document.getElementById('case-sensitive')?.checked || false,
            wholeWords: document.getElementById('whole-words')?.checked || false
        };
    }

    renderResults(results, query) {
        const statsHTML = `
            <div class="search-stats">
                Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"
                ${this.activeFilter !== 'all' ? ` in ${this.activeFilter}` : ''}
            </div>
        `;

        if (results.length === 0) {
            this.resultsContainer.innerHTML = `
                ${statsHTML}
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <h4>No results found</h4>
                    <p>Try different keywords or check your spelling</p>
                </div>
            `;
            return;
        }

        const resultsHTML = results.map((result, index) => {
            const highlightedTitle = this.highlightText(result.title, query);
            const highlightedDescription = this.highlightText(result.description, query);
            
            return `
                <div class="search-result" data-index="${index}" data-element="${result.element}">
                    <div class="search-result-header">
                        <span class="search-result-type ${result.type}">${result.type}</span>
                        <span class="search-result-title">${highlightedTitle}</span>
                    </div>
                    <div class="search-result-description">${highlightedDescription}</div>
                    <div class="search-result-tags">
                        ${result.tags.map(tag => `<span class="search-result-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
        }).join('');

        this.resultsContainer.innerHTML = statsHTML + resultsHTML;

        // Add click handlers to results
        this.resultsContainer.querySelectorAll('.search-result').forEach((result, index) => {
            result.addEventListener('click', () => this.selectResult(index));
        });
    }

    highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    selectResult(index) {
        const result = this.currentResults[index];
        if (!result) return;

        // Navigate to the element
        if (typeof result.element === 'string') {
            // It's a CSS selector
            const element = document.querySelector(result.element);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else if (result.element instanceof HTMLElement) {
            // It's a DOM element
            result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Close search panel
        this.close();

        // Add visual highlight
        setTimeout(() => {
            const targetElement = typeof result.element === 'string' ? 
                document.querySelector(result.element) : result.element;
            if (targetElement) {
                targetElement.classList.add('search-highlight-flash');
                setTimeout(() => {
                    targetElement.classList.remove('search-highlight-flash');
                }, 2000);
            }
        }, 500);
    }

    handleKeyNavigation(e) {
        const results = this.resultsContainer.querySelectorAll('.search-result');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, results.length - 1);
                this.updateSelection(results);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection(results);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0) {
                    this.selectResult(this.selectedIndex);
                }
                break;
        }
    }

    updateSelection(results) {
        results.forEach((result, index) => {
            result.classList.toggle('highlighted', index === this.selectedIndex);
        });
        
        // Scroll selected result into view
        if (this.selectedIndex >= 0) {
            results[this.selectedIndex]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }

    showSuggestions() {
        const recentSearches = this.searchHistory.slice(0, 5);
        const popularSuggestions = [
            'React projects', 'JavaScript skills', 'Python development',
            'Web development', 'Contact information', 'Education background'
        ];

        const suggestionsHTML = `
            <div class="search-stats">
                Quick access to popular content
            </div>
            ${recentSearches.length > 0 ? `
                <div class="search-suggestions-section">
                    <h4>Recent Searches</h4>
                    ${recentSearches.map(search => `
                        <div class="search-result suggestion-result" data-query="${search}">
                            <div class="search-result-header">
                                <span class="search-result-type">recent</span>
                                <span class="search-result-title">${search}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            <div class="search-suggestions-section">
                <h4>Popular Searches</h4>
                ${popularSuggestions.map(suggestion => `
                    <div class="search-result suggestion-result" data-query="${suggestion}">
                        <div class="search-result-header">
                            <span class="search-result-type">popular</span>
                            <span class="search-result-title">${suggestion}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        this.resultsContainer.innerHTML = suggestionsHTML;

        // Add click handlers to suggestions
        this.resultsContainer.querySelectorAll('.suggestion-result').forEach(result => {
            result.addEventListener('click', () => {
                const query = result.dataset.query;
                this.searchInput.value = query;
                this.performSearch(query);
            });
        });
    }

    getSearchStats() {
        return {
            totalSearches: this.searchHistory.length,
            recentSearches: this.searchHistory.slice(0, 5),
            indexedItems: Array.from(this.searchIndex.values()).reduce((total, category) => total + category.size, 0),
            categories: Array.from(this.searchIndex.keys())
        };
    }
}

// Initialize search engine
document.addEventListener('DOMContentLoaded', () => {
    window.advancedSearch = new AdvancedSearchEngine();
    console.log('Advanced Search Engine initialized');
});
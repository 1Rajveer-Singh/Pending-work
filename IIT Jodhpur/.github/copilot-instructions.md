# FileNest - Advanced P2P Search Engine

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
FileNest is an advanced multi-modal intelligent search engine operating over a decentralized P2P network, built with Python FastAPI backend and React.js TypeScript frontend.

## Code Style Guidelines

### React/TypeScript Frontend
- Use functional components with TypeScript
- Implement proper error boundaries and loading states
- Follow the component structure: `components/ui/` for reusable components
- Use Tailwind CSS for styling with custom design system
- Implement proper accessibility (ARIA labels, keyboard navigation)
- Use React Query for data fetching and caching
- Implement proper state management with Zustand
- Use proper TypeScript interfaces and types

### Design System
- Follow the established color palette (primary, secondary, success, warning, error)
- Use consistent spacing and typography scales
- Implement glassmorphism and card shadow effects
- Use smooth animations and transitions
- Maintain responsive design principles
- Follow accessibility guidelines (WCAG 2.1)

### Python Backend
- Use FastAPI for API development
- Implement proper async/await patterns
- Use Pydantic models for request/response validation
- Follow RESTful API conventions
- Implement proper error handling and logging
- Use type hints throughout the codebase
- Follow PEP 8 style guide

### Architecture Patterns
- Implement clean architecture principles
- Use dependency injection
- Separate concerns (services, models, repositories)
- Implement proper testing strategies
- Use proper error handling and validation
- Follow SOLID principles

## Key Features to Implement
1. Advanced search interface with real-time suggestions
2. File upload with drag-and-drop and progress tracking
3. Multi-modal search (text, image, document content)
4. P2P network visualization and monitoring
5. Real-time dashboard with analytics
6. Advanced filtering and sorting capabilities
7. User preferences and customization
8. Dark/light theme support
9. Responsive mobile design
10. Offline capability with service workers

## Code Quality Standards
- Write comprehensive unit and integration tests
- Implement proper error boundaries
- Use proper loading states and skeleton screens
- Implement proper caching strategies
- Follow security best practices
- Use proper validation for all inputs
- Implement proper logging and monitoring
- Write clear documentation and comments
- Use semantic HTML and proper accessibility
- Optimize for performance (lazy loading, code splitting)

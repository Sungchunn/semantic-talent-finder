# Frontend Documentation

## 📁 Frontend Structure

- **[design-system.md](./design-system.md)** - Complete design system and visual identity
- **[components.md](./components.md)** - React components and architecture
- **[react-bits.md](./react-bits.md)** - React Bits component specifications
- **[pages.md](./pages.md)** - Page components and routing
- **[hooks-and-services.md](./hooks-and-services.md)** - Custom hooks and API services

## ⚛️ React Architecture

### Technology Stack
- **React 18**: Core framework with hooks and functional components
- **TypeScript**: Type safety and developer experience
- **React Bits**: Premium animation and UI components
- **TailwindCSS**: Utility-first CSS framework (v4 compatibility issue - temporarily disabled)
- **React Router**: Client-side routing

### Design Philosophy
- **AI-Powered Enterprise Intelligence**: Professional, sophisticated, data-driven
- **Glassmorphism**: Modern glass effects with subtle gradients
- **Micro-interactions**: Smooth animations and hover effects
- **Performance-first**: Optimized for 51M+ profile dataset scale

### Current Status
- ✅ **Core Components**: Basic structure implemented
- ✅ **API Integration**: Services configured for backend communication
- 🔧 **Styling**: TailwindCSS temporarily disabled, using basic CSS
- 🔄 **Design System**: Implementation in progress with React Bits

## 🎨 Design System Overview

### Theme: "AI-Powered Enterprise Intelligence"
- **Primary Colors**: Deep enterprise blues (#1E3A8A, #3B82F6, #60A5FA)
- **Accent Colors**: Success green (#10B981), warning amber (#F59E0B), error red (#EF4444)
- **Typography**: Modern, clean fonts with animated text reveals
- **Visual Language**: Glassmorphism + subtle gradients + smooth animations

### Component Categories
1. **Layout Components**: Header, Footer, Layout, Navigation
2. **Search Components**: SearchBar, SearchResults, SearchFilters
3. **Profile Components**: ProfileCard, ProfileDetail, SkillsVisualization
4. **Analytics Components**: Dashboard, Metrics, Data Quality displays
5. **React Bits Components**: SplitText, BlurText, Counter, MagicBento, etc.

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px-767px (touch-optimized, simplified animations)
- **Tablet**: 768px-1023px (condensed layouts, reduced effects)
- **Desktop**: 1024px+ (full experience, complete animations)

### Performance Considerations
- Disable complex animations on mobile devices
- Use reduced motion preferences for accessibility
- Implement intersection observers for scroll animations
- Cache heavy WebGL effects for performance
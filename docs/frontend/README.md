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
- ✅ **Backend Connectivity**: CORS issues resolved, health check working
- 🔧 **Styling**: TailwindCSS temporarily disabled, using basic CSS
- 🔄 **Design System**: Implementation in progress with React Bits

### Recent Fixes (2025-08-16)
- ✅ **CORS Resolution**: Fixed "Failed to fetch" error by switching health check endpoint
- ✅ **Health Check**: Changed from `/actuator/health` to `/api/profiles/stats` for CORS compatibility
- ✅ **Error Handling**: Graceful handling of backend unavailability
- ✅ **Connection Status**: Real-time backend connectivity indicator working

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

## 🔌 API Integration & Connectivity

### Backend Health Check
The frontend monitors backend connectivity using a health check mechanism:

```typescript
// frontend/src/App.tsx - Health check implementation
useEffect(() => {
  const checkConnection = async () => {
    try {
      // Uses CORS-enabled API endpoint instead of actuator
      const response = await fetch('http://localhost:8080/api/profiles/stats');
      if (response.ok) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (err) {
      console.error('Backend connection failed:', err);
      setIsConnected(false);
    }
  };
  
  checkConnection();
}, []);
```

### CORS Configuration Notes
- ✅ **API Endpoints** (`/api/*`): Fully CORS-enabled for `http://localhost:3000`
- ❌ **Actuator Endpoints** (`/actuator/*`): No CORS headers by default
- **Solution**: Always use `/api/*` endpoints for frontend-backend communication

### Service Architecture
```
Frontend (React) → API Service → Backend Controller → Service Layer → Database
     ↓               ↓              ↓                   ↓              ↓
  Components → searchService.ts → SearchController → SemanticSearchService → ProfileRepository
```

### API Endpoints Used
- **Health Check**: `GET /api/profiles/stats` - Returns database statistics
- **Search**: `POST /api/search/semantic` - Performs semantic search
- **Suggestions**: `GET /api/search/suggestions` - Gets search suggestions
- **Filters**: `GET /api/search/filters` - Gets available filters

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
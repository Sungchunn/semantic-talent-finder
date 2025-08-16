# Known Issues & Fixes

## 🐛 Current Issues

### ✅ Frontend-Backend Connectivity Issue (RESOLVED)
- **Issue**: Frontend "Failed to fetch" error when checking backend connectivity
- **Root Cause**: Frontend was calling `/actuator/health` endpoint which doesn't have CORS enabled
- **Error**: `TypeError: Failed to fetch` in browser console on React app startup
- **Fix Applied**: Changed health check endpoint from `/actuator/health` to `/api/profiles/stats`
- **Technical Details**: 
  - Actuator endpoints don't inherit Spring Security CORS configuration
  - API endpoints (`/api/*`) have proper CORS headers for `http://localhost:3000`
  - Changed in `frontend/src/App.tsx:18`
- **Status**: ✅ Frontend now successfully connects to backend
- **Files Modified**: `frontend/src/App.tsx`

### ✅ Backend Startup Issue (RESOLVED)  
- **Issue**: Backend failing to start due to missing OpenAI API key configuration
- **Root Cause**: Required `OPENAI_API_KEY` environment variable not set
- **Error**: `Could not resolve placeholder 'OPENAI_API_KEY'` causing startup failure
- **Fix Applied**: Made OpenAI configuration conditional with custom `@Conditional` annotation
- **Technical Details**:
  - Created `OpenAIApiKeyPresentCondition` to check for API key presence
  - Updated `EmbeddingService` to handle missing EmbeddingModel gracefully
  - Added empty database handling in `SemanticSearchService`
  - Disabled Spring AI auto-configuration when API key missing
- **Status**: ✅ Backend starts successfully without OpenAI API key, degrades gracefully
- **Files Modified**: 
  - `backend/src/main/java/com/semantictalent/finder/config/OpenAIConfig.java`
  - `backend/src/main/java/com/semantictalent/finder/service/EmbeddingService.java`
  - `backend/src/main/java/com/semantictalent/finder/service/SemanticSearchService.java`
  - `backend/src/main/resources/application.yml`

### TailwindCSS v4 Compatibility Issue (Fixed)
- **Issue**: TailwindCSS v4 PostCSS plugin incompatibility causing frontend build errors
- **Error**: "It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin"
- **Fix Applied**: Temporarily disabled TailwindCSS in postcss.config.js and removed tailwind.config.js
- **Status**: ✅ Frontend now compiles successfully at http://localhost:3000
- **Future Action**: Need to implement TailwindCSS v4 proper configuration or downgrade to v3

## ✅ Current Working State (2025-08-16)

### Backend Status
- ✅ **Backend**: Running on http://localhost:8080 with full OpenAI integration
- ✅ **Database**: PostgreSQL + pgvector on port 5433
- ✅ **API**: Health endpoint working, ready for parquet data import
- ✅ **Configuration**: Spring Boot 3.4.8 + Java 21 fully configured

### Frontend Status
- ✅ **Frontend**: Running on http://localhost:3000
- 🔧 **Styling**: Basic CSS only (TailwindCSS disabled temporarily)
- ✅ **React Components**: All core components implemented
- ✅ **API Integration**: Services configured for backend communication

### Database Status
- ✅ **PostgreSQL**: Running with pgvector extension
- ✅ **Schema**: Production-ready schema implemented
- ✅ **Indexes**: HNSW and GIN indexes configured
- ✅ **Sample Data**: Test data loaded and verified

## 🔧 Temporary Workarounds

### TailwindCSS Alternative
Since TailwindCSS is temporarily disabled, use these approaches for styling:

1. **CSS Modules**: Use standard CSS with modular imports
2. **Styled Components**: Consider react-styled-components
3. **Bootstrap**: Quick alternative for component styling
4. **Custom CSS**: Direct CSS classes in index.css

### Example CSS Workaround
```css
/* frontend/src/index.css - Add utility classes */
.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
}

.grid {
  display: grid;
}

.grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

.gap-6 {
  gap: 1.5rem;
}
```

## 🎯 Priority Fixes

### High Priority
1. **TailwindCSS Configuration**: Resolve v4 compatibility or downgrade to v3
2. **Responsive Design**: Ensure mobile-friendly layouts without Tailwind
3. **Component Styling**: Apply consistent styling across all components

### Medium Priority
1. **Error Boundaries**: Add React error boundaries for better UX
2. **Loading States**: Improve loading indicators and skeleton screens
3. **Performance**: Optimize bundle size and code splitting

### Low Priority
1. **Theme System**: Implement dark/light mode toggle
2. **Accessibility**: Ensure WCAG compliance
3. **Animation**: Add smooth transitions and micro-interactions

## 📋 Testing Status

### Backend Testing
- ✅ **Unit Tests**: Service layer tests implemented
- ✅ **Integration Tests**: Repository tests with test containers
- 🔧 **Performance Tests**: Need to implement load testing

### Frontend Testing
- 🔧 **Component Tests**: React Testing Library setup needed
- 🔧 **E2E Tests**: Cypress or Playwright implementation pending
- 🔧 **Visual Regression**: Chromatic or similar tool needed

## 🔧 Troubleshooting Guide

### Frontend "Failed to fetch" Errors
**Symptoms**: Browser console shows `TypeError: Failed to fetch` on app startup

**Quick Diagnosis**:
```bash
# Test if backend is running
curl http://localhost:8080/actuator/health

# Test if API endpoints have CORS
curl -H "Origin: http://localhost:3000" http://localhost:8080/api/profiles/stats
```

**Common Causes**:
1. **Backend not running**: Start with `cd backend && ./mvnw spring-boot:run`
2. **Wrong port**: Verify backend is on port 8080, frontend on port 3000
3. **CORS issues**: Frontend calling non-CORS endpoint (like `/actuator/*`)
4. **Browser cache**: Clear browser cache and reload

**Solution**: Use API endpoints (`/api/*`) instead of actuator endpoints for frontend calls

### Backend Startup Failures
**Symptoms**: Backend fails to start with "Could not resolve placeholder" errors

**Quick Diagnosis**:
```bash
# Check if Java 17+ is available
java --version

# Check for missing environment variables
echo $OPENAI_API_KEY

# Check database connectivity
docker ps | grep postgres
```

**Common Causes**:
1. **Missing OpenAI API Key**: Set `OPENAI_API_KEY` environment variable or leave empty for demo mode
2. **Wrong Java Version**: Requires Java 17+ (Spring Boot 3.x requirement)
3. **Database not running**: Start with `docker-compose up postgres`
4. **Port conflicts**: Check if port 8080 is available

**Solution**: Ensure Java 21+, start database, and set optional environment variables

### Database Connection Issues
**Symptoms**: Backend starts but shows database connection errors

**Quick Diagnosis**:
```bash
# Check if PostgreSQL container is running
docker ps | grep postgres

# Test database connection
docker exec semantic-talent-finder-postgres psql -U postgres -d semantic_talent_finder -c "SELECT 1;"

# Check database port
lsof -i :5433
```

**Common Causes**:
1. **PostgreSQL not running**: Start with `docker-compose up postgres`
2. **Wrong port**: Default is 5433 (not standard 5432)
3. **Wrong credentials**: Check username/password in application.yml
4. **pgvector extension missing**: Ensure using `pgvector/pgvector:pg16` image

## 🚀 Resolution Timeline

### Immediate (Next 1-2 days)
- Fix TailwindCSS configuration or implement alternative
- Add basic styling to all components
- Ensure responsive design works

### Short Term (Next week)
- Complete component testing setup
- Implement error boundaries
- Add proper loading states

### Medium Term (Next month)
- Performance optimization
- Accessibility improvements
- E2E testing implementation
import React, { useState, useEffect } from 'react';
import './index.css';
import { realDataService } from './services/realDataService';
import { SearchResultsPage } from './components/SearchResultsPage';
import { Profile } from './components/SimpleDataTable';
import api from './services/api';
import SimpleRotatingText from './components/SimpleRotatingText';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'results'>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Check backend connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Use the profiles stats endpoint which has CORS enabled
        const response = await api.get('/profiles/stats');
        if (response.status === 200) {
          setIsConnected(true);
          setError(null); // Clear any previous errors when connection is successful
        } else {
          setIsConnected(false);
        }
      } catch (err) {
        console.error('Backend connection failed:', err);
        setIsConnected(false);
        // Don't set error for connection check - it's not a user action
      }
    };

    checkConnection();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    console.log('[DEBUG] Starting search with query:', query.trim());
    setIsSearching(true);
    setError(null);
    setSearchQuery(query.trim());
    
    try {
      // Use real data service with actual database profiles
      console.log('[DEBUG] Calling realDataService.searchProfiles...');
      const searchProfiles = await realDataService.searchProfiles(query.trim());
      console.log('[DEBUG] Search completed, received profiles:', searchProfiles.length);
      console.log('[DEBUG] Setting profiles state and navigating to results page');
      setProfiles(searchProfiles);
      setCurrentPage('results');
      
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.message || 'Search failed. Please try again.');
      setProfiles([]);
    } finally {
      setIsSearching(false);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setQuery('');
      setError(null);
    }
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setProfiles([]);
    setError(null);
    setQuery('');
  };

  // Render results page if we have search results
  if (currentPage === 'results') {
    return (
      <SearchResultsPage
        profiles={profiles}
        searchQuery={searchQuery}
        loading={isSearching}
        onBackToHome={handleBackToHome}
      />
    );
  }

  // Render home page
  return (
    <div className="home-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-text">
              <SimpleRotatingText
                texts={['Semantic Talent Finder', 'AI-Powered Search', 'Find Perfect Talent', 'Smart Recruiting']}
                rotationInterval={3000}
              />
            </div>
          </div>
          <div className="status-indicator">
            <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
            <span className="status-text">
              {isConnected ? 'Connected to database' : 'Backend disconnected'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Find the Perfect Talent
          </h1>
          <p className="hero-subtitle">
            AI-powered semantic search across 51M+ professional profiles
          </p>

          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-container">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="search-input"
                  placeholder={isSearching ? "Searching..." : "Search for talent... (e.g., senior Java developer with AWS experience)"}
                  disabled={isSearching}
                  autoFocus
                />
                <button 
                  type="submit" 
                  className="search-button"
                  disabled={isSearching || !query.trim()}
                >
                  {isSearching ? (
                    <div className="spinner"></div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path 
                        d="M21 21L16.514 16.506M19 10.5A8.5 8.5 0 1 1 10.5 2A8.5 8.5 0 0 1 19 10.5Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
              
              <div className="search-hints">
                Press Enter to search • ESC to clear
              </div>
            </form>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <div className="error-icon">⚠</div>
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
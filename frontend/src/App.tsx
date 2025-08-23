import React, { useState, useEffect } from 'react';
import './index.css';
import { LetterGlitch, AdvancedTextType, ShinyText } from './components/reactbits';
import { searchService, ProfileSummary, SearchRequest } from './services/searchService';
import api from './services/api';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProfileSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check backend connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Use the profiles stats endpoint which has CORS enabled
        const response = await api.get('/profiles/stats');
        if (response.status === 200) {
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      const searchRequest: SearchRequest = {
        query: query.trim(),
        limit: 50,
        threshold: 0.7
      };
      
      const result = await searchService.searchProfiles(searchRequest);
      setSearchResults(result.profiles);
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.message || 'Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setQuery('');
      setSearchResults([]);
      setError(null);
    }
  };

  return (
    <div className="app-container">
      {/* Animated Background */}
      <div className="background-layer">
        <LetterGlitch 
          glitchColors={['#0a4a3a', '#61dca3', '#61b3dc', '#1a5a4a']}
          glitchSpeed={75}
          outerVignette={true}
          centerVignette={false}
          smooth={true}
        />
      </div>

      {/* Main Content */}
      <div className="content-layer">
        <div className="search-container">
          <div className="header">
            <AdvancedTextType
              text="Semantic Talent Finder"
              as="h1"
              className="title"
              typingSpeed={100}
              showCursor={false}
              loop={false}
            />
            <p className="subtitle">
              AI-powered semantic search across 51M+ professional profiles
            </p>
            <div className="status-indicator">
              <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
              <span className="status-text">
                {isConnected ? 'Connected to database' : 'Backend disconnected'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-container">
              {!query && (
                <div className="search-placeholder">
                  <ShinyText 
                    text="Search for talent... (e.g., senior Java developer with AWS experience)"
                    speed={3}
                  />
                </div>
              )}
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="search-input"
                placeholder=""
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
              <span>Press Enter to search • ESC to clear</span>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <div className="error-icon">⚠</div>
              <span>{error}</span>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="results-container">
              <div className="results-header">
                <h2 className="results-title">
                  Found {searchResults.length} matching profiles
                </h2>
              </div>
              
              <div className="results-list">
                {searchResults.map((profile, index) => (
                  <div key={profile.id} className="result-card">
                    <div className="result-header">
                      <h3 className="profile-name">{profile.fullName}</h3>
                      <div className="similarity-score">
                        {Math.round(profile.similarityScore * 100)}% match
                      </div>
                    </div>
                    
                    <div className="profile-details">
                      <p className="job-title">{profile.headline}</p>
                      <p className="company">{profile.companyName}</p>
                      <p className="location">{profile.location}</p>
                    </div>
                    
                    {profile.matchingSkills.length > 0 && (
                      <div className="skills-section">
                        <span className="skills-label">Matching Skills:</span>
                        <div className="skills-list">
                          {profile.matchingSkills.slice(0, 6).map((skill, skillIndex) => (
                            <span key={skillIndex} className="skill-tag">
                              {skill}
                            </span>
                          ))}
                          {profile.matchingSkills.length > 6 && (
                            <span className="skill-tag more">
                              +{profile.matchingSkills.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
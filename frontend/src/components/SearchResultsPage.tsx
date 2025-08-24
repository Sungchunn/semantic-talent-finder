import React from 'react';
import { Profile } from './SimpleDataTable';

interface SearchResultsPageProps {
  profiles: Profile[];
  searchQuery: string;
  loading: boolean;
  onBackToHome: () => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  profiles,
  searchQuery,
  loading,
  onBackToHome
}) => {
  if (loading) {
    return (
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <div className="logo">
              <div className="logo-text">Semantic Talent Finder</div>
            </div>
            <div className="status-indicator">
              <div className="status-dot connected"></div>
              <span className="status-text">Searching...</span>
            </div>
          </div>
        </header>

        <div className="main-content">
          <div className="results-section">
            <div className="results-header">
              <h2 className="results-title">Searching for talent...</h2>
              <div className="results-meta">
                <span className="results-count">Please wait while we find the best matches</span>
              </div>
            </div>
            
            <div className="profiles-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="loading-card">
                  <div className="loading-line long loading-skeleton"></div>
                  <div className="loading-line medium loading-skeleton"></div>
                  <div className="loading-line short loading-skeleton"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-text">Semantic Talent Finder</div>
          </div>
          <div className="status-indicator">
            <div className="status-dot connected"></div>
            <span className="status-text">Connected to database</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        <div className="results-section">
          <div className="results-header">
            <h2 className="results-title">Search Results</h2>
            <div className="results-meta">
              <span className="results-count">
                Found {profiles.length} professional{profiles.length !== 1 ? 's' : ''} matching
              </span>
              <span className="results-query">{searchQuery}</span>
              <button onClick={onBackToHome} className="back-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M19 12H5M5 12L12 19M5 12L12 5" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                New Search
              </button>
            </div>
          </div>

          {profiles.length === 0 ? (
            <div className="profiles-grid">
              <div className="profile-card text-center" style={{ padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-gray-600)' }}>No results found</h3>
                <p style={{ color: 'var(--color-gray-500)' }}>
                  Try adjusting your search terms or searching for different skills or job titles.
                </p>
              </div>
            </div>
          ) : (
            <div className="profiles-grid">
              {profiles.map((profile, index) => (
                <div key={profile.id || index} className="profile-card">
                  <div className="profile-header">
                    <div>
                      <h3 className="profile-name">{profile.fullName || 'N/A'}</h3>
                      <div className="profile-title">{profile.jobTitle || 'N/A'}</div>
                      <div className="profile-company">{profile.companyName || 'N/A'}</div>
                      <div className="profile-location">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.6 }}>
                          <path 
                            d="M21 10C21 17L12 23L3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        {profile.location || 'N/A'}
                      </div>
                    </div>
                    {profile.industry && (
                      <div className="profile-industry">
                        {profile.industry}
                      </div>
                    )}
                  </div>

                  {profile.summary && (
                    <div className="profile-details" style={{ marginBottom: '1rem' }}>
                      <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                        {profile.summary.length > 200 ? profile.summary.substring(0, 200) + '...' : profile.summary}
                      </p>
                    </div>
                  )}

                  {profile.skills && profile.skills.length > 0 && (
                    <div className="skills-section">
                      <span className="skills-label">Skills</span>
                      <div className="skills-list">
                        {profile.skills.slice(0, 8).map((skill, skillIndex) => (
                          <span key={skillIndex} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                        {profile.skills.length > 8 && (
                          <span className="skill-tag" style={{ opacity: 0.7 }}>
                            +{profile.skills.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {profile.linkedinUrl && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-gray-200)' }}>
                      <a 
                        href={profile.linkedinUrl.startsWith('http') ? profile.linkedinUrl : `https://${profile.linkedinUrl}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: 'var(--color-primary)', 
                          textDecoration: 'none', 
                          fontSize: 'var(--text-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-1)'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        View LinkedIn Profile
                      </a>
                    </div>
                  )}

                  {profile.importBatchId && (
                    <div style={{ 
                      marginTop: '1rem', 
                      fontSize: 'var(--text-xs)', 
                      color: 'var(--color-gray-400)',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      ID: {profile.importBatchId}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
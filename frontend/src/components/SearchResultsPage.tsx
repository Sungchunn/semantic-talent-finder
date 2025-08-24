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
            <div className="no-results">
              <div className="no-results-content">
                <div className="no-results-icon">🔍</div>
                <h3 className="no-results-title">No results found</h3>
                <p className="no-results-text">
                  Try adjusting your search terms or searching for different skills or job titles.
                </p>
              </div>
            </div>
          ) : (
            <div className="sql-table-container">
              <div className="table-info">
                <span className="results-count">{profiles.length} rows returned</span>
              </div>
              <div className="sql-table-wrapper">
                <table className="sql-table">
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Location</th>
                      <th>Locality</th>
                      <th>Region</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>LinkedIn URL</th>
                      <th>LinkedIn Username</th>
                      <th>Location Country</th>
                      <th>Location Continent</th>
                      <th>Industry</th>
                      <th>Job Title</th>
                      <th>Metro</th>
                      <th>Gender</th>
                      <th>Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile, index) => (
                      <tr key={profile.id || index}>
                        <td className="name-cell">{profile.fullName || 'NULL'}</td>
                        <td>{profile.location || 'NULL'}</td>
                        <td>{profile.locality || 'NULL'}</td>
                        <td>{profile.region || 'NULL'}</td>
                        <td>{profile.firstName || 'NULL'}</td>
                        <td>{profile.lastName || 'NULL'}</td>
                        <td className="linkedin-cell">
                          {profile.linkedinUrl ? (
                            <a 
                              href={profile.linkedinUrl.startsWith('http') ? profile.linkedinUrl : `https://${profile.linkedinUrl}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="linkedin-link"
                            >
                              {profile.linkedinUrl.length > 30 ? profile.linkedinUrl.substring(0, 30) + '...' : profile.linkedinUrl}
                            </a>
                          ) : (
                            'NULL'
                          )}
                        </td>
                        <td>{profile.linkedinUsername || 'NULL'}</td>
                        <td>{profile.locationCountry || 'NULL'}</td>
                        <td>{profile.locationContinent || 'NULL'}</td>
                        <td>{profile.industry || 'NULL'}</td>
                        <td>{profile.jobTitle || 'NULL'}</td>
                        <td>{profile.metro || 'NULL'}</td>
                        <td>{profile.gender || 'NULL'}</td>
                        <td>{profile.lastUpdated || 'NULL'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
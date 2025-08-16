import React, { useState } from 'react';
import './index.css';
import { 
  FaultyTerminal,
  TextType,
  DecryptedText,
  ASCIIArt
} from './components/reactbits';

const semanticTalentFinderLogo = `
 ███████╗███████╗███╗   ███╗ █████╗ ███╗   ██╗████████╗██╗ ██████╗
 ██╔════╝██╔════╝████╗ ████║██╔══██╗████╗  ██║╚══██╔══╝██║██╔════╝
 ███████╗█████╗  ██╔████╔██║███████║██╔██╗ ██║   ██║   ██║██║     
 ╚════██║██╔══╝  ██║╚██╔╝██║██╔══██║██║╚██╗██║   ██║   ██║██║     
 ███████║███████╗██║ ╚═╝ ██║██║  ██║██║ ╚████║   ██║   ██║╚██████╗
 ╚══════╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝ ╚═════╝

████████╗ █████╗ ██╗     ███████╗███╗   ██╗████████╗    ███████╗██╗███╗   ██╗██████╗ ███████╗██████╗ 
╚══██╔══╝██╔══██╗██║     ██╔════╝████╗  ██║╚══██╔══╝    ██╔════╝██║████╗  ██║██╔══██╗██╔════╝██╔══██╗
   ██║   ███████║██║     █████╗  ██╔██╗ ██║   ██║       █████╗  ██║██╔██╗ ██║██║  ██║█████╗  ██████╔╝
   ██║   ██╔══██║██║     ██╔══╝  ██║╚██╗██║   ██║       ██╔══╝  ██║██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗
   ██║   ██║  ██║███████╗███████╗██║ ╚████║   ██║       ██║     ██║██║ ╚████║██████╔╝███████╗██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝       ╚═╝     ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝
`;

interface SearchResult {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  skills: string[];
  similarityScore: number;
  dataQualityScore: number;
}

const App: React.FC = () => {
  const [bootStage, setBootStage] = useState(0);
  const [systemReady, setSystemReady] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showHelp, setShowHelp] = useState(false);

  // Sample search results for demo
  const sampleResults: SearchResult[] = [
    {
      id: '1',
      name: 'John Smith',
      title: 'Senior Java Developer',
      company: 'Goldman Sachs',
      location: 'New York, NY',
      skills: ['Java', 'Spring Boot', 'Microservices', 'AWS'],
      similarityScore: 94,
      dataQualityScore: 0.87
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      title: 'Java Tech Lead',
      company: 'JPMorgan Chase',
      location: 'London, UK',
      skills: ['Java', 'Kubernetes', 'PostgreSQL', 'React'],
      similarityScore: 91,
      dataQualityScore: 0.92
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      title: 'Principal Software Engineer',
      company: 'Barclays',
      location: 'Singapore',
      skills: ['Java', 'Spring', 'Docker', 'Jenkins'],
      similarityScore: 88,
      dataQualityScore: 0.85
    }
  ];

  // Handle search
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setCommandHistory(prev => [searchQuery, ...prev.slice(0, 19)]); // Keep last 20 commands
    
    // Simulate API call
    setTimeout(() => {
      setSearchResults(sampleResults);
      setIsSearching(false);
    }, 2000);
  };

  // Handle command input
  const handleCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();
    
    if (cmd === 'help') {
      setShowHelp(true);
      return;
    }
    
    if (cmd === 'clear') {
      setSearchResults([]);
      setShowHelp(false);
      return;
    }
    
    if (cmd.startsWith('export csv')) {
      exportToCsv();
      return;
    }
    
    // Default: treat as search query
    handleSearch(command);
  };

  // Export functionality
  const exportToCsv = () => {
    if (searchResults.length === 0) {
      console.log('No search results to export');
      return;
    }

    const csvContent = [
      'Name,Title,Company,Location,Skills,Similarity Score,Data Quality Score',
      ...searchResults.map(result => 
        `"${result.name}","${result.title}","${result.company}","${result.location}","${result.skills.join('; ')}","${result.similarityScore}%","${Math.round(result.dataQualityScore * 100)}%"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'semantic_search_results.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(query);
      setQuery('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setQuery(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setQuery(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setQuery('');
      }
    }
  };

  return (
    <div className="terminal-app">
      <FaultyTerminal 
        theme="green"
        scanlines={true}
        glow={true}
        flicker={false}
      />
      
      <div className="terminal-window">
        {/* Boot Sequence */}
        {!systemReady && (
          <>
            {bootStage >= 0 && (
              <div className="terminal-header">
                <TextType 
                  text="Semantic Talent Finder v2.5.1 - AI Search Terminal"
                  className="terminal-title"
                  speed={50}
                  onComplete={() => setBootStage(1)}
                />
              </div>
            )}
            
            {bootStage >= 1 && (
              <TextType 
                text="Connected to database: 51,352,619 profiles loaded"
                className="terminal-status"
                speed={30}
                delay={500}
                onComplete={() => setBootStage(2)}
              />
            )}
            
            {bootStage >= 2 && (
              <DecryptedText 
                text="Vector index: ONLINE | Search latency: <500ms"
                className="terminal-status"
                delay={300}
                onComplete={() => setBootStage(3)}
              />
            )}
            
            {bootStage >= 3 && (
              <ASCIIArt 
                art={semanticTalentFinderLogo}
                className="ascii-art"
                animate={true}
                speed={20}
                onComplete={() => setBootStage(4)}
              />
            )}
            
            {bootStage >= 4 && (
              <TextType 
                text="System initialized. Ready for natural language talent queries.
Type 'help' for commands or enter search query directly."
                className="system-message"
                speed={40}
                delay={500}
                onComplete={() => setSystemReady(true)}
              />
            )}
          </>
        )}

        {/* Main Terminal Interface */}
        {systemReady && (
          <>
            {/* Help Section */}
            {showHelp && (
              <div className="help-section">
                <div className="help-title">Commands:</div>
                <div className="command-list">
                  <div className="command-item">
                    <span className="command-name">search &lt;query&gt;</span>
                    <span className="command-description">Natural language talent search</span>
                  </div>
                  <div className="command-item">
                    <span className="command-name">export csv</span>
                    <span className="command-description">Export current results to CSV</span>
                  </div>
                  <div className="command-item">
                    <span className="command-name">clear</span>
                    <span className="command-description">Clear terminal</span>
                  </div>
                  <div className="command-item">
                    <span className="command-name">help</span>
                    <span className="command-description">Show this help menu</span>
                  </div>
                </div>
              </div>
            )}

            {/* Search Processing */}
            {isSearching && (
              <div className="processing-section">
                <TextType 
                  text={`> Searching for: "${commandHistory[0]}"`}
                  className="result-header"
                  speed={30}
                />
                <DecryptedText 
                  text="Processing query through AI semantic matching..."
                  className="processing-message"
                  delay={500}
                />
                <DecryptedText 
                  text="Vector similarity search completed in 342ms"
                  className="processing-message"
                  delay={1500}
                />
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && !isSearching && (
              <div className="search-results">
                <TextType 
                  text={`> Found ${searchResults.length} matching profiles`}
                  className="result-header"
                  speed={20}
                />
                
                <div className="results-container">
                  {searchResults.map((result, index) => (
                    <div key={result.id} className="result-item">
                      <div className="result-line">
                        <span className="result-id">[{index + 1}]</span>
                        <span className="result-title"> {result.name}</span>
                        <span className="result-match">Match: {result.similarityScore}%</span>
                      </div>
                      <div className="result-line">
                        <span className="result-company">     {result.title} @ {result.company}</span>
                      </div>
                      <div className="result-line">
                        <span className="result-details">     Location: {result.location} | Experience: Senior level</span>
                      </div>
                      <div className="result-line">
                        <span className="result-details">     Skills: {result.skills.join(', ')}</span>
                      </div>
                      <div className="result-line">
                        <span className="result-details">     Quality Score: {Math.round(result.dataQualityScore * 100)}% | LinkedIn: /in/{result.name.toLowerCase().replace(' ', '')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Command Input */}
            <div className="command-prompt">
              <span className="prompt-prefix">stf@ai-search:~$</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="command-input"
                placeholder="Enter search query or command..."
                autoFocus
              />
              <span className="terminal-cursor"></span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
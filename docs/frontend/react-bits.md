# React Bits Components for Terminal Interface

## 🖥️ Terminal Component Library Overview

React Bits components have been adapted for the Semantic Talent Finder terminal interface to create an authentic command-line experience. These components simulate retro computing aesthetics while providing modern functionality for AI-powered talent search.

## 🎬 Terminal Animation Components

### **TextType Component**
**Purpose**: Creates authentic typewriter effects that simulate terminal text output character by character.

**Usage in Terminal Interface**:
- System startup messages
- Search processing status
- Command responses and results
- Help text and instructions

**Example Implementation**:
```jsx
<TextType 
  text="Semantic Talent Finder v2.5.1 - AI Search Terminal"
  className="terminal-header"
  speed={50}
  delay={500}
  showCursor={true}
  onComplete={() => setSystemReady(true)}
/>
```

**Props**:
- `text` (string): The text content to type out
- `className` (string): CSS classes for terminal styling
- `speed` (number): Typing speed in ms per character (default: 50)
- `delay` (number): Initial delay before typing starts (ms)
- `showCursor` (boolean): Whether to show blinking cursor during typing
- `onComplete` (function): Callback when typing animation completes
- `preserveWhitespace` (boolean): Maintain original spacing and line breaks

### **DecryptedText Component**
**Purpose**: Creates matrix-style decryption effects for loading states and data processing animations.

**Usage in Terminal Interface**:
- AI processing indicators
- Database connection status
- Search query analysis
- Data loading states

**Example Implementation**:
```jsx
<DecryptedText 
  text="Processing query through AI semantic matching..."
  className="processing-message"
  scrambleChars="01"
  iterations={3}
  interval={100}
  onComplete={() => setProcessingComplete(true)}
/>
```

**Props**:
- `text` (string): Final decrypted text to display
- `className` (string): CSS classes for styling
- `scrambleChars` (string): Characters to use for scrambling effect (default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()')
- `iterations` (number): Number of scramble iterations before revealing
- `interval` (number): Speed of character changes (ms)
- `onComplete` (function): Callback when decryption completes

### **FaultyTerminal Component**
**Purpose**: Creates authentic CRT terminal background with scanlines, glow effects, and retro aesthetics.

**Usage in Terminal Interface**:
- Main application background
- Terminal window container
- CRT visual effects overlay
- Retro computing atmosphere

**Example Implementation**:
```jsx
<FaultyTerminal 
  className="app-background"
  scanlines={true}
  glow={true}
  flicker={false}
  theme="green"
  curvature={0.1}
/>
```

**Props**:
- `className` (string): CSS classes for styling
- `scanlines` (boolean): Enable horizontal scanline effect (default: true)
- `glow` (boolean): Enable screen glow effect (default: true)
- `flicker` (boolean): Enable subtle screen flicker (default: false)
- `theme` (string): Color theme ('green', 'amber', 'blue') (default: 'green')
- `curvature` (number): Screen curvature amount 0-1 (default: 0.05)
- `noise` (boolean): Add CRT noise texture (default: false)

### **LetterGlitch Component**
**Purpose**: Creates subtle matrix-style background effects with falling characters.

**Usage in Terminal Interface**:
- Background ambient effects
- Loading screen overlays
- Transition animations
- Subtle motion graphics

**Example Implementation**:
```jsx
<LetterGlitch 
  className="background-effect"
  characters="01"
  density={0.1}
  speed="slow"
  color="rgba(0, 255, 0, 0.1)"
/>
```

**Props**:
- `className` (string): CSS classes for styling
- `characters` (string): Characters to use in effect (default: '01')
- `density` (number): Number of falling characters 0-1 (default: 0.05)
- `speed` (string): Animation speed ('slow', 'medium', 'fast') (default: 'medium')
- `color` (string): Color of the characters (default: 'rgba(0, 255, 0, 0.1)')
- `direction` (string): Direction of movement ('down', 'up', 'random') (default: 'down')

## 🎮 Terminal-Specific Components

### **TerminalCursor Component**
**Purpose**: Provides authentic terminal cursor with customizable blinking behavior.

**Example Implementation**:
```jsx
<TerminalCursor 
  className="command-cursor"
  style="block"
  blinkSpeed={1000}
  color="#00ff00"
/>
```

**Props**:
- `className` (string): CSS classes for styling
- `style` (string): Cursor style ('block', 'underscore', 'pipe') (default: 'block')
- `blinkSpeed` (number): Blink interval in ms (default: 1000)
- `color` (string): Cursor color (default: currentColor)
- `show` (boolean): Whether cursor is visible (default: true)

### **ASCIIArt Component**
**Purpose**: Displays ASCII art with typewriter animation support.

**Example Implementation**:
```jsx
<ASCIIArt 
  art={semanticTalentFinderLogo}
  className="terminal-logo"
  animate={true}
  speed={20}
  centered={true}
/>
```

**Props**:
- `art` (string): ASCII art content (multiline string)
- `className` (string): CSS classes for styling
- `animate` (boolean): Whether to animate the reveal (default: false)
- `speed` (number): Animation speed in ms per character (default: 50)
- `centered` (boolean): Center the ASCII art (default: true)
- `preserveSpacing` (boolean): Maintain exact spacing (default: true)

### **CommandHistory Component**
**Purpose**: Manages and displays terminal command history with navigation.

**Example Implementation**:
```jsx
<CommandHistory 
  commands={commandHistory}
  maxVisible={100}
  className="command-history"
  onCommandSelect={(cmd) => setCurrentCommand(cmd)}
/>
```

**Props**:
- `commands` (array): Array of command objects with text and timestamp
- `maxVisible` (number): Maximum commands to display (default: 50)
- `className` (string): CSS classes for styling
- `onCommandSelect` (function): Callback when command is selected from history
- `showTimestamps` (boolean): Display command timestamps (default: false)

## 📋 Terminal Application Patterns

### **System Boot Sequence**
```jsx
const BootSequence = () => {
  const [stage, setStage] = useState(0);
  
  return (
    <div className="terminal-window">
      <FaultyTerminal theme="green" scanlines={true} />
      
      {stage >= 0 && (
        <TextType 
          text="Initializing Semantic Talent Finder..."
          onComplete={() => setStage(1)}
        />
      )}
      
      {stage >= 1 && (
        <TextType 
          text="Loading 51,352,619 professional profiles..."
          delay={500}
          onComplete={() => setStage(2)}
        />
      )}
      
      {stage >= 2 && (
        <DecryptedText 
          text="Vector index: ONLINE"
          delay={300}
          onComplete={() => setStage(3)}
        />
      )}
      
      {stage >= 3 && (
        <ASCIIArt 
          art={logoArt}
          animate={true}
          onComplete={() => setSystemReady(true)}
        />
      )}
    </div>
  );
};
```

### **Search Interface Pattern**
```jsx
const SearchInterface = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [processing, setProcessing] = useState(false);
  
  return (
    <div className="search-interface">
      <div className="command-prompt">
        <span className="prompt-prefix">stf@ai-search:~$</span>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="command-input"
          onKeyPress={handleSearch}
        />
        <TerminalCursor show={!processing} />
      </div>
      
      {processing && (
        <DecryptedText 
          text="Analyzing query through AI semantic engine..."
          className="processing-message"
        />
      )}
      
      {results.length > 0 && (
        <SearchResults 
          results={results}
          className="search-results"
        />
      )}
    </div>
  );
};
```

### **Results Display Pattern**
```jsx
const SearchResults = ({ results }) => {
  return (
    <div className="search-results">
      <TextType 
        text={`> Found ${results.length} matching profiles`}
        className="result-header"
        speed={30}
      />
      
      <div className="results-container">
        {results.map((result, index) => (
          <div key={result.id} className="result-item">
            <TextType 
              text={`[${index + 1}] ${result.name}`}
              className="result-title"
              delay={index * 100}
              speed={20}
            />
            <div className="result-details">
              <span className="result-company">{result.company}</span>
              <span className="result-match">Match: {result.similarity}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 🎬 Terminal Animation Coordination

### **System Startup Sequence**
1. **FaultyTerminal** (0s): Background and CRT effects appear
2. **TextType** (0.5s): System initialization messages
3. **DecryptedText** (2s): Database connection status
4. **ASCIIArt** (3s): Logo reveals with animation
5. **TextType** (5s): System ready message and prompt

### **Search Flow Animation**
1. **TextType** (0s): User query appears in terminal
2. **DecryptedText** (0.5s): Processing status updates
3. **TextType** (2s): Results header with count
4. **Staggered TextType** (2.5s): Individual results appear
5. **TerminalCursor** (continuous): Returns to command prompt

### **Command Processing**
- **Input**: Real-time character appearance
- **Processing**: Matrix-style decryption effects
- **Output**: Typewriter-style result display
- **Feedback**: Immediate visual confirmation

## 📱 Terminal Responsive Behavior

### **Mobile Terminal (320px-767px)**
- **Smaller font sizes**: Maintain readability
- **Simplified effects**: Reduce CRT effects for performance
- **Touch-friendly**: Larger input areas
- **Scrollable history**: Vertical command history

### **Tablet Terminal (768px-1023px)**
- **Medium effects**: Balanced performance and aesthetics
- **Grid layouts**: Two-column result displays
- **Touch interactions**: Tap to select commands
- **Landscape optimization**: Full-width terminal

### **Desktop Terminal (1024px+)**
- **Full effects**: Complete CRT and glow effects
- **Keyboard shortcuts**: Full terminal navigation
- **Multiple columns**: Side-by-side result display
- **Advanced features**: Command completion and history search

## ⚡ Performance Optimization

### **Animation Management**
- **RAF optimization**: Use requestAnimationFrame for smooth animations
- **Intersection Observer**: Only animate visible components
- **Text chunking**: Process large text blocks efficiently
- **Memory cleanup**: Dispose of animation references

### **Terminal Rendering**
- **Virtual scrolling**: Handle large command histories
- **Canvas optimization**: Efficient CRT effect rendering
- **Text caching**: Cache rendered terminal content
- **GPU acceleration**: Hardware-accelerated effects when available

## 🎯 Best Practices

### **Component Composition**
```jsx
// Recommended terminal layout structure
<div className="terminal-app">
  <FaultyTerminal className="terminal-background" />
  <LetterGlitch className="ambient-effects" />
  
  <div className="terminal-content">
    <ASCIIArt art={headerArt} className="terminal-header" />
    <CommandHistory commands={history} />
    <SearchInterface />
    <TerminalCursor />
  </div>
</div>
```

### **Animation Guidelines**
- **Stagger delays**: 50-100ms between elements
- **Consistent timing**: Use standard durations (50ms typing speed)
- **Performance limits**: Maximum 5 concurrent animations
- **Fallback support**: Graceful degradation for older browsers

### **Accessibility Considerations**
- **Screen reader support**: Provide text alternatives
- **Keyboard navigation**: Full keyboard accessibility
- **Motion preferences**: Respect reduced motion settings
- **Color contrast**: Ensure terminal colors meet WCAG standards
- **Focus indicators**: Clear visual focus states
# Terminal Design System

## 🖥️ Design Philosophy

The Semantic Talent Finder uses a **retro terminal interface** that simulates an authentic command-line experience for AI-powered talent search. This design emphasizes the technical sophistication of our 51M+ profile search system while providing a focused, developer-friendly interface without distractions.

## 🎨 Terminal Theme: Retro Computing

### Core Aesthetic
- **Authentic terminal emulator interface** with CRT effects
- **Monospace typography** throughout the application
- **Green-on-black or amber-on-black** color schemes
- **Scanlines and subtle glow effects** for retro computing feel
- **Single-page terminal session** workflow

## 🌈 Terminal Color Palette

### Primary Terminal Colors (Green Theme)
```css
--color-terminal-bg: #0a0a0a;        /* Deep black terminal background */
--color-terminal-primary: #00ff00;   /* Bright green terminal text */
--color-terminal-secondary: #00aa00; /* Dim green for less important content */
--color-terminal-cursor: #00ff00;    /* Blinking green cursor */
```

### Alternative Amber Theme
```css
--color-terminal-bg: #0a0a0a;        /* Deep black terminal background */
--color-terminal-primary: #ffb000;   /* Bright amber terminal text */
--color-terminal-secondary: #cc8800; /* Dim amber for secondary content */
--color-terminal-cursor: #ffb000;    /* Blinking amber cursor */
```

### System Status Colors
```css
--color-success: #44ff44;      /* Bright green for successful operations */
--color-error: #ff4444;        /* Red for errors and failures */
--color-warning: #ffff44;      /* Yellow for warnings and cautions */
--color-info: #4488ff;         /* Blue for system information and prompts */
--color-processing: #ff8844;   /* Orange for loading and processing states */
--color-comment: #888888;      /* Gray for comments and metadata */
```

### CRT Visual Effects
```css
--terminal-glow: 0 0 10px currentColor;           /* Text glow effect */
--terminal-screen-glow: 0 0 20px var(--color-terminal-primary); /* Screen outer glow */
--terminal-scanline: linear-gradient(transparent 50%, rgba(0, 255, 0, 0.03) 50%); /* Scanlines */
```

## 📝 Typography System

### Font Stack
```css
--font-family-terminal: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, 'Courier New', monospace;
```

### Font Sizes (Terminal Scale)
```css
--text-terminal-xs: 12px;       /* Small system messages */
--text-terminal-sm: 14px;       /* Standard terminal text */
--text-terminal-base: 16px;     /* Primary terminal text */
--text-terminal-lg: 18px;       /* Headers and emphasis */
--text-terminal-xl: 20px;       /* ASCII art and titles */
--text-terminal-2xl: 24px;      /* Large ASCII headers */
```

### Line Height & Spacing
```css
--line-height-terminal: 1.4;    /* Readable terminal spacing */
--letter-spacing-terminal: 0.02em; /* Slight letter spacing for monospace */
```

## 🖥️ Terminal Interface Components

### Terminal Window Structure
```css
.terminal-window {
  background: var(--color-terminal-bg);
  color: var(--color-terminal-primary);
  font-family: var(--font-family-terminal);
  font-size: var(--text-terminal-base);
  line-height: var(--line-height-terminal);
  letter-spacing: var(--letter-spacing-terminal);
  padding: 20px;
  min-height: 100vh;
  position: relative;
  overflow-x: auto;
}

.terminal-window::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--terminal-scanline);
  pointer-events: none;
  z-index: 1;
}

.terminal-content {
  position: relative;
  z-index: 2;
  text-shadow: var(--terminal-glow);
}
```

### Terminal Header
```css
.terminal-header {
  border: 1px solid var(--color-terminal-primary);
  padding: 10px;
  margin-bottom: 20px;
  font-size: var(--text-terminal-sm);
}

.terminal-title {
  font-size: var(--text-terminal-lg);
  font-weight: bold;
  margin-bottom: 5px;
}

.terminal-status {
  color: var(--color-terminal-secondary);
  font-size: var(--text-terminal-xs);
}
```

### ASCII Art Styling
```css
.ascii-art {
  font-size: var(--text-terminal-sm);
  line-height: 1;
  white-space: pre;
  color: var(--color-terminal-primary);
  margin: 20px 0;
  text-align: center;
}

.ascii-logo {
  font-size: var(--text-terminal-xs);
  font-weight: bold;
}
```

### Command Interface
```css
.command-prompt {
  display: flex;
  align-items: center;
  margin: 10px 0;
  font-family: var(--font-family-terminal);
}

.prompt-prefix {
  color: var(--color-terminal-primary);
  margin-right: 8px;
  flex-shrink: 0;
}

.command-input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-terminal-primary);
  font-family: inherit;
  font-size: inherit;
  flex: 1;
  caret-color: var(--color-terminal-cursor);
}

.terminal-cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background: var(--color-terminal-cursor);
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

### Results Display
```css
.search-results {
  margin: 20px 0;
}

.result-header {
  color: var(--color-info);
  margin-bottom: 10px;
  font-size: var(--text-terminal-sm);
}

.result-item {
  border: 1px solid var(--color-terminal-secondary);
  margin: 5px 0;
  padding: 10px;
  background: rgba(0, 255, 0, 0.02);
}

.result-item:hover {
  background: rgba(0, 255, 0, 0.05);
  border-color: var(--color-terminal-primary);
}

.result-id {
  color: var(--color-terminal-primary);
  font-weight: bold;
}

.result-match {
  color: var(--color-success);
  float: right;
}

.result-title {
  color: var(--color-terminal-primary);
  font-weight: bold;
  margin: 2px 0;
}

.result-company {
  color: var(--color-terminal-secondary);
  font-size: var(--text-terminal-sm);
}

.result-details {
  color: var(--color-comment);
  font-size: var(--text-terminal-xs);
  margin-top: 5px;
}
```

### System Messages
```css
.system-message {
  color: var(--color-info);
  font-style: italic;
  margin: 5px 0;
}

.success-message {
  color: var(--color-success);
  margin: 5px 0;
}

.error-message {
  color: var(--color-error);
  margin: 5px 0;
}

.warning-message {
  color: var(--color-warning);
  margin: 5px 0;
}

.processing-message {
  color: var(--color-processing);
  margin: 5px 0;
}
```

### Help and Commands
```css
.help-section {
  margin: 20px 0;
  border: 1px solid var(--color-terminal-secondary);
  padding: 15px;
}

.help-title {
  color: var(--color-terminal-primary);
  font-weight: bold;
  margin-bottom: 10px;
}

.command-list {
  list-style: none;
  padding: 0;
}

.command-item {
  margin: 3px 0;
  display: flex;
}

.command-name {
  color: var(--color-terminal-primary);
  font-weight: bold;
  width: 120px;
  flex-shrink: 0;
}

.command-description {
  color: var(--color-terminal-secondary);
  flex: 1;
}
```

## 🎬 Terminal Animations

### Typewriter Effect
```css
@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}

.typewriter {
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid var(--color-terminal-cursor);
  animation: typewriter 2s steps(40) forwards,
             blink 1s infinite 2s;
}
```

### Text Reveal
```css
@keyframes textReveal {
  0% { 
    opacity: 0;
    transform: translateY(10px);
  }
  100% { 
    opacity: 1;
    transform: translateY(0);
  }
}

.text-reveal {
  animation: textReveal 0.5s ease-out forwards;
}
```

### Processing Animation
```css
@keyframes processing {
  0%, 20% { content: '|'; }
  21%, 40% { content: '/'; }
  41%, 60% { content: '─'; }
  61%, 80% { content: '\\'; }
  81%, 100% { content: '|'; }
}

.processing-spinner::after {
  content: '|';
  animation: processing 1s infinite;
  color: var(--color-processing);
}
```

## 📱 Responsive Terminal Design

### Mobile Terminal (320px-767px)
```css
@media (max-width: 767px) {
  .terminal-window {
    padding: 10px;
    font-size: var(--text-terminal-sm);
  }
  
  .ascii-art {
    font-size: 10px;
  }
  
  .result-item {
    padding: 8px;
  }
  
  .command-name {
    width: 100px;
  }
}
```

### Tablet Terminal (768px-1023px)
```css
@media (min-width: 768px) and (max-width: 1023px) {
  .terminal-window {
    padding: 15px;
  }
  
  .result-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 10px;
    align-items: center;
  }
}
```

### Desktop Terminal (1024px+)
```css
@media (min-width: 1024px) {
  .terminal-window {
    padding: 20px 40px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .result-item {
    display: grid;
    grid-template-columns: 60px 1fr auto;
    gap: 15px;
    align-items: center;
  }
  
  .terminal-window::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: radial-gradient(circle, rgba(0, 255, 0, 0.1) 0%, transparent 70%);
    border-radius: 10px;
    z-index: 0;
  }
}
```

## ⚡ Performance Considerations

### Animation Optimization
- Use `transform` and `opacity` for animations
- Limit simultaneous animations to maintain 60fps
- Implement `will-change` property for animated elements
- Use `requestAnimationFrame` for smooth custom animations

### Terminal Text Rendering
- Optimize for monospace font rendering
- Use text shadows sparingly to maintain performance
- Implement virtual scrolling for large result sets
- Cache rendered terminal content when possible

## 🎯 Implementation Priority

### Phase 1: Core Terminal Interface
1. Basic terminal window with CRT effects
2. Command prompt with blinking cursor
3. System messages and status display
4. ASCII art logo and headers

### Phase 2: Search Integration
1. Natural language search input
2. Results display in terminal format
3. Command history navigation
4. Auto-complete functionality

### Phase 3: Advanced Features
1. CSV/JSON export commands
2. Profile detail views
3. Search statistics and analytics
4. Terminal customization options

### Phase 4: Polish & Effects
1. Enhanced CRT visual effects
2. Sound effects (optional)
3. Terminal themes (green/amber)
4. Accessibility improvements
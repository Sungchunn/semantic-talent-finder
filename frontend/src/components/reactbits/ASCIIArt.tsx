import React, { useState, useEffect, useRef } from 'react';

interface ASCIIArtProps {
  art?: string;
  className?: string;
  animate?: boolean;
  speed?: number;
  centered?: boolean;
  preserveSpacing?: boolean;
  onComplete?: () => void;
  startOnMount?: boolean;
}

const ASCIIArt: React.FC<ASCIIArtProps> = ({ 
  art = '',
  className = '',
  animate = false,
  speed = 50,
  centered = true,
  preserveSpacing = true,
  onComplete,
  startOnMount = true
}) => {
  const [displayLines, setDisplayLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const lines = art.split('\n');

  const startAnimation = () => {
    if (isAnimating || isComplete) return;
    
    setIsAnimating(true);
    setDisplayLines([]);
    setCurrentLine(0);
    
    const animateLines = (lineIndex: number) => {
      if (lineIndex >= lines.length) {
        setIsAnimating(false);
        setIsComplete(true);
        if (onComplete) {
          setTimeout(onComplete, 100);
        }
        return;
      }
      
      setDisplayLines(prev => [...prev, lines[lineIndex]]);
      setCurrentLine(lineIndex + 1);
      
      timeoutRef.current = setTimeout(() => {
        animateLines(lineIndex + 1);
      }, speed);
    };
    
    animateLines(0);
  };

  const reset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDisplayLines([]);
    setCurrentLine(0);
    setIsAnimating(false);
    setIsComplete(false);
  };

  useEffect(() => {
    if (animate && startOnMount) {
      startAnimation();
    } else if (!animate) {
      setDisplayLines(lines);
      setIsComplete(true);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [art, animate, startOnMount]);

  // Handle art changes
  useEffect(() => {
    reset();
    if (animate && startOnMount) {
      startAnimation();
    } else if (!animate) {
      setDisplayLines(lines);
      setIsComplete(true);
    }
  }, [art]);

  const containerStyle: React.CSSProperties = {
    fontFamily: 'monospace',
    whiteSpace: preserveSpacing ? 'pre' : 'pre-wrap',
    lineHeight: '1',
    ...(centered && {
      textAlign: 'center'
    })
  };

  const renderContent = () => {
    if (!animate) {
      return art;
    }
    
    return displayLines.join('\n');
  };

  return (
    <div 
      className={`ascii-art ${className}`}
      style={containerStyle}
    >
      {renderContent()}
    </div>
  );
};


ASCIIArt.displayName = 'ASCIIArt';

export default ASCIIArt;
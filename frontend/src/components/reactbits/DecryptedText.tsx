import React, { useState, useEffect, useRef } from 'react';

interface DecryptedTextProps {
  text?: string;
  className?: string;
  scrambleChars?: string;
  iterations?: number;
  interval?: number;
  delay?: number;
  onComplete?: () => void;
  startOnMount?: boolean;
}

const DecryptedText: React.FC<DecryptedTextProps> = ({ 
  text = '',
  className = '',
  scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()',
  iterations = 3,
  interval = 100,
  delay = 0,
  onComplete,
  startOnMount = true
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomChar = () => {
    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
  };

  const scrambleText = (targetText: string, revealedLength: number) => {
    return targetText
      .split('')
      .map((char, index) => {
        if (index < revealedLength) {
          return char; // Already revealed
        }
        if (char === ' ') {
          return ' '; // Preserve spaces
        }
        return getRandomChar(); // Scramble remaining characters
      })
      .join('');
  };

  const startDecryption = () => {
    if (isDecrypting || isComplete) return;
    
    setIsDecrypting(true);
    setDisplayText(scrambleText(text, 0));
    
    let currentIteration = 0;
    let revealedChars = 0;
    
    intervalRef.current = setInterval(() => {
      currentIteration++;
      
      // Gradually reveal characters
      if (currentIteration % iterations === 0) {
        revealedChars++;
      }
      
      if (revealedChars >= text.length) {
        setDisplayText(text);
        setIsDecrypting(false);
        setIsComplete(true);
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        if (onComplete) {
          setTimeout(onComplete, 100);
        }
        
        return;
      }
      
      setDisplayText(scrambleText(text, revealedChars));
    }, interval);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setDisplayText('');
    setIsDecrypting(false);
    setIsComplete(false);
  };

  useEffect(() => {
    if (startOnMount && text) {
      if (delay > 0) {
        timeoutRef.current = setTimeout(startDecryption, delay);
      } else {
        startDecryption();
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, startOnMount, delay]);

  // Handle text changes
  useEffect(() => {
    reset();
    if (startOnMount && text) {
      timeoutRef.current = setTimeout(startDecryption, 50);
    }
  }, [text]);

  return (
    <span 
      className={`decrypted-text ${className}`}
      style={{
        fontFamily: 'monospace',
        letterSpacing: '0.1em'
      }}
    >
      {displayText}
    </span>
  );
};


DecryptedText.displayName = 'DecryptedText';

export default DecryptedText;
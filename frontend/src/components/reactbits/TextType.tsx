import React, { useState, useEffect, useRef } from 'react';

interface TextTypeProps {
  text?: string;
  className?: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
  onComplete?: () => void;
  preserveWhitespace?: boolean;
  startOnMount?: boolean;
}

const TextType: React.FC<TextTypeProps> = ({ 
  text = '',
  className = '',
  speed = 50,
  delay = 0,
  showCursor = true,
  onComplete,
  preserveWhitespace = true,
  startOnMount = true
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start typing animation
  const startTyping = () => {
    if (isTyping || isComplete) return;
    
    setIsTyping(true);
    setCurrentIndex(0);
    setDisplayText('');
    
    // Initial delay
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          
          if (nextIndex > text.length) {
            setIsTyping(false);
            setIsComplete(true);
            
            if (onComplete) {
              setTimeout(onComplete, 100);
            }
            
            return prevIndex;
          }
          
          setDisplayText(text.substring(0, nextIndex));
          return nextIndex;
        });
      }, speed);
    }, delay);
  };

  // Reset animation
  const reset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    setDisplayText('');
    setIsComplete(false);
    setIsTyping(false);
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (startOnMount) {
      startTyping();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, delay, startOnMount]);

  // Handle text changes
  useEffect(() => {
    reset();
    if (startOnMount) {
      startTyping();
    }
  }, [text]);

  const renderText = () => {
    if (preserveWhitespace) {
      return displayText.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < displayText.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    }
    return displayText;
  };

  const shouldShowCursor = showCursor && (isTyping || !isComplete);

  return (
    <span className={`text-type ${className}`}>
      {renderText()}
      {shouldShowCursor && (
        <span 
          className="terminal-cursor"
          style={{
            display: 'inline-block',
            width: '8px',
            height: '1em',
            backgroundColor: 'currentColor',
            marginLeft: '2px',
            animation: 'blink 1s infinite'
          }}
        />
      )}
    </span>
  );
};


// Expose control methods
TextType.displayName = 'TextType';

export default TextType;
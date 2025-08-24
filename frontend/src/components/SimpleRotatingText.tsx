import React, { useState, useEffect } from 'react';

interface SimpleRotatingTextProps {
  texts: string[];
  rotationInterval?: number;
  className?: string;
}

const SimpleRotatingText: React.FC<SimpleRotatingTextProps> = ({
  texts,
  rotationInterval = 3000,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (texts.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [texts.length, rotationInterval]);

  return (
    <span className={`rotating-text ${className}`}>
      {texts[currentIndex]}
    </span>
  );
};

export default SimpleRotatingText;
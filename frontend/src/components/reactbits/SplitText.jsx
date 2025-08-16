import React, { useEffect, useRef, useState } from 'react';

const SplitText = ({ 
  text, 
  className = '', 
  delay = 0, 
  stagger = 100,
  animation = 'slideUp',
  as = 'div'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const words = text.split(' ');
  const Component = as;

  const getAnimationStyle = (index) => {
    const animationDelay = isVisible ? `${index * stagger}ms` : '0ms';
    
    const animations = {
      slideUp: {
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        opacity: isVisible ? 1 : 0,
      },
      fadeIn: {
        opacity: isVisible ? 1 : 0,
      },
      scaleIn: {
        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        opacity: isVisible ? 1 : 0,
      }
    };

    return {
      ...animations[animation],
      transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${animationDelay}`,
      display: 'inline-block',
      marginRight: '0.25em',
    };
  };

  return (
    <Component ref={ref} className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          style={getAnimationStyle(index)}
        >
          {word}
        </span>
      ))}
    </Component>
  );
};

export default SplitText;
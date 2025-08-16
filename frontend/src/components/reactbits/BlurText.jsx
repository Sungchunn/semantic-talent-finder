import React, { useEffect, useRef, useState } from 'react';

const BlurText = ({ 
  text, 
  className = '', 
  delay = 0,
  duration = 800,
  as = 'p'
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

  const Component = as;

  const style = {
    filter: isVisible ? 'blur(0px)' : 'blur(4px)',
    opacity: isVisible ? 1 : 0.3,
    transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
    transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  };

  return (
    <Component ref={ref} className={className} style={style}>
      {text}
    </Component>
  );
};

export default BlurText;
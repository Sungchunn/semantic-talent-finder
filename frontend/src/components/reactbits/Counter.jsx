import React, { useEffect, useRef, useState } from 'react';

const Counter = ({ 
  target, 
  className = '', 
  delay = 0,
  duration = 2000,
  format = 'number',
  prefix = '',
  suffix = '',
  decimals = 0
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay, isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = target;
    const increment = end / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  const formatNumber = (num) => {
    switch (format) {
      case 'percentage':
        return num.toFixed(decimals);
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }).format(num);
      case 'compact':
        return new Intl.NumberFormat('en-US', { 
          notation: 'compact',
          maximumFractionDigits: decimals
        }).format(num);
      default:
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }).format(num);
    }
  };

  return (
    <span ref={ref} className={className}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

export default Counter;
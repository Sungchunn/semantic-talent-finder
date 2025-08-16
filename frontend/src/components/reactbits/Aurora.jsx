import React, { useEffect, useRef } from 'react';

const Aurora = ({ 
  colors = ['#1E3A8A', '#3B82F6', '#60A5FA'],
  className = '',
  animate = true,
  speed = 'medium',
  variant = 'background'
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const speedMultiplier = {
      slow: 0.002,
      medium: 0.005,
      fast: 0.01
    };

    const drawAurora = () => {
      if (!animate) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      colors.forEach((color, index) => {
        const offset = (index / (colors.length - 1));
        const animatedOffset = offset + Math.sin(time + index) * 0.1;
        gradient.addColorStop(Math.max(0, Math.min(1, animatedOffset)), color);
      });

      // Create aurora effect with multiple layers
      for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = 0.3 - i * 0.1;
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 10) {
          const y = canvas.height * 0.5 + 
            Math.sin((x * 0.01) + time + i) * 100 +
            Math.sin((x * 0.02) + time * 1.5 + i) * 50;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
      }

      time += speedMultiplier[speed];
      animationRef.current = requestAnimationFrame(drawAurora);
    };

    if (animate) {
      drawAurora();
    } else {
      // Static gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      colors.forEach((color, index) => {
        gradient.addColorStop(index / (colors.length - 1), color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colors, animate, speed]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'line':
        return { height: '1px' };
      case 'loading':
        return { 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50
        };
      default:
        return {};
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className={`aurora-canvas ${className}`}
      style={{
        width: '100%',
        height: '100%',
        ...getVariantStyles()
      }}
    />
  );
};

export default Aurora;
import React, { useEffect, useRef } from 'react';

const FaultyTerminal = ({ 
  className = '',
  scanlines = true,
  glow = true,
  flicker = false,
  theme = 'green',
  curvature = 0.05,
  noise = false
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const themes = {
    green: {
      primary: 'rgba(0, 255, 0, 0.8)',
      secondary: 'rgba(0, 255, 0, 0.3)',
      background: '#0a0a0a'
    },
    amber: {
      primary: 'rgba(255, 176, 0, 0.8)',
      secondary: 'rgba(255, 176, 0, 0.3)',
      background: '#0a0a0a'
    },
    blue: {
      primary: 'rgba(68, 136, 255, 0.8)',
      secondary: 'rgba(68, 136, 255, 0.3)',
      background: '#0a0a0a'
    }
  };

  const currentTheme = themes[theme] || themes.green;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const updateCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      // Background
      ctx.fillStyle = currentTheme.background;
      ctx.fillRect(0, 0, rect.width, rect.height);
      
      // Scanlines
      if (scanlines) {
        ctx.strokeStyle = currentTheme.secondary;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.1;
        
        for (let y = 0; y < rect.height; y += 4) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(rect.width, y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      
      // Noise texture
      if (noise) {
        const imageData = ctx.createImageData(rect.width, rect.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const noise = Math.random() * 0.1;
          data[i] = noise * 255;     // Red
          data[i + 1] = noise * 255; // Green
          data[i + 2] = noise * 255; // Blue
          data[i + 3] = noise * 50;  // Alpha
        }
        
        ctx.putImageData(imageData, 0, 0);
      }
      
      // Flicker effect
      if (flicker && Math.random() < 0.02) {
        ctx.globalAlpha = 0.95 + Math.random() * 0.05;
        ctx.fillStyle = currentTheme.primary;
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.globalAlpha = 1;
      }
    };

    const animate = () => {
      updateCanvas();
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initial render and start animation
    updateCanvas();
    if (flicker || noise) {
      animate();
    }

    // Handle resize
    const handleResize = () => updateCanvas();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scanlines, glow, flicker, theme, curvature, noise, currentTheme]);

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    pointerEvents: 'none',
    background: currentTheme.background,
    ...(glow && {
      boxShadow: `inset 0 0 100px ${currentTheme.secondary}, 0 0 50px ${currentTheme.primary}`
    }),
    ...(curvature > 0 && {
      borderRadius: `${curvature * 20}px`
    })
  };

  const canvasStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.8
  };

  return (
    <div className={`faulty-terminal ${className}`} style={containerStyle}>
      <canvas 
        ref={canvasRef}
        style={canvasStyle}
        aria-hidden="true"
      />
      
      {/* Additional scanline overlay for better effect */}
      {scanlines && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              ${currentTheme.secondary} 2px,
              ${currentTheme.secondary} 4px
            )`,
            opacity: 0.03,
            pointerEvents: 'none'
          }}
        />
      )}
      
      {/* Screen curvature effect */}
      {curvature > 0 && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `radial-gradient(ellipse at center, transparent 60%, ${currentTheme.background} 100%)`,
            opacity: curvature,
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  );
};

export default FaultyTerminal;
import React, { useEffect, useRef, useState } from 'react';
import GradientText from './GradientText';

const MagicBento = ({ 
  items = [],
  className = '',
  columns = 3,
  gap = 6,
  variant = 'default'
}) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setTimeout(() => {
              setVisibleItems(prev => [...new Set([...prev, index])]);
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    const itemElements = containerRef.current?.querySelectorAll('.bento-item');
    itemElements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [items]);

  const getGridClasses = () => {
    const colClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    };
    
    const gapClasses = {
      2: 'gap-2',
      4: 'gap-4',
      6: 'gap-6',
      8: 'gap-8',
    };

    return `grid ${colClasses[columns] || colClasses[3]} ${gapClasses[gap] || gapClasses[6]}`;
  };

  const getVariantStyles = (item, index) => {
    switch (variant) {
      case 'analytics':
        return {
          background: item.gradient || 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(30, 58, 138, 0.1) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
        };
      case 'features':
        return {
          background: item.gradient || `linear-gradient(135deg, ${getColorByIndex(index)} 0%, ${getDarkerColor(getColorByIndex(index))} 100%)`,
        };
      default:
        return {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        };
    }
  };

  const getColorByIndex = (index) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    return colors[index % colors.length];
  };

  const getDarkerColor = (color) => {
    // Simple color darkening - in production, use a proper color manipulation library
    const colorMap = {
      '#3B82F6': '#1D4ED8',
      '#10B981': '#047857',
      '#F59E0B': '#D97706',
      '#EF4444': '#DC2626',
      '#8B5CF6': '#7C3AED',
      '#06B6D4': '#0891B2',
    };
    return colorMap[color] || color;
  };

  return (
    <div ref={containerRef} className={`bento-grid ${getGridClasses()} ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          data-index={index}
          className={`
            bento-item p-6 rounded-xl transition-all duration-700 cursor-pointer
            transform ${visibleItems.includes(index) ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
            hover:scale-105 hover:shadow-2xl
            ${item.size === 'large' ? 'md:col-span-2' : ''}
            ${item.size === 'tall' ? 'md:row-span-2' : ''}
          `}
          style={{
            ...getVariantStyles(item, index),
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
            transitionDelay: `${index * 100}ms`,
          }}
          onClick={() => item.onClick && item.onClick()}
        >
          {/* Icon */}
          {item.icon && (
            <div className="mb-4 text-2xl">
              {item.icon}
            </div>
          )}

          {/* Title */}
          {item.title && (
            <h3 className="text-lg font-semibold mb-2">
              {variant === 'features' ? (
                <GradientText 
                  text={item.title}
                  gradient="from-white to-gray-100"
                />
              ) : (
                item.title
              )}
            </h3>
          )}

          {/* Description */}
          {item.description && (
            <p className="text-sm opacity-75 mb-4">
              {item.description}
            </p>
          )}

          {/* Value/Metric */}
          {item.value && (
            <div className="text-2xl font-bold mb-2">
              {item.value}
            </div>
          )}

          {/* Custom Content */}
          {item.content && (
            <div className="bento-content">
              {item.content}
            </div>
          )}

          {/* Action Button */}
          {item.action && (
            <button className="mt-4 px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
              {item.action}
            </button>
          )}

          {/* Hover Effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent transform translate-x-[-100%] transition-transform duration-500 group-hover:translate-x-[100%]" />
        </div>
      ))}
    </div>
  );
};

export default MagicBento;
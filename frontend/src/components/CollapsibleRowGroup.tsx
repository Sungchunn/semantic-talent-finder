import React from 'react';
import SplitText from './reactbits/SplitText';

interface CollapsibleRowGroupProps {
  title: string;
  count?: number;
  children: React.ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

export const CollapsibleRowGroup: React.FC<CollapsibleRowGroupProps> = ({
  title,
  count,
  children,
  isCollapsed,
  onToggle,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      accent: 'text-blue-600',
      hover: 'hover:bg-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200', 
      text: 'text-green-900',
      accent: 'text-green-600',
      hover: 'hover:bg-green-100'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-900', 
      accent: 'text-purple-600',
      hover: 'hover:bg-purple-100'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-900',
      accent: 'text-orange-600', 
      hover: 'hover:bg-orange-100'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      {/* Group Header */}
      <button
        onClick={onToggle}
        className={`w-full px-4 py-3 ${colors.bg} ${colors.border} ${colors.hover} border-b transition-colors duration-200 flex items-center justify-between group`}
      >
        <div className="flex items-center space-x-3">
          <div className={`transform transition-transform duration-200 ${isCollapsed ? 'rotate-0' : 'rotate-90'}`}>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          <SplitText
            text={title}
            className={`font-semibold ${colors.text} text-sm tracking-wide`}
            animation="slideUp"
            stagger={30}
          />
          
          {count !== undefined && (
            <span className={`${colors.accent} text-sm font-medium px-2 py-1 rounded-full bg-white border`}>
              {count.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Presence Indicators (Mock Collaboration) */}
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
              <span className="text-xs text-white font-medium">JD</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
              <span className="text-xs text-white font-medium">AS</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center">
              <span className="text-xs text-white font-medium">MK</span>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            {isCollapsed ? 'Show' : 'Hide'}
          </div>
        </div>
      </button>

      {/* Collapsible Content */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'
        }`}
      >
        <div className="bg-white">
          {!isCollapsed && (
            <div 
              style={{
                animation: isCollapsed ? 'none' : 'slideDown 0.3s ease-out'
              }}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
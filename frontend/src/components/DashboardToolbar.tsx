import React, { useState } from 'react';

interface DashboardToolbarProps {
  selectedCount: number;
  onExport: () => void;
  onFormat: () => void;
}

export const DashboardToolbar: React.FC<DashboardToolbarProps> = ({
  selectedCount,
  onExport,
  onFormat
}) => {
  const [activeFormat, setActiveFormat] = useState<'general' | 'number' | 'percent' | 'currency'>('general');

  const formatButtons = [
    { id: 'general', label: 'General', icon: '📝' },
    { id: 'number', label: 'Number', icon: '🔢' },
    { id: 'percent', label: 'Percent', icon: '💯' },
    { id: 'currency', label: 'Currency', icon: '💰' }
  ] as const;

  const alignmentButtons = [
    { id: 'left', icon: '◀️', label: 'Align Left' },
    { id: 'center', icon: '🎯', label: 'Align Center' },
    { id: 'right', icon: '▶️', label: 'Align Right' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section - Formatting */}
        <div className="flex items-center space-x-4">
          {/* Font Controls */}
          <div className="flex items-center space-x-2 border-r border-gray-200 pr-4">
            <select className="text-sm border border-gray-300 rounded px-2 py-1 bg-white">
              <option>Inter</option>
              <option>System UI</option>
              <option>Arial</option>
            </select>
            <select className="text-sm border border-gray-300 rounded px-2 py-1 bg-white w-16">
              <option>12</option>
              <option>14</option>
              <option>16</option>
            </select>
          </div>

          {/* Text Formatting */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Bold">
              <strong>B</strong>
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Italic">
              <em>I</em>
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Underline">
              <u>U</u>
            </button>
          </div>

          {/* Number Format */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-4">
            {formatButtons.map(format => (
              <button
                key={format.id}
                onClick={() => setActiveFormat(format.id)}
                className={`px-3 py-1.5 text-xs rounded flex items-center space-x-1 ${
                  activeFormat === format.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={format.label}
              >
                <span>{format.icon}</span>
                <span>{format.label}</span>
              </button>
            ))}
          </div>

          {/* Alignment */}
          <div className="flex items-center space-x-1">
            {alignmentButtons.map(align => (
              <button
                key={align.id}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                title={align.label}
              >
                {align.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3">
          {/* Selection Info */}
          {selectedCount > 0 && (
            <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded">
              <span>📋</span>
              <span>{selectedCount} cells selected</span>
            </div>
          )}

          {/* Filter Button */}
          <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded border border-gray-300">
            <span>🔍</span>
            <span>Filter</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Sort Button */}
          <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded border border-gray-300">
            <span>⬇️</span>
            <span>Sort</span>
          </button>

          {/* Export Button */}
          <button 
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-1.5 text-sm bg-green-600 text-white hover:bg-green-700 rounded font-medium"
          >
            <span>📤</span>
            <span>Export</span>
          </button>

          {/* More Actions Dropdown */}
          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
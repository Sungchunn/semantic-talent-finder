import React, { useState } from 'react';
import { GooeyButton, GooeyButtonGroup, ExcelExportButton, ExcelFilterButton, DashboardButton } from './GooeyButton';

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
            <GooeyButtonGroup connected>
              <DashboardButton size="small" title="Bold">
                <strong>B</strong>
              </DashboardButton>
              <DashboardButton size="small" title="Italic">
                <em>I</em>
              </DashboardButton>
              <DashboardButton size="small" title="Underline">
                <u>U</u>
              </DashboardButton>
            </GooeyButtonGroup>
          </div>

          {/* Number Format */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-4">
            <GooeyButtonGroup>
              {formatButtons.map(format => (
                <DashboardButton
                  key={format.id}
                  size="small"
                  onClick={() => setActiveFormat(format.id)}
                  active={activeFormat === format.id}
                  title={format.label}
                >
                  <span>{format.icon}</span>
                  <span className="ml-1">{format.label}</span>
                </DashboardButton>
              ))}
            </GooeyButtonGroup>
          </div>

          {/* Alignment */}
          <div className="flex items-center space-x-1">
            <GooeyButtonGroup connected>
              {alignmentButtons.map(align => (
                <DashboardButton
                  key={align.id}
                  size="small"
                  iconOnly
                  title={align.label}
                >
                  {align.icon}
                </DashboardButton>
              ))}
            </GooeyButtonGroup>
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

          {/* Action Buttons */}
          <GooeyButtonGroup>
            <ExcelFilterButton size="small">
              <span>🔍</span>
              <span>Filter</span>
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </ExcelFilterButton>

            <DashboardButton size="small" variant="outline">
              <span>⬇️</span>
              <span>Sort</span>
            </DashboardButton>

            <ExcelExportButton size="small" onClick={onExport}>
              <span>📤</span>
              <span>Export</span>
            </ExcelExportButton>
          </GooeyButtonGroup>

          {/* More Actions Dropdown */}
          <DashboardButton size="small" iconOnly variant="ghost">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </DashboardButton>
        </div>
      </div>
    </div>
  );
};
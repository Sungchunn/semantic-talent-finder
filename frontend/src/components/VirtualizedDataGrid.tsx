import React, { useMemo, useCallback } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import { Profile } from './SimpleDataTable';

interface VirtualizedDataGridProps {
  data: Profile[];
  selectedCells: Set<string>;
  onCellSelect: (selected: Set<string>) => void;
}

interface CellData {
  data: Profile[];
  columnHeaders: string[];
  selectedCells: Set<string>;
  onCellSelect: (selected: Set<string>) => void;
}

const Cell = React.memo(({ columnIndex, rowIndex, style, data }: {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: CellData;
}) => {
  const { data: profiles, columnHeaders, selectedCells, onCellSelect } = data;
  
  const profile = profiles[rowIndex - 1];
  const columnKey = columnHeaders[columnIndex];
  const cellKey = `${rowIndex}-${columnIndex}`;
  const isSelected = selectedCells.has(cellKey);

  const handleCellClick = useCallback(() => {
    const newSelected = new Set(selectedCells);
    if (isSelected) {
      newSelected.delete(cellKey);
    } else {
      newSelected.add(cellKey);
    }
    onCellSelect(newSelected);
  }, [selectedCells, cellKey, isSelected, onCellSelect]);
  
  // Header row
  if (rowIndex === 0) {
    return (
      <div 
        style={{
          ...style,
          backgroundColor: '#f9fafb',
          borderRight: '1px solid #e5e7eb',
          borderBottom: '2px solid #d1d5db',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}
        className="px-3 py-2 font-semibold text-gray-700 text-sm flex items-center"
      >
        {columnHeaders[columnIndex]}
      </div>
    );
  }

  if (!profile) return <div style={style}></div>;

  const getValue = (profile: Profile, key: string): string => {
    const value = profile[key as keyof Profile];
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (key === 'linkedinUrl' && value) {
      return 'LinkedIn Profile';
    }
    return String(value || '');
  };

  const cellValue = getValue(profile, columnKey);

  return (
    <div 
      style={{
        ...style,
        borderRight: '1px solid #e5e7eb',
        borderBottom: '1px solid #f3f4f6',
        backgroundColor: isSelected ? '#dbeafe' : (rowIndex % 2 === 0 ? '#ffffff' : '#f9fafb')
      }}
      className={`px-3 py-2 text-sm text-gray-900 cursor-pointer hover:bg-blue-50 ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
      onClick={handleCellClick}
      title={cellValue}
    >
      <div className="truncate">
        {columnKey === 'linkedinUrl' && cellValue === 'LinkedIn Profile' ? (
          <a 
            href={profile.linkedinUrl?.startsWith('http') ? profile.linkedinUrl : `https://${profile.linkedinUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            🔗 Profile
          </a>
        ) : (
          cellValue || '—'
        )}
      </div>
    </div>
  );
});

Cell.displayName = 'Cell';

export const VirtualizedDataGrid: React.FC<VirtualizedDataGridProps> = ({
  data,
  selectedCells,
  onCellSelect
}) => {
  const columnHeaders = useMemo(() => [
    'fullName',
    'jobTitle', 
    'companyName',
    'industry',
    'location',
    'linkedinUrl',
    'skills',
    'summary'
  ], []);

  const columnWidths = useMemo(() => ({
    fullName: 200,
    jobTitle: 250,
    companyName: 200,
    industry: 150,
    location: 180,
    linkedinUrl: 120,
    skills: 300,
    summary: 400
  }), []);

  const getColumnWidth = useCallback((index: number) => {
    const header = columnHeaders[index];
    return columnWidths[header as keyof typeof columnWidths] || 150;
  }, [columnHeaders, columnWidths]);

  const getRowHeight = useCallback(() => 50, []);

  const cellData: CellData = {
    data,
    columnHeaders,
    selectedCells,
    onCellSelect
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <div className="text-lg font-medium">No data to display</div>
          <div className="text-sm">Try adjusting your search criteria</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden">
      {/* Frozen Header */}
      <div className="bg-gray-50 border-b-2 border-gray-300 flex">
        {columnHeaders.map((header, index) => (
          <div 
            key={header}
            style={{ width: getColumnWidth(index) }}
            className="px-3 py-3 font-semibold text-gray-700 text-sm border-r border-gray-300 flex items-center justify-between group"
          >
            <span>{header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Virtualized Grid Body */}
      <div style={{ height: 'calc(100% - 60px)' }}>
        <Grid
          columnCount={columnHeaders.length}
          columnWidth={getColumnWidth}
          height={400}
          width={1200}
          rowCount={data.length}
          rowHeight={getRowHeight}
          itemData={cellData}
          className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          {Cell}
        </Grid>
      </div>

      {/* Row Count Footer */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-sm text-gray-600 flex items-center justify-between">
        <span>{data.length} records</span>
        {selectedCells.size > 0 && (
          <span className="text-blue-600 font-medium">
            {selectedCells.size} cells selected
          </span>
        )}
      </div>
    </div>
  );
};
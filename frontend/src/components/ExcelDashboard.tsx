import React, { useState, useMemo } from 'react';
import SplitText from './reactbits/SplitText';
import Counter from './reactbits/Counter';
import { GooeyButton, GooeyButtonGroup, ExcelActionButton } from './GooeyButton';
import { VirtualizedDataGrid } from './VirtualizedDataGrid';
import { DashboardToolbar } from './DashboardToolbar';
import { CommentsPanel } from './CommentsPanel';
import { CollapsibleRowGroup } from './CollapsibleRowGroup';
import { Profile } from './SimpleDataTable';

interface DashboardProps {
  profiles: Profile[];
  searchQuery?: string;
  onBackToHome: () => void;
}

interface DataQualityMetrics {
  field: string;
  qualityTier: 'High' | 'Medium' | 'Low';
  nullPercentage: number;
  dataType: string;
  recommendation: string;
  completeness: number;
}

export const ExcelDashboard: React.FC<DashboardProps> = ({
  profiles,
  searchQuery = '',
  onBackToHome
}) => {
  const [activeTab, setActiveTab] = useState<'data' | 'scenarios' | 'charts' | 'comments'>('data');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

  // Calculate data quality metrics
  const dataQualityMetrics: DataQualityMetrics[] = useMemo(() => {
    const fields = ['fullName', 'jobTitle', 'companyName', 'industry', 'location', 'linkedinUrl', 'skills', 'summary'];
    
    return fields.map(field => {
      const filledCount = profiles.filter(profile => {
        const value = profile[field as keyof Profile];
        return value && (Array.isArray(value) ? value.length > 0 : String(value).trim() !== '');
      }).length;
      
      const nullPercentage = profiles.length > 0 ? ((profiles.length - filledCount) / profiles.length) * 100 : 0;
      const completeness = profiles.length > 0 ? (filledCount / profiles.length) * 100 : 0;
      
      let qualityTier: 'High' | 'Medium' | 'Low' = 'Low';
      if (completeness >= 80) qualityTier = 'High';
      else if (completeness >= 50) qualityTier = 'Medium';
      
      const dataTypes = {
        fullName: 'String',
        jobTitle: 'String',
        companyName: 'String', 
        industry: 'String',
        location: 'String',
        linkedinUrl: 'URL',
        skills: 'Array[String]',
        summary: 'Text'
      };
      
      const recommendations = {
        High: 'Field is well-populated',
        Medium: 'Consider data enrichment',
        Low: 'Requires immediate attention'
      };
      
      return {
        field: field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        qualityTier,
        nullPercentage,
        dataType: dataTypes[field as keyof typeof dataTypes],
        recommendation: recommendations[qualityTier],
        completeness
      };
    });
  }, [profiles]);

  const totalRows = profiles.length;
  const totalColumns = Object.keys(profiles[0] || {}).length;
  const highQualityFields = dataQualityMetrics.filter(m => m.qualityTier === 'High').length;
  const averageCompleteness = dataQualityMetrics.reduce((sum, m) => sum + m.completeness, 0) / dataQualityMetrics.length;

  const toggleGroup = (groupId: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupId)) {
      newCollapsed.delete(groupId);
    } else {
      newCollapsed.add(groupId);
    }
    setCollapsedGroups(newCollapsed);
  };

  const qualityTierColors = {
    High: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GooeyButton
              variant="ghost"
              size="small"
              onClick={onBackToHome}
            >
              ← Back to Search
            </GooeyButton>
            <div className="h-6 w-px bg-gray-300"></div>
            <SplitText
              text="DATASET OVERVIEW"
              className="text-2xl font-bold text-gray-900"
              animation="fadeIn"
              stagger={50}
              as="h1"
            />
          </div>
          
          {/* KPI Metrics */}
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <Counter
                target={totalRows}
                className="text-2xl font-bold text-blue-600"
                format="compact"
                suffix=""
                duration={1500}
              />
              <div className="text-xs text-gray-500 uppercase tracking-wide">Profiles</div>
            </div>
            <div className="text-center">
              <Counter
                target={totalColumns}
                className="text-2xl font-bold text-purple-600"
                duration={1200}
              />
              <div className="text-xs text-gray-500 uppercase tracking-wide">Columns</div>
            </div>
            <div className="text-center">
              <Counter
                target={Math.round(averageCompleteness)}
                className="text-2xl font-bold text-green-600"
                suffix="%"
                duration={2000}
              />
              <div className="text-xs text-gray-500 uppercase tracking-wide">Complete</div>
            </div>
          </div>
        </div>

        {searchQuery && (
          <div className="mt-2 text-sm text-gray-600">
            Search results for: "<span className="font-medium text-gray-900">{searchQuery}</span>"
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <DashboardToolbar
            selectedCount={selectedCells.size}
            onExport={() => {/* Export logic */}}
            onFormat={() => {/* Format logic */}}
          />

          {/* Spreadsheet Grid */}
          <div className="flex-1 overflow-hidden bg-white">
            <div className="h-full flex flex-col">
              {/* Data Quality Overview */}
              <CollapsibleRowGroup
                title="DATA QUALITY FIELDS"
                count={dataQualityMetrics.length}
                isCollapsed={collapsedGroups.has('quality')}
                onToggle={() => toggleGroup('quality')}
                color="blue"
              >
                <div className="grid grid-cols-6 gap-px bg-gray-200 text-sm">
                  {/* Headers */}
                  <div className="bg-gray-50 px-3 py-2 font-semibold text-gray-700 sticky top-0">Field Name</div>
                  <div className="bg-gray-50 px-3 py-2 font-semibold text-gray-700 sticky top-0">Quality Tier</div>
                  <div className="bg-gray-50 px-3 py-2 font-semibold text-gray-700 sticky top-0">Null %</div>
                  <div className="bg-gray-50 px-3 py-2 font-semibold text-gray-700 sticky top-0">Data Type</div>
                  <div className="bg-gray-50 px-3 py-2 font-semibold text-gray-700 sticky top-0">Completeness</div>
                  <div className="bg-gray-50 px-3 py-2 font-semibold text-gray-700 sticky top-0">Recommendation</div>
                  
                  {/* Data Rows */}
                  {dataQualityMetrics.map((metric, index) => (
                    <React.Fragment key={metric.field}>
                      <div className="bg-white px-3 py-2 font-medium text-gray-900 border-r">
                        {metric.field}
                      </div>
                      <div className="bg-white px-3 py-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${qualityTierColors[metric.qualityTier]}`}>
                          {metric.qualityTier}
                        </span>
                      </div>
                      <div className="bg-white px-3 py-2 text-right font-mono">
                        {metric.nullPercentage.toFixed(1)}%
                      </div>
                      <div className="bg-white px-3 py-2 font-mono text-gray-600">
                        {metric.dataType}
                      </div>
                      <div className="bg-white px-3 py-2">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${metric.completeness}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{metric.completeness.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="bg-white px-3 py-2 text-gray-600">
                        {metric.recommendation}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </CollapsibleRowGroup>

              {/* Profile Data Grid */}
              <div className="flex-1 mt-6">
                <CollapsibleRowGroup
                  title="PROFILE RECORDS"
                  count={profiles.length}
                  isCollapsed={collapsedGroups.has('profiles')}
                  onToggle={() => toggleGroup('profiles')}
                  color="green"
                >
                  <VirtualizedDataGrid
                    data={profiles}
                    selectedCells={selectedCells}
                    onCellSelect={setSelectedCells}
                  />
                </CollapsibleRowGroup>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="border-b border-gray-200 px-4 py-2">
            <GooeyButtonGroup>
              {[
                { id: 'data', name: 'Data', icon: '📊' },
                { id: 'scenarios', name: 'Scenarios', icon: '🎯' },
                { id: 'charts', name: 'Charts', icon: '📈' },
                { id: 'comments', name: 'Comments', icon: '💬' }
              ].map((tab) => (
                <GooeyButton
                  key={tab.id}
                  variant="dashboard"
                  size="small"
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </GooeyButton>
              ))}
            </GooeyButtonGroup>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'comments' && <CommentsPanel />}
            {activeTab === 'data' && (
              <div className="p-4">
                <SplitText
                  text="SCHEMA RECOMMENDATIONS"
                  className="text-lg font-semibold text-gray-900 mb-4"
                  animation="slideUp"
                  stagger={80}
                />
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-medium text-blue-900">High Quality Fields</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {highQualityFields} out of {dataQualityMetrics.length} fields have high completeness
                    </p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="font-medium text-yellow-900">Enrichment Opportunities</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Consider enriching fields with &lt;80% completeness
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'scenarios' && (
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Scenarios</h3>
                <div className="text-gray-600">
                  Configure different analysis scenarios here...
                </div>
              </div>
            )}
            {activeTab === 'charts' && (
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Visualizations</h3>
                <div className="text-gray-600">
                  Chart visualizations will appear here...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
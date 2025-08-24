import React, { useState } from 'react';
import { GooeyButton, GooeyButtonGroup, ExcelExportButton, ExcelActionButton } from './GooeyButton';

export interface Profile {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  companyName?: string;
  industry?: string;
  location?: string;
  linkedinUrl?: string;
  summary?: string;
  skills?: string[];
  headline?: string;
  importBatchId?: string;
  createdAt?: string;
}

interface SimpleDataTableProps {
  profiles: Profile[];
  loading?: boolean;
  onBackToHome: () => void;
}

export const SimpleDataTable: React.FC<SimpleDataTableProps> = ({ 
  profiles, 
  loading, 
  onBackToHome 
}) => {
  const [selectedProfiles, setSelectedProfiles] = useState<Set<string>>(new Set());

  // Handle row selection
  const handleRowSelect = (profileId: string) => {
    const newSelected = new Set(selectedProfiles);
    if (newSelected.has(profileId)) {
      newSelected.delete(profileId);
    } else {
      newSelected.add(profileId);
    }
    setSelectedProfiles(newSelected);
  };

  // Select all profiles
  const handleSelectAll = () => {
    if (selectedProfiles.size === profiles.length) {
      setSelectedProfiles(new Set());
    } else {
      setSelectedProfiles(new Set(profiles.map(p => p.id)));
    }
  };

  // Export to CSV
  const exportToCSV = (exportSelected: boolean = false) => {
    const profilesToExport = exportSelected 
      ? profiles.filter(p => selectedProfiles.has(p.id))
      : profiles;

    if (profilesToExport.length === 0) {
      alert('No profiles to export');
      return;
    }

    // CSV headers
    const headers = [
      'Full Name', 'Job Title', 'Company', 'Industry', 'Location',
      'LinkedIn URL', 'Skills', 'Summary'
    ];

    // CSV rows
    const csvRows = profilesToExport.map(profile => [
      profile.fullName || '',
      profile.jobTitle || '',
      profile.companyName || '',
      profile.industry || '',
      profile.location || '',
      profile.linkedinUrl || '',
      (profile.skills || []).join('; '),
      (profile.summary || '').replace(/[\\r\\n]/g, ' ').substring(0, 200)
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => 
        row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
      )
    ].join('\\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `talent-profiles-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading profiles...</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header with navigation */}
      <div className="bg-gray-50 border-b p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <GooeyButton
              variant="ghost"
              size="small"
              onClick={onBackToHome}
            >
              ← Back to Search
            </GooeyButton>
            <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {profiles.length} profiles found
            </span>
            {selectedProfiles.size > 0 && (
              <span className="text-sm text-blue-600">
                {selectedProfiles.size} selected
              </span>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="mt-4">
          <GooeyButtonGroup>
            <ExcelExportButton size="small" onClick={() => exportToCSV(false)}>
              📊 Export All to CSV
            </ExcelExportButton>
            {selectedProfiles.size > 0 && (
              <ExcelActionButton size="small" onClick={() => exportToCSV(true)}>
                📋 Export Selected ({selectedProfiles.size})
              </ExcelActionButton>
            )}
          </GooeyButtonGroup>
        </div>
      </div>

      {/* Simple Data Table - No sorting, clean pandas-like display */}
      <div className="p-4">
        {profiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No profiles found for your search.</p>
            <ExcelActionButton className="mt-4" onClick={onBackToHome}>
              Try Another Search
            </ExcelActionButton>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProfiles.size === profiles.length && profiles.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="border border-gray-300 p-2 text-left font-semibold">Name</th>
                  <th className="border border-gray-300 p-2 text-left font-semibold">Job Title</th>
                  <th className="border border-gray-300 p-2 text-left font-semibold">Company</th>
                  <th className="border border-gray-300 p-2 text-left font-semibold">Industry</th>
                  <th className="border border-gray-300 p-2 text-left font-semibold">Location</th>
                  <th className="border border-gray-300 p-2 text-left font-semibold">LinkedIn</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile, index) => (
                  <tr 
                    key={profile.id} 
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } ${selectedProfiles.has(profile.id) ? 'bg-blue-50' : ''}`}
                  >
                    <td className="border border-gray-300 p-2">
                      <input
                        type="checkbox"
                        checked={selectedProfiles.has(profile.id)}
                        onChange={() => handleRowSelect(profile.id)}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 font-medium">
                      {profile.fullName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {profile.jobTitle || 'N/A'}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {profile.companyName || 'N/A'}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {profile.industry || 'N/A'}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {profile.location || 'N/A'}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {profile.linkedinUrl ? (
                        <a
                          href={profile.linkedinUrl.startsWith('http') 
                            ? profile.linkedinUrl 
                            : `https://${profile.linkedinUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Profile
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
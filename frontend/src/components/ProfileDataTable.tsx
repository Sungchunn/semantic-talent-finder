import React, { useState, useMemo } from 'react';
import api from '../services/api';

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

interface ProfileDataTableProps {
  profiles: Profile[];
  loading?: boolean;
}

export const ProfileDataTable: React.FC<ProfileDataTableProps> = ({ profiles, loading }) => {
  const [sortColumn, setSortColumn] = useState<keyof Profile>('fullName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedProfiles, setSelectedProfiles] = useState<Set<string>>(new Set());

  // Sort profiles based on current sort settings
  const sortedProfiles = useMemo(() => {
    return [...profiles].sort((a, b) => {
      const aValue = a[sortColumn] || '';
      const bValue = b[sortColumn] || '';
      
      if (Array.isArray(aValue) && Array.isArray(bValue)) {
        const aStr = aValue.join(', ');
        const bStr = bValue.join(', ');
        return sortDirection === 'asc' 
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      }
      
      const aStr = String(aValue);
      const bStr = String(bValue);
      
      return sortDirection === 'asc' 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [profiles, sortColumn, sortDirection]);

  // Handle column header click for sorting
  const handleSort = (column: keyof Profile) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

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
      'LinkedIn URL', 'Skills', 'Summary', 'Batch ID'
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
      (profile.summary || '').replace(/[\\r\\n]/g, ' ').substring(0, 200) + '...',
      profile.importBatchId || ''
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
    link.download = `semantic-talent-profiles-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getSortIcon = (column: keyof Profile) => {
    if (column !== sortColumn) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
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
    <div className="w-full">
      {/* Toolbar */}
      <div className="mb-4 flex justify-between items-center bg-gray-50 p-4 rounded-lg">
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
        <div className="flex space-x-2">
          <button
            onClick={() => exportToCSV(false)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Export All to CSV
          </button>
          {selectedProfiles.size > 0 && (
            <button
              onClick={() => exportToCSV(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Export Selected ({selectedProfiles.size})
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b">
                <input
                  type="checkbox"
                  checked={selectedProfiles.size === profiles.length && profiles.length > 0}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              {[
                { key: 'fullName', label: 'Full Name' },
                { key: 'jobTitle', label: 'Job Title' },
                { key: 'companyName', label: 'Company' },
                { key: 'industry', label: 'Industry' },
                { key: 'location', label: 'Location' },
                { key: 'skills', label: 'Skills' },
                { key: 'linkedinUrl', label: 'LinkedIn' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="p-3 text-left border-b cursor-pointer hover:bg-gray-200 select-none"
                  onClick={() => handleSort(key as keyof Profile)}
                >
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-gray-700">{label}</span>
                    <span className="text-gray-400">{getSortIcon(key as keyof Profile)}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedProfiles.map((profile) => (
              <tr
                key={profile.id}
                className={`border-b hover:bg-gray-50 ${
                  selectedProfiles.has(profile.id) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedProfiles.has(profile.id)}
                    onChange={() => handleRowSelect(profile.id)}
                    className="rounded"
                  />
                </td>
                <td className="p-3 font-medium text-gray-900">
                  {profile.fullName || 'N/A'}
                </td>
                <td className="p-3 text-gray-600">
                  {profile.jobTitle || 'N/A'}
                </td>
                <td className="p-3 text-gray-600">
                  {profile.companyName || 'N/A'}
                </td>
                <td className="p-3 text-gray-600">
                  {profile.industry || 'N/A'}
                </td>
                <td className="p-3 text-gray-600 max-w-xs truncate">
                  {profile.location || 'N/A'}
                </td>
                <td className="p-3 text-gray-600 max-w-sm">
                  <div className="truncate">
                    {profile.skills && profile.skills.length > 0
                      ? profile.skills.slice(0, 3).join(', ') + 
                        (profile.skills.length > 3 ? ` +${profile.skills.length - 3} more` : '')
                      : 'N/A'}
                  </div>
                </td>
                <td className="p-3">
                  {profile.linkedinUrl ? (
                    <a
                      href={profile.linkedinUrl.startsWith('http') 
                        ? profile.linkedinUrl 
                        : `https://${profile.linkedinUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
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

      {profiles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No profiles found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );
};
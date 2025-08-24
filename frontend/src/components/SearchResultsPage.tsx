import React from 'react';
import { ExcelDashboard } from './ExcelDashboard';
import { Profile } from './SimpleDataTable';

interface SearchResultsPageProps {
  profiles: Profile[];
  searchQuery: string;
  loading: boolean;
  onBackToHome: () => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  profiles,
  searchQuery,
  loading,
  onBackToHome
}) => {
  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Excel-like dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ExcelDashboard
      profiles={profiles}
      searchQuery={searchQuery}
      onBackToHome={onBackToHome}
    />
  );
};
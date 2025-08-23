import api from './api';
import { Profile } from '../components/ProfileDataTable';

export interface SimpleSearchRequest {
  query: string;
}

export const simpleSearchService = {
  // Get all profiles
  async getAllProfiles(): Promise<Profile[]> {
    try {
      const response = await api.get('/simple/profiles?limit=100');
      return response.data;
    } catch (error) {
      console.error('Error fetching all profiles:', error);
      throw error;
    }
  },

  // Simple text search
  async searchProfiles(query: string): Promise<Profile[]> {
    try {
      const response = await api.post('/simple/search', { query });
      return response.data;
    } catch (error) {
      console.error('Error searching profiles:', error);
      // Fallback: get all profiles and filter locally if backend search fails
      try {
        const allProfiles = await this.getAllProfiles();
        return allProfiles.filter(profile => 
          profile.fullName?.toLowerCase().includes(query.toLowerCase()) ||
          profile.jobTitle?.toLowerCase().includes(query.toLowerCase()) ||
          profile.companyName?.toLowerCase().includes(query.toLowerCase()) ||
          profile.location?.toLowerCase().includes(query.toLowerCase()) ||
          profile.industry?.toLowerCase().includes(query.toLowerCase()) ||
          profile.summary?.toLowerCase().includes(query.toLowerCase())
        );
      } catch (fallbackError) {
        console.error('Fallback search also failed:', fallbackError);
        throw error;
      }
    }
  },

  // Search by location specifically
  async searchByLocation(location: string): Promise<Profile[]> {
    try {
      const response = await api.get(`/simple/search/location?location=${encodeURIComponent(location)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching by location:', error);
      // Fallback to general search
      return this.searchProfiles(location);
    }
  }
};
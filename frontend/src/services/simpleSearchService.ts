import api from './api';
import { Profile } from '../components/ProfileDataTable';

export interface SimpleSearchRequest {
  query: string;
}

export const simpleSearchService = {
  // Get all profiles using existing endpoint
  async getAllProfiles(): Promise<Profile[]> {
    try {
      const response = await api.get('/profiles?page=0&size=100');
      return response.data.content || response.data;
    } catch (error) {
      console.error('Error fetching all profiles:', error);
      throw error;
    }
  },

  // Simple text search with local filtering fallback
  async searchProfiles(query: string): Promise<Profile[]> {
    try {
      // First try to get all profiles and filter locally
      const allProfiles = await this.getAllProfiles();
      return allProfiles.filter(profile => 
        profile.fullName?.toLowerCase().includes(query.toLowerCase()) ||
        profile.jobTitle?.toLowerCase().includes(query.toLowerCase()) ||
        profile.companyName?.toLowerCase().includes(query.toLowerCase()) ||
        profile.location?.toLowerCase().includes(query.toLowerCase()) ||
        profile.industry?.toLowerCase().includes(query.toLowerCase()) ||
        profile.summary?.toLowerCase().includes(query.toLowerCase()) ||
        profile.headline?.toLowerCase().includes(query.toLowerCase()) ||
        (profile.skills && profile.skills.some(skill => 
          skill.toLowerCase().includes(query.toLowerCase())
        ))
      );
    } catch (error) {
      console.error('Search failed:', error);
      // Return empty array instead of throwing to prevent network error display
      return [];
    }
  },

  // Search by location specifically
  async searchByLocation(location: string): Promise<Profile[]> {
    return this.searchProfiles(location);
  }
};
import { Profile } from '../components/ProfileDataTable';

const API_BASE_URL = 'http://localhost:8080/api/simple';

// Transform backend profile data to match frontend interface
function transformProfile(backendProfile: any): Profile {
  return {
    id: backendProfile.id,
    fullName: backendProfile.fullName || '',
    firstName: backendProfile.firstName || '',
    lastName: backendProfile.lastName || '',
    jobTitle: backendProfile.jobTitle || 'N/A',
    companyName: backendProfile.companyName || 'N/A',
    industry: backendProfile.industry || 'N/A',
    location: backendProfile.location || 'N/A',
    linkedinUrl: backendProfile.linkedinUrl || '',
    summary: backendProfile.summary || '',
    skills: backendProfile.skills || [],
    headline: backendProfile.headline || '',
    importBatchId: backendProfile.importBatchId || ''
  };
}

export const realDataService = {
  // Get all profiles from backend API
  async getAllProfiles(): Promise<Profile[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const backendProfiles = await response.json();
      return backendProfiles.map(transformProfile);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
  },

  // Simple text search using backend API
  async searchProfiles(query: string): Promise<Profile[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const backendProfiles = await response.json();
      return backendProfiles.map(transformProfile);
    } catch (error) {
      console.error('Error searching profiles:', error);
      throw error;
    }
  },

  // Search by location using backend API
  async searchByLocation(location: string): Promise<Profile[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/search/location?location=${encodeURIComponent(location)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const backendProfiles = await response.json();
      return backendProfiles.map(transformProfile);
    } catch (error) {
      console.error('Error searching by location:', error);
      throw error;
    }
  }
};
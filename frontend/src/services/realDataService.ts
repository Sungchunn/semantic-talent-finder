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
    console.log('[DEBUG] searchProfiles called with query:', query);
    try {
      console.log('[DEBUG] Making API request to:', `${API_BASE_URL}/search`);
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      console.log('[DEBUG] API response status:', response.status);
      console.log('[DEBUG] API response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const backendProfiles = await response.json();
      console.log('[DEBUG] Backend profiles received:', backendProfiles.length, 'profiles');
      console.log('[DEBUG] First profile:', backendProfiles[0]);
      
      const transformedProfiles = backendProfiles.map(transformProfile);
      console.log('[DEBUG] Transformed profiles:', transformedProfiles.length, 'profiles');
      console.log('[DEBUG] First transformed profile:', transformedProfiles[0]);
      
      return transformedProfiles;
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
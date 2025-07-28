import api from './api';

export interface Profile {
  id: string;
  fullName: string;
  headline: string;
  summary: string;
  location: string;
  industry: string;
  experienceLevel: string;
  skills: string[];
  companyName: string;
  jobTitle: string;
  yearsExperience: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileStats {
  totalProfiles: number;
  totalIndustries: number;
  totalLocations: number;
  experienceLevels: string[];
  industries: string[];
  locations: string[];
}

export const profileService = {
  async getProfile(id: string): Promise<Profile> {
    const response = await api.get(`/profiles/${id}`);
    return response.data;
  },

  async getProfileStats(): Promise<ProfileStats> {
    const response = await api.get('/profiles/stats');
    return response.data;
  },

  async importProfiles(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/profiles/batch-import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};
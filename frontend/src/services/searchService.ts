import api from './api';

export interface SearchRequest {
  query: string;
  limit?: number;
  threshold?: number;
  industries?: string[];
  locations?: string[];
  experienceLevel?: string;
}

export interface ProfileSummary {
  id: string;
  fullName: string;
  headline: string;
  location: string;
  industry: string;
  companyName: string;
  jobTitle: string;
  similarityScore: number;
  matchingSkills: string[];
}

export interface SearchResult {
  profiles: ProfileSummary[];
  totalResults: number;
  executionTimeMs: number;
  processedQuery: string;
  suggestions: string[];
}

export const searchService = {
  async searchProfiles(request: SearchRequest): Promise<SearchResult> {
    const response = await api.post('/search/semantic', request);
    return response.data;
  },

  async getSuggestions(query: string): Promise<string[]> {
    const response = await api.get(`/search/suggestions?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  async getAvailableFilters(): Promise<Record<string, string[]>> {
    const response = await api.get('/search/filters');
    return response.data;
  },
};
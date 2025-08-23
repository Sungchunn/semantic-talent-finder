import { Profile } from '../components/ProfileDataTable';

// Mock data based on our actual imported profiles
const mockProfiles: Profile[] = [
  {
    id: 'a7936f89-8c3e-4b6c-995e-0f0309cc8cb4',
    fullName: 'Tonia Guettler',
    firstName: 'Tonia',
    lastName: 'Guettler',
    jobTitle: 'Self Employeed',
    companyName: 'Personal Care',
    industry: 'Consumer Services',
    location: 'Lakewood, California, United States',
    linkedinUrl: 'linkedin.com/in/tonia-guettler-3844ba92',
    summary: 'Self employeed at Personal Care',
    skills: [],
    headline: 'Self Employeed at Personal Care',
    importBatchId: 'batch_0000'
  },
  {
    id: 'af9f2e22-d6f7-4be2-8338-203d180efb0a',
    fullName: 'Jenipher Riesenhuber',
    firstName: 'Jenipher',
    lastName: 'Riesenhuber',
    jobTitle: 'Volunteer and Community Service in Various Positions',
    companyName: 'Various',
    industry: 'Banking',
    location: 'Fort Collins, Colorado, United States',
    linkedinUrl: 'linkedin.com/in/jenipher-riesenhuber-37a1495a',
    summary: 'Seeking Higher Education Position allowing for use of demonstrated mentoring, advising, recruitment, communication, marketing, customer service, and project management skills proven by over 20 years of successful employment and volunteer positions.',
    skills: ['life insurance underwriting', 'risk assessment', 'reinsurance', 'financial risk', 'customer service', 'public speaking'],
    headline: 'Volunteer and Community Service in Various Positions at Various',
    importBatchId: 'batch_0001'
  },
  {
    id: 'charlene-buchanon-texas',
    fullName: 'Charlene Buchanon',
    firstName: 'Charlene',
    lastName: 'Buchanon',
    jobTitle: 'Aide',
    companyName: 'The Landing at Watermere',
    industry: 'Healthcare',
    location: 'Arlington, Texas, United States',
    linkedinUrl: 'linkedin.com/in/charlene-buchanon',
    summary: 'Healthcare professional providing quality care services.',
    skills: ['healthcare', 'patient care', 'customer service'],
    headline: 'Aide at The Landing at Watermere',
    importBatchId: 'batch_texas'
  },
  {
    id: 'michigan-healthcare-1',
    fullName: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    jobTitle: 'Registered Nurse',
    companyName: 'University of Michigan Health',
    industry: 'Hospital & Health Care',
    location: 'Ann Arbor, Michigan, United States',
    linkedinUrl: 'linkedin.com/in/sarah-johnson-rn',
    summary: 'Experienced registered nurse with 8+ years in critical care and emergency medicine.',
    skills: ['nursing', 'patient care', 'critical care', 'emergency medicine', 'healthcare'],
    headline: 'Registered Nurse at University of Michigan Health',
    importBatchId: 'batch_michigan'
  },
  {
    id: 'california-tech-1',
    fullName: 'David Chen',
    firstName: 'David',
    lastName: 'Chen',
    jobTitle: 'Senior Software Engineer',
    companyName: 'Google',
    industry: 'Technology',
    location: 'Mountain View, California, United States',
    linkedinUrl: 'linkedin.com/in/david-chen-swe',
    summary: 'Full-stack developer with expertise in distributed systems and machine learning.',
    skills: ['Java', 'Python', 'Machine Learning', 'Distributed Systems', 'Cloud Computing'],
    headline: 'Senior Software Engineer at Google',
    importBatchId: 'batch_california'
  },
  {
    id: 'automotive-michigan-1',
    fullName: 'Michael Rodriguez',
    firstName: 'Michael',
    lastName: 'Rodriguez',
    jobTitle: 'Manufacturing Engineer',
    companyName: 'Ford Motor Company',
    industry: 'Automotive',
    location: 'Dearborn, Michigan, United States',
    linkedinUrl: 'linkedin.com/in/michael-rodriguez-ford',
    summary: 'Manufacturing engineer specializing in automotive production optimization.',
    skills: ['Manufacturing', 'Process Improvement', 'Quality Control', 'Lean Manufacturing'],
    headline: 'Manufacturing Engineer at Ford Motor Company',
    importBatchId: 'batch_automotive'
  },
  {
    id: 'construction-pennsylvania-1',
    fullName: 'Robert Smith',
    firstName: 'Robert',
    lastName: 'Smith',
    jobTitle: 'Project Manager',
    companyName: 'Turner Construction',
    industry: 'Construction',
    location: 'Pottsville, Pennsylvania, United States',
    linkedinUrl: 'linkedin.com/in/robert-smith-construction',
    summary: 'Construction project manager with 12+ years experience in commercial building projects.',
    skills: ['Project Management', 'Construction Management', 'Scheduling', 'Budget Management'],
    headline: 'Project Manager at Turner Construction',
    importBatchId: 'batch_construction'
  },
  {
    id: 'environmental-california-1',
    fullName: 'Lisa Anderson',
    firstName: 'Lisa',
    lastName: 'Anderson',
    jobTitle: 'Environmental Consultant',
    companyName: 'AECOM',
    industry: 'Environmental Services',
    location: 'Riverside, California, United States',
    linkedinUrl: 'linkedin.com/in/lisa-anderson-environmental',
    summary: 'Environmental consultant specializing in sustainability and remediation projects.',
    skills: ['Environmental Assessment', 'Sustainability', 'Project Management', 'Regulatory Compliance'],
    headline: 'Environmental Consultant at AECOM',
    importBatchId: 'batch_environmental'
  },
  {
    id: 'tourism-california-1',
    fullName: 'Jennifer Martinez',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    jobTitle: 'Hotel Manager',
    companyName: 'Marriott Hotels',
    industry: 'Leisure, Travel & Tourism',
    location: 'Santa Barbara, California, United States',
    linkedinUrl: 'linkedin.com/in/jennifer-martinez-hospitality',
    summary: 'Hospitality professional with expertise in luxury hotel operations.',
    skills: ['Hospitality Management', 'Customer Service', 'Operations', 'Staff Training'],
    headline: 'Hotel Manager at Marriott Hotels',
    importBatchId: 'batch_tourism'
  },
  {
    id: 'medical-oklahoma-1',
    fullName: 'Dr. James Wilson',
    firstName: 'James',
    lastName: 'Wilson',
    jobTitle: 'Family Physician',
    companyName: 'Claremore Family Medicine',
    industry: 'Medical Practice',
    location: 'Claremore, Oklahoma, United States',
    linkedinUrl: 'linkedin.com/in/dr-james-wilson-md',
    summary: 'Board-certified family physician providing comprehensive primary care.',
    skills: ['Family Medicine', 'Primary Care', 'Patient Care', 'Medical Diagnosis'],
    headline: 'Family Physician at Claremore Family Medicine',
    importBatchId: 'batch_medical'
  }
];

export const mockSearchService = {
  // Get all profiles
  async getAllProfiles(): Promise<Profile[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProfiles;
  },

  // Simple text search with local filtering
  async searchProfiles(query: string): Promise<Profile[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const searchTerm = query.toLowerCase();
    
    return mockProfiles.filter(profile => 
      profile.fullName?.toLowerCase().includes(searchTerm) ||
      profile.jobTitle?.toLowerCase().includes(searchTerm) ||
      profile.companyName?.toLowerCase().includes(searchTerm) ||
      profile.location?.toLowerCase().includes(searchTerm) ||
      profile.industry?.toLowerCase().includes(searchTerm) ||
      profile.summary?.toLowerCase().includes(searchTerm) ||
      profile.headline?.toLowerCase().includes(searchTerm) ||
      (profile.skills && profile.skills.some(skill => 
        skill.toLowerCase().includes(searchTerm)
      ))
    );
  },

  // Search by location specifically
  async searchByLocation(location: string): Promise<Profile[]> {
    return this.searchProfiles(location);
  }
};
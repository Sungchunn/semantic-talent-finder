import { Profile } from '../components/ProfileDataTable';

// Real data from actual imported profiles in database (14 unique profiles)
const realProfiles: Profile[] = [
  {
    id: 'charlene-buchanon',
    fullName: 'Charlene Buchanon',
    firstName: 'Charlene',
    lastName: 'Buchanon',
    jobTitle: 'Aide',
    companyName: 'The Landing at Watermere',
    industry: 'Construction',
    location: 'Arlington, Texas, United States',
    linkedinUrl: 'linkedin.com/in/charlene-buchanon',
    summary: 'Healthcare aide working in construction industry.',
    skills: ['healthcare', 'construction', 'patient care'],
    headline: 'Aide at The Landing at Watermere',
    importBatchId: 'batch_0001'
  },
  {
    id: 'kayce-ryberg',
    fullName: 'CPNP-PC Kayce Ryberg',
    firstName: 'Kayce',
    lastName: 'Ryberg',
    jobTitle: 'Certified Pediatric Nurse Practitioner',
    companyName: 'Medical Practice',
    industry: 'Medical Practice',
    location: 'Soquel, California, United States',
    linkedinUrl: 'linkedin.com/in/kayce-ryberg',
    summary: 'Certified Pediatric Nurse Practitioner providing specialized healthcare.',
    skills: ['pediatrics', 'nursing', 'healthcare', 'medical practice'],
    headline: 'Certified Pediatric Nurse Practitioner',
    importBatchId: 'batch_0002'
  },
  {
    id: 'dajuana-luster',
    fullName: 'Dajuana Luster',
    firstName: 'Dajuana',
    lastName: 'Luster',
    jobTitle: 'Security Officer',
    companyName: 'Securitas Security Services USA, Inc.',
    industry: 'Security and Investigations',
    location: 'Lancaster, California, United States',
    linkedinUrl: 'linkedin.com/in/dajuana-luster',
    summary: 'Professional security officer providing safety and protection services.',
    skills: ['security', 'investigations', 'safety', 'protection'],
    headline: 'Security Officer at Securitas',
    importBatchId: 'batch_0003'
  },
  {
    id: 'eric-hummel',
    fullName: 'Eric Hummel',
    firstName: 'Eric',
    lastName: 'Hummel',
    jobTitle: 'Owner',
    companyName: 'Five Star Auto Body',
    industry: 'Automotive',
    location: 'Saint Louis, Missouri, United States',
    linkedinUrl: 'linkedin.com/in/eric-hummel',
    summary: 'Business owner specializing in automotive body repair services.',
    skills: ['automotive repair', 'business management', 'auto body', 'entrepreneurship'],
    headline: 'Owner at Five Star Auto Body',
    importBatchId: 'batch_0004'
  },
  {
    id: 'evangeline-bertloff',
    fullName: 'Evangeline Bertloff',
    firstName: 'Evangeline',
    lastName: 'Bertloff',
    jobTitle: 'Chief Executive Officer',
    companyName: 'Executive Services',
    industry: 'Consumer Services',
    location: 'Tampa, Florida, United States',
    linkedinUrl: 'linkedin.com/in/evangeline-bertloff',
    summary: 'Chief Executive Officer with extensive leadership experience.',
    skills: ['executive leadership', 'business strategy', 'management', 'consumer services'],
    headline: 'Chief Executive Officer',
    importBatchId: 'batch_0005'
  },
  {
    id: 'fredrik-valeur',
    fullName: 'Fredrik Valeur',
    firstName: 'Fredrik',
    lastName: 'Valeur',
    jobTitle: 'Senior Director of Infrastructure',
    companyName: 'Lastline, Inc.',
    industry: 'Computer & Network Security',
    location: 'Santa Barbara, California, United States',
    linkedinUrl: 'linkedin.com/in/fredrik-valeur',
    summary: 'Senior technology executive specializing in cybersecurity infrastructure.',
    skills: ['cybersecurity', 'infrastructure', 'network security', 'technology leadership'],
    headline: 'Senior Director of Infrastructure at Lastline',
    importBatchId: 'batch_0006'
  },
  {
    id: 'jenipher-riesenhuber',
    fullName: 'Jenipher Riesenhuber',
    firstName: 'Jenipher',
    lastName: 'Riesenhuber',
    jobTitle: 'Volunteer and Community Service in Various Positions',
    companyName: 'Various',
    industry: 'Banking',
    location: 'Fort Collins, Colorado, United States',
    linkedinUrl: 'linkedin.com/in/jenipher-riesenhuber-37a1495a',
    summary: 'Seeking Higher Education Position with demonstrated mentoring and recruitment skills.',
    skills: ['volunteer work', 'community service', 'banking', 'customer service'],
    headline: 'Volunteer and Community Service Professional',
    importBatchId: 'batch_0007'
  },
  {
    id: 'jessica-orchowski',
    fullName: 'Jessica Orchowski',
    firstName: 'Jessica',
    lastName: 'Orchowski',
    jobTitle: 'Healthcare Worker',
    companyName: 'Medical Center',
    industry: 'Hospital & Health Care',
    location: 'Ann Arbor, Michigan, United States',
    linkedinUrl: 'linkedin.com/in/jessica-orchowski',
    summary: 'Healthcare professional in Ann Arbor, Michigan providing patient care.',
    skills: ['healthcare', 'patient care', 'medical care', 'michigan'],
    headline: 'Healthcare Worker in Michigan',
    importBatchId: 'batch_0008'
  },
  {
    id: 'judy-kreuter',
    fullName: 'Judy Kreuter',
    firstName: 'Judy',
    lastName: 'Kreuter',
    jobTitle: 'English Conversation Facilitator',
    companyName: 'Educational Services',
    industry: 'Leisure, Travel & Tourism',
    location: 'Venice, California, United States',
    linkedinUrl: 'linkedin.com/in/judy-kreuter',
    summary: 'English conversation facilitator helping people improve communication skills.',
    skills: ['education', 'language instruction', 'communication', 'facilitation'],
    headline: 'English Conversation Facilitator',
    importBatchId: 'batch_0009'
  },
  {
    id: 'sandra-salgado',
    fullName: 'Sandra Salgado',
    firstName: 'Sandra',
    lastName: 'Salgado',
    jobTitle: 'Accountant',
    companyName: 'SP Group',
    industry: 'Accounting',
    location: 'Riverside, California, United States',
    linkedinUrl: 'linkedin.com/in/sandra-salgado',
    summary: 'Professional accountant providing financial services and analysis.',
    skills: ['accounting', 'financial analysis', 'bookkeeping', 'tax preparation'],
    headline: 'Accountant at SP Group',
    importBatchId: 'batch_0010'
  },
  {
    id: 'sean-huber',
    fullName: 'Sean Huber',
    firstName: 'Sean',
    lastName: 'Huber',
    jobTitle: 'Staff Meteorologist',
    companyName: 'WorldWinds Inc.',
    industry: 'Environmental Services',
    location: 'Claremore, Oklahoma, United States',
    linkedinUrl: 'linkedin.com/in/sean-huber',
    summary: 'Professional meteorologist providing weather analysis and forecasting.',
    skills: ['meteorology', 'weather forecasting', 'environmental science', 'data analysis'],
    headline: 'Staff Meteorologist at WorldWinds Inc.',
    importBatchId: 'batch_0011'
  },
  {
    id: 'shaun-rohrbaugh',
    fullName: 'Shaun Rohrbaugh',
    firstName: 'Shaun',
    lastName: 'Rohrbaugh',
    jobTitle: 'Construction Worker',
    companyName: 'Construction Company',
    industry: 'Building Materials',
    location: 'Pottsville, Pennsylvania, United States',
    linkedinUrl: 'linkedin.com/in/shaun-rohrbaugh',
    summary: 'Construction professional specializing in building materials and construction work.',
    skills: ['construction', 'building materials', 'manual labor', 'project work'],
    headline: 'Construction Worker',
    importBatchId: 'batch_0012'
  },
  {
    id: 'shawanda-barrett',
    fullName: 'Shawanda Barrett',
    firstName: 'Shawanda',
    lastName: 'Barrett',
    jobTitle: 'Security Supervisor',
    companyName: 'DRS Technologies, Inc.',
    industry: 'Security and Investigations',
    location: 'Washington, District of Columbia, United States',
    linkedinUrl: 'linkedin.com/in/shawanda-barrett',
    summary: 'Security supervisor managing security operations and investigations.',
    skills: ['security management', 'investigations', 'supervision', 'safety protocols'],
    headline: 'Security Supervisor at DRS Technologies',
    importBatchId: 'batch_0013'
  },
  {
    id: 'tonia-guettler',
    fullName: 'Tonia Guettler',
    firstName: 'Tonia',
    lastName: 'Guettler',
    jobTitle: 'Self Employeed',
    companyName: 'Personal Care',
    industry: 'Consumer Services',
    location: 'Lakewood, California, United States',
    linkedinUrl: 'linkedin.com/in/tonia-guettler',
    summary: 'Self-employed professional in personal care services.',
    skills: ['personal care', 'consumer services', 'entrepreneurship'],
    headline: 'Self Employed at Personal Care',
    importBatchId: 'batch_0014'
  }
];

export const realDataService = {
  // Get all profiles
  async getAllProfiles(): Promise<Profile[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return realProfiles;
  },

  // Simple text search with local filtering
  async searchProfiles(query: string): Promise<Profile[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const searchTerm = query.toLowerCase();
    
    return realProfiles.filter(profile => 
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
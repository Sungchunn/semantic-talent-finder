import React, { useState } from 'react';
import './App.css';
import { 
  SplitText, 
  BlurText, 
  Counter, 
  GradientText, 
  Aurora, 
  ProfileCard, 
  MagicBento, 
  GlassIcon 
} from './components/reactbits';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for demonstration
  const statsData = [
    { value: 51352619, label: 'Total Profiles', suffix: '' },
    { value: 1871, label: 'Unique Skills', suffix: '' },
    { value: 500, label: 'Search Response', suffix: 'ms' },
    { value: 85, label: 'Result Accuracy', suffix: '%' }
  ];

  const featuresData = [
    {
      title: 'Natural Language Search',
      description: 'Search using everyday language instead of complex filters',
      icon: <GlassIcon name="search" size="lg" variant="glass" />,
      gradient: 'from-blue-500 to-blue-700'
    },
    {
      title: 'AI-Powered Matching',
      description: 'Advanced semantic similarity for better results',
      icon: <GlassIcon name="brain" size="lg" variant="glass" />,
      gradient: 'from-purple-500 to-purple-700'
    },
    {
      title: 'Real-time Analytics',
      description: 'Live performance metrics and insights',
      icon: <GlassIcon name="chart" size="lg" variant="glass" />,
      gradient: 'from-green-500 to-green-700'
    },
    {
      title: 'Enterprise Scale',
      description: 'Built to handle 50M+ profiles efficiently',
      icon: <GlassIcon name="users" size="lg" variant="glass" />,
      gradient: 'from-orange-500 to-orange-700'
    },
    {
      title: 'Data Quality Insights',
      description: 'Comprehensive quality analysis and scoring',
      icon: <GlassIcon name="analytics" size="lg" variant="glass" />,
      gradient: 'from-cyan-500 to-cyan-700'
    },
    {
      title: 'Production Ready',
      description: 'Production-grade architecture and performance',
      icon: <GlassIcon name="home" size="lg" variant="glass" />,
      gradient: 'from-indigo-500 to-indigo-700'
    }
  ];

  const sampleProfiles = [
    {
      name: 'Alex Johnson',
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      similarityScore: 94,
      dataQualityScore: 0.92
    },
    {
      name: 'Sarah Chen',
      title: 'Product Manager',
      company: 'InnovateCo',
      location: 'New York, NY',
      skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Leadership'],
      similarityScore: 87,
      dataQualityScore: 0.85
    },
    {
      name: 'Michael Rodriguez',
      title: 'Data Scientist',
      company: 'DataTech',
      location: 'Austin, TX',
      skills: ['Machine Learning', 'Python', 'TensorFlow', 'Statistics'],
      similarityScore: 91,
      dataQualityScore: 0.89
    }
  ];

  return (
    <div className="app">
      {/* Hero Section */}
      <section className="hero relative min-h-screen flex items-center justify-center">
        <Aurora 
          colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
          className="absolute inset-0 -z-10"
          animate={true}
          speed="slow"
        />
        
        <div className="container text-center relative z-10">
          <SplitText 
            text="Transform Talent Discovery with AI-Powered Search"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-900 mb-6"
            delay={300}
            stagger={100}
          />
          
          <BlurText 
            text="Search 51,352,619 professional profiles using natural language queries"
            className="text-lg md:text-xl text-neutral-600 mb-8 mx-auto"
            delay={1500}
          />
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <input
              type="text"
              placeholder="Find senior Java developers in fintech with startup experience..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />
            <div className="flex justify-center mt-4 space-x-4">
              <button className="btn-primary">
                <GlassIcon name="search" size="sm" className="mr-2 text-white" />
                Search Profiles
              </button>
              <button className="btn-glass">
                <GlassIcon name="filter" size="sm" className="mr-2" />
                Advanced Filters
              </button>
            </div>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {statsData.map((stat, index) => (
              <div key={index} className="glass-card p-6 text-center glass-hover">
                <Counter 
                  target={stat.value}
                  className="text-2xl md:text-3xl font-bold text-primary-500 block mb-2"
                  suffix={stat.suffix}
                  duration={2000}
                  delay={2000 + index * 200}
                />
                <BlurText 
                  text={stat.label}
                  className="text-sm text-neutral-600"
                  delay={2500 + index * 200}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-20">
        <div className="container">
          <div className="text-center mb-16">
            <SplitText 
              text="Powerful Features for Modern Talent Search"
              className="text-3xl md:text-4xl font-bold text-primary-900 mb-4"
              delay={0}
              stagger={80}
            />
            <BlurText 
              text="Built with enterprise-grade technology to handle massive datasets"
              className="text-lg text-neutral-600"
              delay={800}
            />
          </div>
          
          <MagicBento 
            items={featuresData}
            columns={3}
            gap={6}
            variant="features"
            className="max-w-6xl mx-auto"
          />
        </div>
      </section>

      {/* Sample Results Section */}
      <section className="results py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="container">
          <div className="text-center mb-16">
            <SplitText 
              text="Sample Search Results"
              className="text-3xl md:text-4xl font-bold text-primary-900 mb-4"
              delay={0}
              stagger={80}
            />
            <BlurText 
              text="See how our AI-powered search delivers relevant, high-quality matches"
              className="text-lg text-neutral-600"
              delay={600}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sampleProfiles.map((profile, index) => (
              <ProfileCard
                key={index}
                profile={profile}
                className="glass-card"
                showSimilarity={true}
                showSkills={true}
                showMetrics={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Preview Section */}
      <section className="analytics py-20">
        <div className="container">
          <div className="text-center mb-16">
            <SplitText 
              text="Data Quality & Analytics"
              className="text-3xl md:text-4xl font-bold text-primary-900 mb-4"
              delay={0}
              stagger={80}
            />
            <BlurText 
              text="Comprehensive analysis of 51M+ LinkedIn profiles with quality scoring"
              className="text-lg text-neutral-600"
              delay={600}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass-card-dark text-white p-8 text-center">
              <div className="mb-4">
                <Counter 
                  target={12}
                  className="text-4xl font-bold text-success block mb-2"
                  duration={1000}
                />
                <p className="text-lg font-semibold">High Quality Fields</p>
                <p className="text-sm opacity-75">0-3% null values</p>
              </div>
              <BlurText 
                text="Core functionality ready with reliable data"
                className="text-sm opacity-75"
                delay={500}
              />
            </div>
            
            <div className="glass-card-dark text-white p-8 text-center">
              <div className="mb-4">
                <Counter 
                  target={7}
                  className="text-4xl font-bold text-warning block mb-2"
                  duration={1000}
                />
                <p className="text-lg font-semibold">Medium Quality Fields</p>
                <p className="text-sm opacity-75">11-19% null values</p>
              </div>
              <BlurText 
                text="Secondary features with good coverage"
                className="text-sm opacity-75"
                delay={700}
              />
            </div>
            
            <div className="glass-card-dark text-white p-8 text-center">
              <div className="mb-4">
                <Counter 
                  target={43}
                  className="text-4xl font-bold text-error block mb-2"
                  duration={1000}
                />
                <p className="text-lg font-semibold">Low Quality Fields</p>
                <p className="text-sm opacity-75">54-95% null values</p>
              </div>
              <BlurText 
                text="Limited utility, used for supplementary data"
                className="text-sm opacity-75"
                delay={900}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-primary-900 text-white">
        <div className="container text-center">
          <GradientText 
            text="Semantic Talent Finder"
            gradient="from-white to-blue-100"
            className="text-2xl font-bold mb-4"
          />
          <BlurText 
            text="AI-powered talent search for the modern enterprise"
            className="text-neutral-300 mb-6"
            delay={300}
          />
          <div className="flex justify-center space-x-4">
            <GlassIcon name="linkedin" size="md" variant="glass" />
            <GlassIcon name="home" size="md" variant="glass" />
            <GlassIcon name="chart" size="md" variant="glass" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

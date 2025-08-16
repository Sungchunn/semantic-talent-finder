# React Bits Component Specifications

## 🎭 React Bits Component Library

React Bits provides premium animated components that will elevate the Semantic Talent Finder interface to enterprise-grade quality. Each component serves specific purposes in our AI-powered talent search platform.

## 📝 Component Usage Guide

### **SplitText Applications**

#### Primary Usage
- **Hero titles**: Main page headings with dramatic word-by-word reveals
- **Section headings**: Category titles that animate on scroll
- **Search announcements**: "Found 1,247 matching profiles" with character animations
- **Loading messages**: "Processing your search..." with staggered reveals

#### Implementation Examples
```jsx
// Hero title on landing page
<SplitText 
  text="Transform Talent Discovery with AI-Powered Search"
  className="text-6xl font-bold text-primary-900"
  delay={100}
  stagger={100}
/>

// Search results announcement
<SplitText 
  text={`Found ${resultCount} matching profiles`}
  className="text-2xl font-semibold text-primary-700"
  delay={0}
  stagger={50}
/>

// Section heading
<SplitText 
  text="Dataset Analytics & Quality Metrics"
  className="text-4xl font-bold text-gradient"
  delay={200}
  stagger={80}
/>
```

### **BlurText Applications**

#### Primary Usage
- **Subtitles and descriptions**: Supporting text that reveals elegantly
- **Metric explanations**: Context for statistics and data points
- **Profile details**: Information that appears as users scroll
- **Search suggestions**: Dropdown options with smooth reveals

#### Implementation Examples
```jsx
// Hero subtitle
<BlurText 
  text="Search 51,352,619 professional profiles using natural language"
  className="text-xl text-neutral-600 max-w-3xl mx-auto"
  delay={800}
/>

// Metric description
<BlurText 
  text="Average response time for semantic search queries"
  className="text-sm text-neutral-500"
  delay={1200}
/>

// Profile description
<BlurText 
  text={profile.summary}
  className="text-base text-neutral-700 leading-relaxed"
  delay={300}
/>
```

### **Counter Applications**

#### Primary Usage
- **Statistics and metrics**: All numerical data with dramatic count-up effects
- **Similarity scores**: Profile matching percentages (0-100%)
- **Real-time data**: Live user counts, search metrics
- **Processing statistics**: Data import progress, batch processing

#### Implementation Examples
```jsx
// Main statistics on homepage
<Counter 
  target={51352619}
  className="text-5xl font-bold text-primary-600"
  duration={2000}
  format="number"
/>

// Similarity score on profile cards
<Counter 
  target={profile.similarityScore}
  className="text-lg font-semibold text-success"
  duration={1000}
  format="percentage"
  suffix="%"
/>

// Processing progress
<Counter 
  target={processedRecords}
  className="text-2xl font-mono text-primary-700"
  duration={1500}
  format="number"
  prefix="Processed: "
/>
```

### **ProfileCard Applications**

#### Primary Usage
- **Talent profiles**: Search result displays with comprehensive information
- **Featured profiles**: Homepage showcases of platform capabilities
- **Team members**: About page staff information
- **Testimonials**: User success stories and case studies

#### Enhanced ProfileCard Design
```jsx
// Search result profile card
<ProfileCard
  profile={{
    name: profile.fullName,
    title: profile.jobTitle,
    company: profile.companyName,
    location: profile.location,
    avatar: profile.avatarUrl || '/placeholder-avatar.png',
    skills: profile.skills,
    similarityScore: profile.similarityScore,
    dataQualityScore: profile.dataQualityScore
  }}
  className="glass-card hover:scale-105 transition-transform"
  showSimilarity={true}
  showSkills={true}
  onClick={() => navigateToProfile(profile.id)}
/>

// Featured profile on homepage
<ProfileCard
  profile={featuredProfile}
  className="glass-card-dark text-white"
  variant="featured"
  showMetrics={true}
/>
```

### **MagicBento Applications**

#### Primary Usage
- **Feature showcases**: Homepage grid displaying platform capabilities
- **Data quality sections**: Analytics dashboard breakdowns
- **Service offerings**: Different search modes and features
- **Navigation grids**: Dashboard quick-access tiles

#### Implementation Examples
```jsx
// Homepage features grid
<MagicBento
  items={[
    {
      title: "Natural Language Search",
      description: "Search using everyday language",
      icon: <GlassIcon name="search" />,
      gradient: "from-blue-500 to-blue-700"
    },
    {
      title: "AI-Powered Matching", 
      description: "Advanced semantic similarity",
      icon: <GlassIcon name="brain" />,
      gradient: "from-purple-500 to-purple-700"
    },
    {
      title: "Real-time Analytics",
      description: "Live search performance metrics", 
      icon: <GlassIcon name="chart" />,
      gradient: "from-green-500 to-green-700"
    }
  ]}
  className="max-w-6xl mx-auto"
  columns={3}
  gap={6}
/>

// Data quality dashboard
<MagicBento
  items={qualityMetrics}
  className="grid-cols-1 md:grid-cols-3"
  variant="analytics"
/>
```

### **GradientText Applications**

#### Primary Usage
- **Call-to-action headings**: Important messages and prompts
- **Skill tags and categories**: Dynamic content highlighting
- **Status indicators**: Success, warning, error states
- **Brand messaging**: Key value propositions

#### Implementation Examples
```jsx
// CTA heading
<GradientText 
  text="Start Your Search Today"
  gradient="from-primary-500 to-primary-700"
  className="text-4xl font-bold"
/>

// Skill tags
{profile.skills.map(skill => (
  <GradientText 
    key={skill}
    text={skill}
    gradient="from-success to-primary-400"
    className="text-sm font-medium px-3 py-1 rounded-full bg-white/10"
  />
))}

// Status indicator
<GradientText 
  text="High Quality Data"
  gradient="from-success to-green-600"
  className="text-sm font-semibold"
/>
```

### **GlassIcons Applications**

#### Primary Usage
- **Navigation icons**: Menu items with glassmorphism effects
- **Filter buttons**: Search and sorting controls
- **Social media links**: Footer and contact sections
- **Action buttons**: Search, save, share functionality

#### Implementation Examples
```jsx
// Navigation menu
<GlassIcon 
  name="home"
  size="md"
  className="glass-hover"
  variant="primary"
/>

// Filter buttons
<GlassIcon 
  name="filter"
  size="sm"
  className="mr-2"
  active={isFilterActive}
/>

// Social links
<GlassIcon 
  name="linkedin"
  size="lg"
  className="text-primary-500 hover:text-primary-700"
  href="https://linkedin.com/company/semantic-talent-finder"
/>
```

### **Aurora Applications**

#### Primary Usage
- **Hero backgrounds**: Homepage main section with animated gradients
- **Section dividers**: Smooth transitions between page areas
- **Loading screens**: Elegant loading states with flowing colors
- **Modal overlays**: Dialog backgrounds with subtle movement

#### Implementation Examples
```jsx
// Homepage hero background
<Aurora
  colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
  className="absolute inset-0 -z-10"
  animate={true}
  speed="slow"
/>

// Section divider
<Aurora
  colors={['#10B981', '#3B82F6']}
  className="h-px w-full"
  variant="line"
/>

// Loading overlay
<Aurora
  colors={['#3B82F6', '#60A5FA', '#93C5FD']}
  className="fixed inset-0 z-50"
  variant="loading"
/>
```

## 🎬 Animation Coordination

### **Page Load Sequence**
1. **Aurora** (0s): Background fades in smoothly
2. **SplitText** (0.3s): Hero title animates word-by-word
3. **BlurText** (1.5s): Subtitle reveals after title completes
4. **Counter** (2s): Statistics animate sequentially with 200ms stagger
5. **MagicBento** (2.5s): Feature tiles activate with 100ms stagger
6. **ProfileCard** (3s): Cards fade in with subtle slide-up

### **Scroll-Triggered Animations**
- Use Intersection Observer for performance
- **BlurText**: Trigger when 50% visible, 0.6s duration
- **Counter**: Start when entering viewport, complete in 1s
- **MagicBento**: Stagger activation based on grid position
- **ProfileCard**: Subtle entrance when 30% visible

### **Interaction Feedback**
- **Hover**: 0.3s transition for all React Bits components
- **Click**: 0.15s scale for interactive elements
- **Focus**: 0.2s glow effect for focusable components
- **Loading**: Shimmer effects during data fetching

## 📱 Responsive Behavior

### **Mobile Optimizations**
- **SplitText**: Faster animations, shorter delays
- **Counter**: Reduced duration (500ms instead of 1000ms)
- **Aurora**: Simplified effects, lower frame rate
- **MagicBento**: Single column layout, larger touch targets

### **Performance Considerations**
- **Reduced Motion**: Respect `prefers-reduced-motion` setting
- **GPU Acceleration**: Use `transform` properties for animations
- **Intersection Observer**: Only animate visible elements
- **Memory Management**: Cleanup animation references properly

## 🎯 Best Practices

### **Component Composition**
```jsx
// Good: Composing multiple React Bits components
<div className="hero-section">
  <Aurora className="hero-background" />
  <SplitText text="Hero Title" className="hero-title" />
  <BlurText text="Subtitle" className="hero-subtitle" />
  <div className="stats-grid">
    {stats.map((stat, index) => (
      <div key={stat.label} className="stat-card">
        <Counter target={stat.value} delay={index * 200} />
        <GradientText text={stat.label} />
      </div>
    ))}
  </div>
</div>
```

### **Performance Guidelines**
- Limit concurrent animations to 5-7 elements
- Use CSS transforms instead of layout properties
- Implement animation queues for complex sequences
- Cache heavy computations (Aurora gradients)
- Progressive enhancement for older browsers

### **Accessibility**
- Provide fallback text for screen readers
- Respect reduced motion preferences
- Ensure color contrast meets WCAG standards
- Add proper ARIA labels for interactive components
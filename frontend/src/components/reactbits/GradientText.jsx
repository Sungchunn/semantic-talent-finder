import React from 'react';

const GradientText = ({ 
  text, 
  gradient = 'from-blue-500 to-blue-700',
  className = '',
  as = 'span'
}) => {
  const Component = as;
  
  // Convert Tailwind gradient classes to CSS gradient
  const getGradientStyle = (gradientClass) => {
    const gradientMap = {
      'from-blue-500 to-blue-700': 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      'from-primary-500 to-primary-700': 'linear-gradient(135deg, #3B82F6 0%, #1E3A8A 100%)',
      'from-success to-primary-400': 'linear-gradient(135deg, #10B981 0%, #60A5FA 100%)',
      'from-success to-green-600': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      'from-purple-500 to-purple-700': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      'from-green-500 to-green-700': 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
    };
    
    return gradientMap[gradientClass] || 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)';
  };

  const style = {
    background: getGradientStyle(gradient),
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'inline-block',
  };

  return (
    <Component className={className} style={style}>
      {text}
    </Component>
  );
};

export default GradientText;
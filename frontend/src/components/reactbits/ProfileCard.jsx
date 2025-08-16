import React from 'react';
import GradientText from './GradientText';
import Counter from './Counter';

const ProfileCard = ({ 
  profile,
  className = '',
  variant = 'default',
  showSimilarity = false,
  showSkills = false,
  showMetrics = false,
  onClick
}) => {
  const {
    name,
    title,
    company,
    location,
    avatar,
    skills = [],
    similarityScore,
    dataQualityScore
  } = profile;

  const getVariantClasses = () => {
    switch (variant) {
      case 'featured':
        return 'bg-gradient-to-br from-primary-600 to-primary-800 text-white';
      case 'compact':
        return 'bg-white border border-neutral-200';
      default:
        return 'bg-white/10 backdrop-blur-lg border border-white/20';
    }
  };

  const handleClick = () => {
    if (onClick) onClick(profile);
  };

  return (
    <div 
      className={`
        profile-card rounded-xl p-6 transition-all duration-300 
        hover:transform hover:scale-105 hover:shadow-xl
        cursor-pointer
        ${getVariantClasses()}
        ${className}
      `}
      onClick={handleClick}
      style={{
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
      }}
    >
      {/* Header */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : (
            name?.charAt(0) || '?'
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold truncate">
            {variant === 'featured' ? (
              <GradientText text={name} gradient="from-white to-blue-100" />
            ) : (
              name
            )}
          </h3>
          <p className="text-sm opacity-75 truncate">{title}</p>
          {company && (
            <p className="text-xs opacity-60 truncate">{company}</p>
          )}
        </div>

        {showSimilarity && similarityScore && (
          <div className="text-right">
            <div className="text-xs opacity-60 mb-1">Match</div>
            <Counter 
              target={similarityScore}
              className="text-lg font-bold text-green-500"
              suffix="%"
              duration={1000}
            />
          </div>
        )}
      </div>

      {/* Location */}
      {location && (
        <div className="text-sm opacity-75 mb-3">
          📍 {location}
        </div>
      )}

      {/* Skills */}
      {showSkills && skills.length > 0 && (
        <div className="mb-4">
          <div className="text-xs opacity-60 mb-2">Skills</div>
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-white/20 backdrop-blur-sm"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="px-2 py-1 text-xs rounded-full bg-white/20 backdrop-blur-sm opacity-60">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Metrics */}
      {showMetrics && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          {dataQualityScore && (
            <div className="text-center">
              <div className="text-xs opacity-60 mb-1">Quality</div>
              <Counter 
                target={dataQualityScore * 100}
                className="text-sm font-semibold"
                suffix="%"
                duration={800}
              />
            </div>
          )}
          {skills.length > 0 && (
            <div className="text-center">
              <div className="text-xs opacity-60 mb-1">Skills</div>
              <Counter 
                target={skills.length}
                className="text-sm font-semibold"
                duration={600}
              />
            </div>
          )}
        </div>
      )}

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent transform translate-x-[-100%] transition-transform duration-500 hover:translate-x-[100%]" />
    </div>
  );
};

export default ProfileCard;
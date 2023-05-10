import React from 'react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-gray-900"></div>
    </div>
  );
};

export default LoadingAnimation;
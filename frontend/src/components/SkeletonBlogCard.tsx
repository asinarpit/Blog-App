import React from 'react';

const SkeletonBlogCard: React.FC = () => {
  return (
    <div className="flex flex-col justify-between bg-gray-100 dark:bg-gray-800 rounded-lg 
      shadow-neumorphic dark:shadow-dark-neumorphic 
      transition-shadow duration-300 overflow-hidden h-full animate-pulse">
      
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset">
        <div className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-gray-300 dark:bg-gray-600"></div>
        
        <div className="absolute bottom-2 right-2 w-16 h-6 rounded-lg bg-gray-300 dark:bg-gray-600"></div>
        
        <div className="absolute bottom-2 left-2 w-20 h-6 rounded-lg bg-gray-300 dark:bg-gray-600"></div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
        
        <div className="space-y-2 mb-4 flex-grow">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
        </div>
        
        <div className="mt-auto h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
      </div>
    </div>
  );
};

export default SkeletonBlogCard; 
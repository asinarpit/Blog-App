import React from 'react';

interface SkeletonCommentProps {
  replies?: boolean;
  depth?: number;
}

const SkeletonComment: React.FC<SkeletonCommentProps> = ({ replies = false, depth = 0 }) => {
  return (
    <div className={`animate-pulse ${depth > 0 ? 'ml-8' : ''}`}>
      <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 
        shadow-neumorphic dark:shadow-dark-neumorphic mb-4">
        
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0"></div>
        
        <div className="w-full">
          <div className="flex flex-wrap justify-between mb-2">
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
          
          <div className="flex gap-4">
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
        </div>
      </div>
      
      {replies && (
        <div className="ml-8">
          <SkeletonComment depth={depth + 1} />
        </div>
      )}
    </div>
  );
};

export default SkeletonComment; 
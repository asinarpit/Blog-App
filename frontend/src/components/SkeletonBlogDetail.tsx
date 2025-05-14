import React from 'react';
import SkeletonComment from './SkeletonComment';

const SkeletonBlogDetail: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 rounded-xl overflow-hidden shadow-neumorphic dark:shadow-dark-neumorphic">
          <div className="w-full h-96 bg-gray-300 dark:bg-gray-600"></div>
        </div>

        <article className="mb-12">
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-6"></div>
          
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </article>

        <section className="dark:bg-gray-800 p-6 rounded-lg shadow-neumorphic dark:shadow-dark-neumorphic">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
            <div className="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>

          <div className="space-y-6">
            <SkeletonComment />
            <SkeletonComment replies={true} />
            <SkeletonComment />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SkeletonBlogDetail; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import { IoMdSearch } from 'react-icons/io';
import { FaFilter } from 'react-icons/fa';
import SkeletonBlogCard from '../components/SkeletonBlogCard';
import { Blog } from '../types/blog';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'tech', label: 'Technology' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Health' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const handleUpdatedBlog = (updatedBlog: Blog) => {
    setBlogs(prev => prev.map(blog =>
      blog._id === updatedBlog._id ? updatedBlog : blog
    ));
    applyFilters();
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/blog`;
      if (selectedCategory) {
        url += `?category=${selectedCategory}`;
      }

      const response = await axios.get<Blog[]>(url);
      setBlogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory]);

  useEffect(() => {
    applyFilters();
  }, [blogs, searchTerm, sortBy]);

  const applyFilters = () => {
    let result = [...blogs];


    if (searchTerm) {
      result = result.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }


    switch (sortBy) {
      case 'newest':
        result = [...result].sort((a, b) => {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
        break;
      case 'oldest':
        result = [...result].sort((a, b) => {
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        });
        break;
      case 'popular':
        result = [...result].sort((a, b) => b.likes.length - a.likes.length);
        break;
      default:
        break;
    }

    setFilteredBlogs(result);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const renderSkeletonLoaders = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <SkeletonBlogCard key={index} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen max-w-screen-xl mx-auto px-4">
      <div className="py-8">

        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg
                  shadow-neumorphic dark:shadow-dark-neumorphic
                  focus:shadow-neumorphic-inset dark:focus:shadow-dark-neumorphic-inset
                  transition-shadow duration-300
                  bg-gray-100 dark:bg-gray-800 
                  text-gray-600 dark:text-gray-300 outline-none"
            />
            <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          </div>

          <button
            onClick={toggleFilters}
            className="md:hidden px-4 py-2 rounded-lg
                shadow-neumorphic dark:shadow-dark-neumorphic
                hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                transition-shadow duration-300
                bg-gray-100 dark:bg-gray-800 
                text-gray-600 dark:text-gray-300 font-medium
                flex items-center gap-2"
          >
            <FaFilter />
            Filters
          </button>

          <div className={`
            md:flex gap-4 
            ${showFilters ? 'block' : 'hidden md:flex'} 
            mb-4
          `}>
            <div className="w-full md:w-auto mb-4 md:mb-0">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full md:w-auto px-4 py-2 rounded-lg
                  shadow-neumorphic dark:shadow-dark-neumorphic
                  focus:shadow-neumorphic-inset dark:focus:shadow-dark-neumorphic-inset
                  transition-shadow duration-300
                  bg-gray-100 dark:bg-gray-800 
                  text-gray-600 dark:text-gray-300 outline-none cursor-pointer"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>


            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full md:w-auto px-4 py-2 rounded-lg
                  shadow-neumorphic dark:shadow-dark-neumorphic
                  focus:shadow-neumorphic-inset dark:focus:shadow-dark-neumorphic-inset
                  transition-shadow duration-300
                  bg-gray-100 dark:bg-gray-800 
                  text-gray-600 dark:text-gray-300 outline-none cursor-pointer"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>




        {!loading && (
          <div className="text-gray-600 dark:text-gray-400 mb-6">
            Showing {filteredBlogs.length} of {blogs.length} blog posts
          </div>
        )}


        {loading ? (
          renderSkeletonLoaders()
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBlogs.map(blog => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onLike={handleUpdatedBlog}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No blogs found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSortBy('newest');
              }}
              className="mt-4 px-4 py-2 rounded-lg
                shadow-neumorphic dark:shadow-dark-neumorphic
                hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                transition-shadow duration-300
                bg-gray-100 dark:bg-gray-800 
                text-gray-600 dark:text-gray-300 font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs; 
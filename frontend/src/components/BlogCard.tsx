import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Blog {
    _id: string;
    title: string;
    content: string;
    slug: string,
    likes: string[];
    comments: Array<string>;
    createdAt?: string;
    category?: string;
    image?: string;
}

interface BlogCardProps {
    blog: Blog;
    onLike?: (updatedBlog: Blog) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onLike }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(user ? blog.likes.includes(user.id) : false);
    const [likesCount, setLikesCount] = useState(blog.likes.length);
    const [commentsCount, setCommentsCount] = useState(blog.comments.length);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const truncateContent = (content: string, maxLength: number = 120) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const getCategoryColor = (category?: string) => {
        const colors: Record<string, string> = {
            'tech': 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
            'lifestyle': 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
            'education': 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
            'health': 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
        };
        
        return colors[category || ''] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
    };

    const handleLike = useCallback(async () => {
        if (!user) {
            toast.error('Please login to like posts');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/blog/${blog._id}/like`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            const updatedBlog = response.data;
            setIsLiked(updatedBlog.likes.includes(user.id));
            setLikesCount(updatedBlog.likes.length);
            
            if (onLike) {
                onLike(updatedBlog);
            }
        } catch (error) {
            console.error('Error liking blog: ', error);
            toast.error('Error liking the post. Please try again.');
        }
    }, [blog._id, user, navigate, onLike]);

    return (
        <div className="h-full rounded-2xl overflow-hidden shadow-neumorphic dark:shadow-dark-neumorphic bg-white dark:bg-gray-800 transition duration-300 hover:shadow-neumorphic-hover dark:hover:shadow-dark-neumorphic-hover z-10 neumorphic-card flex flex-col">
            <div className="relative aspect-[16/9] overflow-hidden">
                {blog.image ? (
                    <img 
                        src={blog.image.startsWith('http') ? blog.image : `${API_BASE_URL}/${blog.image}`} 
                        alt={blog.title} 
                        className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400 text-lg">No Image</span>
                    </div>
                )}
                
                {blog.category && (
                    <div className="absolute top-2 right-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(blog.category)}`}>
                            {blog.category.charAt(0).toUpperCase() + blog.category.slice(1)}
                        </span>
                    </div>
                )}
            </div>
            
            <div className="p-3 sm:p-4 flex flex-col flex-grow">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2 line-clamp-2">
                    <Link to={`/blog/${blog.slug}`} className="hover:text-blue-500 dark:hover:text-blue-400 transition duration-300">
                        {blog.title}
                    </Link>
                </h3>
                
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                    {truncateContent(blog.content)}
                </p>
                
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-auto pt-3">
                    <div className="flex items-center space-x-4 sm:space-x-4">
                        <button 
                            onClick={handleLike}
                            className="flex items-center gap-1.5 transition duration-300 hover:text-red-500 py-1"
                            aria-label={isLiked ? "Unlike this post" : "Like this post"}
                        >
                            {isLiked ? (
                                <FaHeart className="text-red-500 text-lg sm:text-base" />
                            ) : (
                                <FaRegHeart className="text-lg sm:text-base" />
                            )}
                            <span className="text-sm sm:text-xs">{likesCount}</span>
                        </button>
                        
                        <Link 
                            to={`/blog/${blog.slug}#comments`}
                            className="flex items-center gap-1.5 transition duration-300 hover:text-blue-500 py-1"
                        >
                            <FaComment className="text-lg sm:text-base" />
                            <span className="text-sm sm:text-xs">{commentsCount}</span>
                        </Link>
                    </div>
                    
                    <span>{formatDate(blog.createdAt)}</span>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
import React, { useState, useEffect } from 'react';
import { FiUsers, FiFileText, FiMessageSquare, FiRefreshCw, FiAlertCircle, FiTrendingUp, FiBarChart2, FiStar } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';
import { Link } from 'react-router';

interface Stat {
    count: number;
    change: string;
    period: string;
}

interface DashboardStats {
    users: Stat;
    blogs: Stat;
    comments: Stat;
}

interface CategoryStats {
    category: string;
    count: number;
    totalComments: number;
    totalLikes: number;
    engagement: number;
}

interface AuthorStats {
    userId: string;
    name: string;
    blogCount: number;
    totalComments: number;
    totalLikes: number;
    engagement: number;
}

interface Activity {
    type: 'user' | 'blog' | 'comment';
    action: string;
    message: string;
    details: any;
    timestamp: string;
}

interface PopularBlog {
    _id: string;
    title: string;
    category: string;
    status: string;
    createdAt: string;
    authorName: string;
    commentCount: number;
    likeCount: number;
    engagement: number;
}

const API_URL = import.meta.env.VITE_API_BASE_URL;

const DashboardHome: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [categories, setCategories] = useState<CategoryStats[]>([]);
    const [topAuthors, setTopAuthors] = useState<AuthorStats[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [popularBlogs, setPopularBlogs] = useState<PopularBlog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('user') 
                ? JSON.parse(localStorage.getItem('user') || '{}').token 
                : null;
                
            const headers = {
                Authorization: `Bearer ${token}`
            };
            
            const response = await axios.get(`${API_URL}/api/dashboard/stats`, { headers });
            
            if (response.data.success) {
                setStats(response.data.stats);
                setCategories(response.data.blogsByCategory);
                setTopAuthors(response.data.topAuthors);
                setActivities(response.data.recentActivity);
                setPopularBlogs(response.data.popularBlogs);
            } else {
                throw new Error('Failed to load dashboard data');
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to fetch dashboard data. Please try again.');
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'user':
                return <FiUsers className="text-blue-500" />;
            case 'blog':
                return <FiFileText className="text-green-500" />;
            case 'comment':
                return <FiMessageSquare className="text-purple-500" />;
            default:
                return <FiAlertCircle className="text-gray-500" />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'user':
                return 'bg-blue-100 dark:bg-blue-900';
            case 'blog':
                return 'bg-green-100 dark:bg-green-900';
            case 'comment':
                return 'bg-purple-100 dark:bg-purple-900';
            default:
                return 'bg-gray-100 dark:bg-gray-900';
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <CgSpinner fontSize={24} className="animate-spin dark:text-gray-200" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Dashboard Overview</h1>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={fetchDashboardData}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg
                            shadow-neumorphic dark:shadow-dark-neumorphic
                            hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                            text-gray-600 dark:text-gray-300 transition-shadow duration-300 text-sm"
                    >
                        <FiRefreshCw className="text-sm" />
                        Refresh
                    </button>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Last updated: {new Date().toLocaleString()}
                    </div>
                </div>
            </div>
            
            {error && (
                <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded-lg flex items-center gap-3">
                    <FiAlertCircle className="text-xl" />
                    <span>{error}</span>
                </div>
            )}
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats && Object.entries(stats).map(([key, stat]) => (
                    <div 
                        key={key}
                        className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6
                            shadow-neumorphic dark:shadow-dark-neumorphic"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </p>
                                <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300 mt-2">
                                    {stat.count.toLocaleString()}
                                </h2>
                                <p className={`${stat.change.startsWith('-') ? 'text-red-500' : 'text-green-500'} text-sm mt-2 flex items-center`}>
                                    <FiTrendingUp className={`mr-1 ${stat.change.startsWith('-') ? 'transform rotate-180' : ''}`} />
                                    {stat.change}
                                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                                        {stat.period}
                                    </span>
                                </p>
                            </div>
                            <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg
                                shadow-neumorphic-sm dark:shadow-dark-neumorphic-sm">
                                {key === 'users' && <FiUsers className="text-2xl text-blue-500" />}
                                {key === 'blogs' && <FiFileText className="text-2xl text-green-500" />}
                                {key === 'comments' && <FiMessageSquare className="text-2xl text-purple-500" />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Category Distribution and Top Authors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Distribution */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6
                    shadow-neumorphic dark:shadow-dark-neumorphic">
                    <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                        <FiBarChart2 className="mr-2" />
                        Category Distribution
                    </h2>
                    <div className="space-y-4">
                        {categories.map((category) => (
                            <div 
                                key={category.category}
                                className="p-4 rounded-lg shadow-neumorphic-sm dark:shadow-dark-neumorphic-sm"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium text-gray-700 dark:text-gray-300">
                                        {category.category.charAt(0).toUpperCase() + category.category.slice(1)}
                                    </h3>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {category.count} posts
                                    </span>
                                </div>
                                <div className="flex gap-4 text-sm">
                                    <div className="flex items-center text-blue-500">
                                        <FiMessageSquare className="mr-1" />
                                        {category.totalComments} comments
                                    </div>
                                    <div className="flex items-center text-green-500">
                                        <FiStar className="mr-1" />
                                        {category.totalLikes} likes
                                    </div>
                                    <div className="flex items-center text-purple-500">
                                        <FiTrendingUp className="mr-1" />
                                        {category.engagement} engagement
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Authors */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6
                    shadow-neumorphic dark:shadow-dark-neumorphic">
                    <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                        <FiStar className="mr-2" />
                        Top Authors
                    </h2>
                    <div className="space-y-4">
                        {topAuthors.map((author) => (
                            <div 
                                key={author.userId}
                                className="p-4 rounded-lg shadow-neumorphic-sm dark:shadow-dark-neumorphic-sm"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium text-gray-700 dark:text-gray-300">
                                        {author.name}
                                    </h3>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {author.blogCount} posts
                                    </span>
                                </div>
                                <div className="flex gap-4 text-sm">
                                    <div className="flex items-center text-blue-500">
                                        <FiMessageSquare className="mr-1" />
                                        {author.totalComments} comments
                                    </div>
                                    <div className="flex items-center text-green-500">
                                        <FiStar className="mr-1" />
                                        {author.totalLikes} likes
                                    </div>
                                    <div className="flex items-center text-purple-500">
                                        <FiTrendingUp className="mr-1" />
                                        {author.engagement} engagement
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity and Popular Blogs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6
                    shadow-neumorphic dark:shadow-dark-neumorphic">
                    <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                        Recent Activity
                    </h2>
                    <div className="space-y-4">
                        {activities.length > 0 ? (
                            activities.map((activity, index) => (
                                <div 
                                    key={index}
                                    className={`flex items-start p-4 rounded-lg
                                        shadow-neumorphic-sm dark:shadow-dark-neumorphic-sm
                                        ${getActivityColor(activity.type)}`}
                                >
                                    <div className="p-2 rounded-full bg-white dark:bg-gray-800 mr-3
                                        shadow-neumorphic-sm dark:shadow-dark-neumorphic-sm">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {activity.message}
                                        </p>
                                        {activity.details && (
                                            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                {activity.type === 'comment' && (
                                                    <p className="italic">"{activity.details.content}"</p>
                                                )}
                                                {activity.type === 'user' && (
                                                    <p>Role: {activity.details.role}</p>
                                                )}
                                                {activity.type === 'blog' && (
                                                    <p>Category: {activity.details.category}</p>
                                                )}
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(activity.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                No recent activities found
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Popular Blogs */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6
                    shadow-neumorphic dark:shadow-dark-neumorphic">
                    <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                        Popular Blogs
                    </h2>
                    <div className="space-y-4">
                        {popularBlogs.length > 0 ? (
                            popularBlogs.map((blog) => (
                                <Link
                                    key={blog._id}
                                    to={`/blogs/${blog._id}`}
                                    className="block p-4 rounded-lg shadow-neumorphic-sm dark:shadow-dark-neumorphic-sm
                                        hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                        transition-shadow duration-300"
                                >
                                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {blog.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="text-gray-500 dark:text-gray-400">
                                            By {blog.authorName}
                                        </div>
                                        <div className="flex items-center text-blue-500">
                                            <FiMessageSquare className="mr-1" />
                                            {blog.commentCount} comments
                                        </div>
                                        <div className="flex items-center text-green-500">
                                            <FiStar className="mr-1" />
                                            {blog.likeCount} likes
                                        </div>
                                        <div className="flex items-center text-purple-500">
                                            <FiTrendingUp className="mr-1" />
                                            {blog.engagement} engagement
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <span>Category: {blog.category}</span>
                                        <span>Status: {blog.status}</span>
                                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                No popular blogs found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome; 
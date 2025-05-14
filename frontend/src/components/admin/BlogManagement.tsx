import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiSearch, FiPlus, FiEye, FiCheck, FiX, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router';
import { CgSpinner } from 'react-icons/cg';
const API_URL = import.meta.env.VITE_API_BASE_URL;

interface Blog {
    _id: string;
    title: string;
    content: string;
    category: string;
    slug: string;
    status: 'draft' | 'published';
    author: {
        _id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    likes: string[];
    comments: string[];
    image?: string;
}

interface CreateBlogFormData {
    title: string;
    content: string;
    category: string;
    status: 'draft' | 'published';
    image?: File | null;
}

const BlogFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (blog: CreateBlogFormData) => void;
    initialData?: Blog;
    title: string;
}> = ({ isOpen, onClose, onSave, initialData, title }) => {
    const [formData, setFormData] = useState<CreateBlogFormData>({
        title: initialData?.title || '',
        content: initialData?.content || '',
        category: initialData?.category || 'tech',
        status: (initialData?.status as ('draft' | 'published')) || 'draft',
        image: null
    });
    const [saving, setSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                content: initialData.content || '',
                category: initialData.category || 'tech',
                status: (initialData.status as ('draft' | 'published')) || 'draft',
                image: null
            });
            setImagePreview(initialData.image || null);
        }
    }, [initialData]);

    const categories = [
        { value: 'tech', label: 'Technology' },
        { value: 'lifestyle', label: 'Lifestyle' },
        { value: 'education', label: 'Education' },
        { value: 'health', label: 'Health' }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            image: file
        }));

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null
        }));
        setImagePreview(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-neumorphic dark:shadow-dark-neumorphic max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                        <FiX />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg
                                shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                                focus:outline-none
                                bg-gray-100 dark:bg-gray-800
                                text-gray-700 dark:text-gray-300"
                        />
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Featured Image
                        </label>
                        <div className="mt-1 flex items-center">
                            <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
                                {imagePreview ? (
                                    <div className="relative w-full">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="max-h-36 mx-auto rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white"
                                        >
                                            <FiX size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <svg 
                                            className="w-8 h-8" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24" 
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth="2" 
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                                            />
                                        </svg>
                                        <span className="mt-2 text-sm">Select an image</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">(Max size: 5MB)</span>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    id="image" 
                                    name="image" 
                                    accept="image/*" 
                                    onChange={handleImageChange}
                                    className="hidden" 
                                />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Content
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={10}
                            className="w-full px-4 py-2 rounded-lg
                                shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                                focus:outline-none
                                bg-gray-100 dark:bg-gray-800
                                text-gray-700 dark:text-gray-300"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg
                                    shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                                    focus:outline-none
                                    bg-gray-100 dark:bg-gray-800
                                    text-gray-700 dark:text-gray-300"
                            >
                                {categories.map(category => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg
                                    shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                                    focus:outline-none
                                    bg-gray-100 dark:bg-gray-800
                                    text-gray-700 dark:text-gray-300"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg mr-2
                                shadow-neumorphic dark:shadow-dark-neumorphic
                                hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                transition-shadow duration-300
                                bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 rounded-lg
                                shadow-neumorphic dark:shadow-dark-neumorphic
                                hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                transition-shadow duration-300
                                bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200
                                flex items-center"
                        >
                            <FiSave className="mr-2" />
                            {saving ? 'Saving...' : 'Save Blog'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const BlogManagement: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const { user } = useAuth();

    const categories = [
        { value: '', label: 'All Categories' },
        { value: 'tech', label: 'Technology' },
        { value: 'lifestyle', label: 'Lifestyle' },
        { value: 'education', label: 'Education' },
        { value: 'health', label: 'Health' }
    ];

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            if (!user?.token) {
                console.error('No authentication token available');
                toast.error('Authentication error: Please login again');
                setLoading(false);
                return;
            }
            
            console.log('Using token:', user?.token);
            console.log(`Using API endpoint: ${API_URL}/blog/admin`);
            
            try {
                console.log('Attempting to fetch from admin endpoint');
                const response = await axios.get(`${API_URL}/blog/admin`, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`
                    }
                });
                console.log('Blogs from admin endpoint:', response.data);
                setBlogs(Array.isArray(response.data) ? response.data : []);
                setLoading(false);
            } catch (adminEndpointError) {
                console.error("Admin endpoint failed", adminEndpointError);
                toast.error('Could not fetch blogs from admin endpoint');
                setLoading(false);
                setBlogs([]);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            toast.error('Failed to load blogs');
            setBlogs([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [user?.token]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };

    const filteredBlogs = blogs ? blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             blog.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? blog.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    }) : [];

    const handleDeleteBlog = async (blogId: string) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;
        
        try {
            if (!user?.token) {
                console.error('No authentication token available');
                toast.error('Authentication error: Please login again');
                return;
            }
            
            console.log(`Attempting to delete blog`, blogId);
            console.log(`Using API endpoint: ${API_URL}/blog/${blogId}`);
            
            await axios.delete(`${API_URL}/blog/${blogId}`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            
            toast.success('Blog deleted successfully');
            setBlogs(blogs ? blogs.filter(blog => blog._id !== blogId) : []);
        } catch (error) {
            console.error('Error deleting blog:', error);
            console.error('Request details:', {
                url: `${API_URL}/blog/${blogId}`,
                token: user?.token ? 'Token exists' : 'No token',
                blogId: blogId
            });
            toast.error('Failed to delete blog. Check console for details.');
        }
    };

    const handleToggleStatus = async (blog: Blog) => {
        try {
            const newStatus = blog.status === 'published' ? 'draft' : 'published';
            
            if (!user?.token) {
                console.error('No authentication token available');
                toast.error('Authentication error: Please login again');
                return;
            }
            
            console.log(`Attempting to update blog status to ${newStatus}`, blog._id);
            console.log(`Using API endpoint: ${API_URL}/blog/${blog._id}/status`);
            
            await axios.patch(`${API_URL}/blog/${blog._id}/status`, 
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`
                    }
                }
            );
            
            if (blogs) {
                setBlogs(blogs.map(b => 
                    b._id === blog._id ? { ...b, status: newStatus } : b
                ));
            }
            
            toast.success(`Blog is now ${newStatus}`);
        } catch (error) {
            console.error('Error updating blog status:', error);
            console.error('Request details:', {
                url: `${API_URL}/blog/${blog._id}/status`,
                token: user?.token ? 'Token exists' : 'No token',
                blogId: blog._id,
                newStatus: blog.status === 'published' ? 'draft' : 'published'
            });
            toast.error('Failed to update blog status. Check console for details.');
        }
    };

    const handleCreateBlog = async (blogData: CreateBlogFormData) => {
        try {
            if (!user?.token) {
                console.error('No authentication token available');
                toast.error('Authentication error: Please login again');
                return false;
            }
            
            const formData = new FormData();
            formData.append('title', blogData.title);
            formData.append('content', blogData.content);
            formData.append('category', blogData.category);
            formData.append('status', blogData.status);
            
            if (blogData.image) {
                formData.append('image', blogData.image);
            }
            
            console.log('Submitting blog data:', blogData);
            console.log('Image file included:', blogData.image ? 'Yes' : 'No');
            
            const response = await axios.post(`${API_URL}/blog`, formData, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success('Blog created successfully');
            
            if (response.data.blog) {
                setBlogs(prevBlogs => [response.data.blog, ...prevBlogs]);
            }
            
            setShowCreateModal(false);
            return true;
        } catch (error) {
            console.error('Error creating blog:', error);
            toast.error('Failed to create blog. Check console for details.');
            return false;
        }
    };

    const handleEditBlog = async (blogData: CreateBlogFormData) => {
        try {
            if (!editingBlog) return false;

            if (!user?.token) {
                console.error('No authentication token available');
                toast.error('Authentication error: Please login again');
                return false;
            }
            
            const formData = new FormData();
            formData.append('title', blogData.title);
            formData.append('content', blogData.content);
            formData.append('category', blogData.category);
            formData.append('status', blogData.status);
            
            if (blogData.image) {
                formData.append('image', blogData.image);
            }
            
            console.log('Updating blog data:', blogData);
            console.log('Image file included:', blogData.image ? 'Yes' : 'No');
            
            const response = await axios.put(`${API_URL}/blog/${editingBlog._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success('Blog updated successfully');
            
            setBlogs(prevBlogs => 
                prevBlogs.map(blog => 
                    blog._id === editingBlog._id ? response.data.blog : blog
                )
            );
            
            setEditingBlog(null);
            return true;
        } catch (error) {
            console.error('Error updating blog:', error);
            console.error('Request details:', {
                blogId: editingBlog?._id,
                token: user?.token ? 'Token exists' : 'No token'
            });
            toast.error('Failed to update blog. Check console for details.');
            return false;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
           <div className="flex justify-center items-center h-64">
            <CgSpinner fontSize={24} className="animate-spin dark:text-gray-200" />
           </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Blog Management</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 rounded-lg
                        shadow-neumorphic dark:shadow-dark-neumorphic
                        hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                        transition-shadow duration-300
                        bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200
                        flex items-center"
                >
                    <FiPlus className="mr-2" />
                    Create New Blog
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2 rounded-lg
                            shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                            focus:outline-none
                            bg-gray-100 dark:bg-gray-800
                            text-gray-700 dark:text-gray-300"
                    />
                </div>

                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-2 rounded-lg
                        shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                        focus:outline-none
                        bg-gray-100 dark:bg-gray-800
                        text-gray-700 dark:text-gray-300"
                >
                    {categories.map(category => (
                        <option key={category.value} value={category.value}>
                            {category.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto">
                <div className="shadow-neumorphic dark:shadow-dark-neumorphic rounded-lg p-0.5">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredBlogs.length > 0 ? (
                                filteredBlogs.map(blog => (
                                    <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{blog.title}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                                {blog.content ? blog.content.replace(/<[^>]*>?/gm, '').substring(0, 50) + '...' : 'No content'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button 
                                                onClick={() => handleToggleStatus(blog)}
                                                className={`
                                                    px-2 py-1 inline-flex items-center text-xs leading-5 
                                                    font-semibold rounded-full
                                                    ${blog.status === 'published' 
                                                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                                                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}
                                                    shadow-neumorphic-sm dark:shadow-dark-neumorphic-sm
                                                    hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                                    transition-shadow duration-300
                                                `}
                                            >
                                                {blog.status === 'published' ? (
                                                    <>
                                                        <FiCheck className="mr-1" /> Published
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiX className="mr-1" /> Draft
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {formatDate(blog.updatedAt || blog.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <Link 
                                                    to={`/blog/${blog.slug}`}
                                                    className="p-2 rounded-lg
                                                        shadow-neumorphic-sm dark:shadow-dark-neumorphic-sm
                                                        hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                                        transition-shadow duration-300
                                                        text-blue-500 dark:text-blue-400"
                                                    title="View Blog"
                                                >
                                                    <FiEye />
                                                </Link>
                                                <button
                                                    onClick={() => setEditingBlog(blog)}
                                                    className="p-2 rounded-lg
                                                        shadow-neumorphic-sm dark:shadow-dark-neumorphic-sm
                                                        hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                                        transition-shadow duration-300
                                                        text-amber-500 dark:text-amber-400"
                                                    title="Edit Blog"
                                                >
                                                    <FiEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBlog(blog._id)}
                                                    className="p-2 rounded-lg
                                                        shadow-neumorphic-sm dark:shadow-dark-neumorphic-sm
                                                        hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                                        transition-shadow duration-300
                                                        text-red-500 dark:text-red-400"
                                                    title="Delete Blog"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No blogs found matching your criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <BlogFormModal 
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSave={handleCreateBlog}
                title="Create New Blog"
            />
            
            {editingBlog && (
                <BlogFormModal 
                    isOpen={!!editingBlog}
                    onClose={() => setEditingBlog(null)}
                    onSave={handleEditBlog}
                    initialData={editingBlog}
                    title={`Edit Blog: ${editingBlog.title}`}
                />
            )}
        </div>
    );
};

export default BlogManagement; 
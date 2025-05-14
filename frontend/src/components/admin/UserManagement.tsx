import React, { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiUserPlus, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';
import { useAuth } from '../../hooks/useAuth';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
}

interface UserFormData {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const UserManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [editingRoleFor, setEditingRoleFor] = useState<string | null>(null);
    const { user: currentUser } = useAuth();

    const getToken = () => {
        const userJson = localStorage.getItem('user');
        if (!userJson) return null;
        
        try {
            const user = JSON.parse(userJson);
            return user.token;
        } catch (error) {
            return null;
        }
    };

    const getHeaders = () => ({
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/users`, getHeaders());
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const createUser = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(
                `${API_URL}/api/users`, 
                formData, 
                getHeaders()
            );
            
            toast.success('User created successfully');
            fetchUsers();
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            console.error('Error creating user:', error);
            toast.error(error.response?.data?.message || 'Failed to create user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            setIsDeleting(userId);
            await axios.delete(`${API_URL}/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${currentUser?.token}` }
            });
            
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            toast.success('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user. Please try again later.');
        } finally {
            setIsDeleting(null);
        }
    };

    const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
        try {
            await axios.patch(
                `${API_URL}/api/users/${userId}/role`, 
                { role: newRole }, 
                getHeaders()
            );
            
            toast.success(`User role updated to ${newRole}`);
            setUsers(users.map(user => 
                user._id === userId ? { ...user, role: newRole } : user
            ));
            setEditingRoleFor(null);
        } catch (error: any) {
            console.error('Error updating user role:', error);
            toast.error(error.response?.data?.message || 'Failed to update user role');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'user'
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createUser();
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">User Management</h1>
                
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 px-4 py-2 pl-10 rounded-lg
                                bg-gray-100 dark:bg-gray-800
                                shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                                text-gray-700 dark:text-gray-300
                                focus:outline-none"
                        />
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                    
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg
                            shadow-neumorphic dark:shadow-dark-neumorphic
                            hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                            text-gray-700 dark:text-gray-300 transition-shadow duration-300"
                    >
                        <FiUserPlus />
                        <span>Add User</span>
                    </button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="py-10 flex justify-center">
                        <CgSpinner fontSize={24} className="animate-spin dark:text-gray-200" />
                    </div>
                ) : (
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg 
                        shadow-neumorphic dark:shadow-dark-neumorphic p-1">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {user.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {editingRoleFor === user._id ? (
                                                    <div className="flex items-center space-x-2">
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => {
                                                                const newRole = e.target.value as 'user' | 'admin';
                                                                updateUserRole(user._id, newRole);
                                                            }}
                                                            className="px-2 py-1 rounded text-xs bg-gray-200 dark:bg-gray-700 
                                                                text-gray-700 dark:text-gray-300 border-none
                                                                shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset"
                                                        >
                                                            <option value="user">user</option>
                                                            <option value="admin">admin</option>
                                                        </select>
                                                        <button
                                                            onClick={() => setEditingRoleFor(null)}
                                                            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                        >
                                                            <FiX size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span
                                                        onClick={() => setEditingRoleFor(user._id)}
                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer
                                                            ${user.role === 'admin' 
                                                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                                                                : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'}`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                <div className="flex justify-end space-x-2">
                                                    {userToDelete === user._id ? (
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-xs text-red-500">Confirm?</span>
                                                            <button
                                                                onClick={() => deleteUser(user._id)}
                                                                className="p-1 rounded text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                                                                disabled={isDeleting === user._id}
                                                            >
                                                                {isDeleting === user._id ? <FiLoader className="animate-spin" /> : <FiCheck />}
                                                            </button>
                                                            <button
                                                                onClick={() => setUserToDelete(null)}
                                                                className="p-1 rounded text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                                                disabled={isDeleting === user._id}
                                                            >
                                                                <FiX />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setUserToDelete(user._id)}
                                                            className="p-1 rounded text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {filteredUsers.length} of {users.length} users
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-neumorphic dark:shadow-dark-neumorphic relative z-10 w-full max-w-md">
                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">Create New User</h3>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg
                                            bg-gray-100 dark:bg-gray-800
                                            shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                                            text-gray-700 dark:text-gray-300
                                            focus:outline-none"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg
                                            bg-gray-100 dark:bg-gray-800
                                            shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                                            text-gray-700 dark:text-gray-300
                                            focus:outline-none"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg
                                            bg-gray-100 dark:bg-gray-800
                                            shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                                            text-gray-700 dark:text-gray-300
                                            focus:outline-none"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Role
                                    </label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg
                                            bg-gray-100 dark:bg-gray-800
                                            shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                                            text-gray-700 dark:text-gray-300
                                            focus:outline-none"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 rounded-lg
                                            shadow-neumorphic dark:shadow-dark-neumorphic
                                            hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                            text-gray-600 dark:text-gray-400 transition-shadow duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 rounded-lg
                                            shadow-neumorphic dark:shadow-dark-neumorphic
                                            hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                            text-blue-600 dark:text-blue-400 transition-shadow duration-300
                                            flex items-center gap-2"
                                    >
                                        {isSubmitting ? <FiLoader className="animate-spin" /> : <FiUserPlus />}
                                        <span>Create User</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement; 
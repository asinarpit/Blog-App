import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import {
    FiHome,
    FiUsers,
    FiFileText,
    FiSettings,
    FiX,
    FiLogOut,
    FiExternalLink
} from 'react-icons/fi';
import ThemeToggleButton from '../ThemeToggleButton';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

interface SiteSettings {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    enableRegistration: boolean;
    maintenanceMode: boolean;
    footerText: string;
    socialLinks: {
        twitter: string;
        facebook: string;
        instagram: string;
    };
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/settings`, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`
                    }
                });
                
                if (response.data) {
                    setSettings(response.data);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching settings:', error);
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchSettings();
        }
    }, [user?.token]);

    const menuItems = [
        {
            path: '/admin',
            icon: <FiHome className="text-xl" />,
            label: 'Dashboard',
            exact: true
        },
        {
            path: '/admin/users',
            icon: <FiUsers className="text-xl" />,
            label: 'Users',
            exact: false
        },
        {
            path: '/admin/blogs',
            icon: <FiFileText className="text-xl" />,
            label: 'Blogs',
            exact: false
        },
        {
            path: '/admin/settings',
            icon: <FiSettings className="text-xl" />,
            label: 'Settings',
            exact: false
        }
    ];

    const isActivePath = (path: string, exact: boolean) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    const getTitle = () => {
        if (loading) return "Admin Panel";
        return settings?.siteName ? `${settings.siteName} Admin` : "Admin Panel";
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <div className={`
                h-full bg-gray-100 dark:bg-gray-800 z-30
                shadow-neumorphic dark:shadow-dark-neumorphic
                transition-all duration-300
                flex-shrink-0 w-64
                md:relative md:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                fixed md:static inset-y-0 left-0
            `}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-xl font-bold text-gray-700 dark:text-gray-300 truncate">
                            {getTitle()}
                        </h1>
                        <button
                            onClick={toggleSidebar}
                            className="p-1 rounded-lg text-gray-600 dark:text-gray-400 md:hidden
                                shadow-neumorphic-sm dark:shadow-dark-neumorphic-sm
                                hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                transition-shadow duration-300"
                        >
                            <FiX className="text-lg" />
                        </button>
                    </div>

                    <nav className="p-4 flex-1 overflow-y-auto">
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`
                                            flex items-center px-4 py-3 rounded-lg
                                            ${isActivePath(item.path, item.exact)
                                                ? 'shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset bg-gray-200 dark:bg-gray-700'
                                                : 'shadow-neumorphic dark:shadow-dark-neumorphic hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset'}
                                            transition-shadow duration-300
                                            text-gray-600 dark:text-gray-300
                                        `}
                                        onClick={() => {
                                            if (window.innerWidth < 768) {
                                                toggleSidebar();
                                            }
                                        }}
                                    >
                                        <span className="mr-3">{item.icon}</span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        <div className="flex items-center justify-center mb-2 md:hidden">
                            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium mr-2">
                                Switch Theme : 
                            </span>
                            <ThemeToggleButton />
                        </div>
                        <Link
                            to="/"
                            className="w-full flex items-center px-4 py-3 rounded-lg
                                shadow-neumorphic dark:shadow-dark-neumorphic
                                hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                transition-shadow duration-300
                                text-blue-500 dark:text-blue-400"
                        >
                            <FiExternalLink className="mr-3 text-xl" />
                            Go to Home
                        </Link>
                        
                        <button
                            onClick={logout}
                            className="w-full flex items-center px-4 py-3 rounded-lg
                                shadow-neumorphic dark:shadow-dark-neumorphic
                                hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                transition-shadow duration-300
                                text-red-500 dark:text-red-400"
                        >
                            <FiLogOut className="mr-3 text-xl" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar; 
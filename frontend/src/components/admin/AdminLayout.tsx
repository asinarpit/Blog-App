import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { FiMenu } from 'react-icons/fi';
import Sidebar from './Sidebar';
import ThemeToggleButton from '../ThemeToggleButton';

const AdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col overflow-auto">
                <header className="bg-gray-100 dark:bg-gray-800 shadow-neumorphic-sm dark:shadow-dark-neumorphic-sm p-4 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 md:hidden
                                    shadow-neumorphic dark:shadow-dark-neumorphic
                                    hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                    transition-shadow duration-300 mr-3"
                            >
                                <FiMenu className="text-lg" />
                            </button>
                            <h1 className="hidden sm:block text-xl font-bold text-gray-700 dark:text-gray-300">
                                Admin Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:block">
                                <ThemeToggleButton />
                            </div>  

                            <div className="text-gray-600 dark:text-gray-300 font-medium text-right">
                                Welcome, {user?.name}
                                <span className="ml-2 inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                    Admin
                                </span>
                            </div>

                        </div>


                    </div>
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>

                <footer className="bg-gray-100 dark:bg-gray-800 p-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                    Admin Dashboard © {new Date().getFullYear()} - All rights reserved
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout; 
import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { FiMenu } from 'react-icons/fi';
import Sidebar from '../../components/admin/Sidebar';

const AdminDashboard: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col overflow-auto">
                <header className="bg-gray-100 dark:bg-gray-800 shadow-neumorphic-sm dark:shadow-dark-neumorphic-sm p-4 z-10">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 md:hidden
                                shadow-neumorphic dark:shadow-dark-neumorphic
                                hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                transition-shadow duration-300"
                        >
                            <FiMenu className="text-lg" />
                        </button>

                        <div className="text-gray-600 dark:text-gray-300 font-medium">
                            Welcome, {user?.name}
                            <span className="ml-2 inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                Admin
                            </span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard; 
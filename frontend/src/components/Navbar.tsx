import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { FiMenu, FiX, FiSettings } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaPenAlt, FaChevronDown } from "react-icons/fa";
import { HiLogin, HiLogout } from "react-icons/hi";
import { RiDashboardLine } from "react-icons/ri";
import ThemeToggleButton from "./ThemeToggleButton";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

export const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const settingsRef = useRef<HTMLDivElement>(null);
    const isAuthenticated = !!user?.id;
    const navigate = useNavigate();

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
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };

        fetchSettings();
    }, [user?.token]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setSettingsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navItems = [
        {
            title: "Home",
            link: "/",
            icon: <FaUserCircle className="mr-2" />
        },
        {
            title: "Blogs",
            link: "/blogs",
            icon: <FaPenAlt className="mr-2" />
        }
    ];

    const handleSettingsClick = () => {
        setSettingsOpen(!isSettingsOpen);
    };

    const siteName = settings?.siteName || "Blog";

    return (
        <nav className="fixed top-0 w-full bg-gray-100 dark:bg-gray-800 z-50 
            shadow-neumorphic dark:shadow-dark-neumorphic">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    <Link 
                        to="/" 
                        className="flex items-center text-gray-600 dark:text-gray-300 text-xl font-bold p-2 rounded-lg
                            shadow-neumorphic dark:shadow-dark-neumorphic 
                            hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                            transition-shadow duration-300"
                    >
                        {siteName}
                    </Link>

                    <div className="flex items-center gap-4">
                        <ThemeToggleButton/>
                        
                        <div className="hidden md:flex items-center space-x-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.title}
                                    to={item.link}
                                    className="flex items-center px-4 py-2 rounded-lg 
                                        text-gray-600 dark:text-gray-300
                                        shadow-neumorphic dark:shadow-dark-neumorphic
                                        hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                        transition-shadow duration-300"
                                >
                                    {item.icon}
                                    {item.title}
                                </Link>
                            ))}
                            
                            {isAuthenticated && isAdmin && (
                                <Link
                                    to="/admin"
                                    className="flex items-center px-4 py-2 rounded-lg 
                                        text-blue-600 dark:text-blue-300 font-medium
                                        shadow-neumorphic dark:shadow-dark-neumorphic
                                        hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                        transition-shadow duration-300"
                                >
                                    <RiDashboardLine className="mr-2" />
                                    Dashboard
                                </Link>
                            )}
                        </div>

                        
                        <div className="hidden md:flex items-center gap-4">
                            {isAuthenticated ? (
                                <div className="relative" ref={settingsRef}>
                                    <button
                                        onClick={handleSettingsClick}
                                        className="px-4 py-2 rounded-lg 
                                            shadow-neumorphic dark:shadow-dark-neumorphic
                                            hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                            transition-shadow duration-300 
                                            text-gray-600 dark:text-gray-300
                                            flex items-center gap-2"
                                    >
                                        <FiSettings className="text-lg" />
                                        Settings
                                        <FaChevronDown className={`text-xs transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {isSettingsOpen && (
                                        <div className="absolute right-0 mt-5 w-48 rounded-lg 
                                            bg-gray-100 dark:bg-gray-800
                                            shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                                           overflow-hidden z-50"
                                        >
                                            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                                <div className="font-medium text-gray-600 dark:text-gray-300">
                                                    {user?.name || 'User'}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {user?.email || ''}
                                                </div>
                                                {isAdmin && (
                                                    <div className="mt-1 inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                                        Admin
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {isAdmin && (
                                                <Link
                                                    to="/admin"
                                                    onClick={() => setSettingsOpen(false)}
                                                    className="w-full flex items-center px-4 py-2
                                                        text-blue-600 dark:text-blue-300 hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                                        transition-colors"
                                                >
                                                    <RiDashboardLine className="mr-2" />
                                                    Dashboard
                                                </Link>
                                            )}
                                            
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setSettingsOpen(false);
                                                }}
                                                className="w-full flex items-center px-4 py-2
                                                    text-gray-600 dark:text-gray-300 hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                                    transition-colors"
                                            >
                                                <HiLogout className="mr-2" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="px-4 py-2 rounded-lg 
                                            shadow-neumorphic dark:shadow-dark-neumorphic
                                            hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                            transition-shadow duration-300 
                                            text-gray-600 dark:text-gray-300"
                                    >
                                        <HiLogin className="mr-2 inline" />
                                        Login
                                    </button>
                                    <button
                                        onClick={() => navigate("/register")}
                                        className="px-4 py-2 rounded-lg 
                                            shadow-neumorphic dark:shadow-dark-neumorphic
                                            hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                            transition-shadow duration-300 
                                            text-gray-600 dark:text-gray-300"
                                    >
                                        Register
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    
                    <button
                        onClick={() => setMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg 
                            shadow-neumorphic dark:shadow-dark-neumorphic
                            hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                            transition-shadow duration-300 
                            text-gray-600 dark:text-gray-300"
                    >
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                
                {isMenuOpen && (
                    <div className="md:hidden py-4 mt-2 rounded-lg 
                        bg-gray-100 dark:bg-gray-900
                        shadow-neumorphic dark:shadow-dark-neumorphic">
                        <div className="px-2 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.title}
                                    to={item.link}
                                    className="flex items-center px-4 py-3 rounded-lg
                                        text-gray-600 dark:text-gray-300
                                        shadow-neumorphic dark:shadow-dark-neumorphic
                                        hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                        transition-shadow duration-300"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.icon}
                                    {item.title}
                                </Link>
                            ))}
                            
                            {isAuthenticated && isAdmin && (
                                <Link
                                    to="/admin"
                                    className="flex items-center px-4 py-3 rounded-lg
                                        text-blue-600 dark:text-blue-300 font-medium
                                        shadow-neumorphic dark:shadow-dark-neumorphic
                                        hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                        transition-shadow duration-300"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <RiDashboardLine className="mr-2" />
                                    Dashboard
                                </Link>
                            )}
                            
                            <div className="pt-4 space-y-2">
                                {isAuthenticated ? (
                                    <div className="rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden
                                        shadow-neumorphic dark:shadow-dark-neumorphic">
                                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                            <div className="font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                                {user?.name || 'User'}
                                                {isAdmin && (
                                                    <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                                        Admin
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                {user?.email || ''}
                                            </div>
                                        </div>
                                        
                                        <button
                                            onClick={() => {
                                                logout();
                                                setMenuOpen(false);
                                            }}
                                            className="w-full flex items-center px-4 py-3
                                                text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        >
                                            <HiLogout className="mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => {
                                                navigate("/login");
                                                setMenuOpen(false);
                                            }}
                                            className="w-full flex items-center px-4 py-3 rounded-lg
                                                text-gray-600 dark:text-gray-300
                                                shadow-neumorphic dark:shadow-dark-neumorphic
                                                hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                                transition-shadow duration-300"
                                        >
                                            <HiLogin className="mr-2" />
                                            Login
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate("/register");
                                                setMenuOpen(false);
                                            }}
                                            className="w-full flex items-center px-4 py-3 rounded-lg
                                                text-gray-600 dark:text-gray-300
                                                shadow-neumorphic dark:shadow-dark-neumorphic
                                                hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                                transition-shadow duration-300"
                                        >
                                            Register
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import { FiHome, FiFileText, FiMail, FiSend, FiArrowRight } from "react-icons/fi";

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

const Footer: React.FC = () => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [email, setEmail] = useState("");
    const [isSubscribing, setIsSubscribing] = useState(false);
    const { user } = useAuth();

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

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubscribing(true);
        setTimeout(() => {
            setIsSubscribing(false);
            setEmail("");
            alert("Thank you for subscribing!");
        }, 1000);
    };

    return (
        <footer className="mt-16 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-neumorphic dark:shadow-dark-neumorphic">
            <div className="w-full overflow-hidden transform -translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 48" className="w-full h-auto fill-current text-gray-100 dark:text-gray-800">
                    <path d="M0,0L60,8C120,16,240,32,360,37.3C480,43,600,37,720,32C840,27,960,21,1080,21.3C1200,21,1320,27,1380,29.3L1440,32L1440,48L1380,48C1320,48,1200,48,1080,48C960,48,840,48,720,48C600,48,480,48,360,48C240,48,120,48,60,48L0,48Z"></path>
                </svg>
            </div>
            
            <div className="container mx-auto py-12 px-4">
                <div className="mb-16 max-w-3xl mx-auto">
                    <div className="p-6 rounded-xl shadow-neumorphic dark:shadow-dark-neumorphic bg-white dark:bg-gray-800 transform hover:scale-[1.01] transition-all duration-300">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white text-center mb-6">
                            Stay Updated with Our Newsletter
                        </h3>
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-grow">
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your email address"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-lg
                                            shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                                            focus:outline-none
                                            bg-gray-100 dark:bg-gray-700
                                            text-gray-700 dark:text-gray-300"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubscribing}
                                className="px-6 py-3 rounded-lg
                                    shadow-neumorphic dark:shadow-dark-neumorphic
                                    hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                    transition-shadow duration-300
                                    bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200
                                    flex items-center justify-center
                                    disabled:opacity-70"
                            >
                                {isSubscribing ? (
                                    <div className="animate-spin h-5 w-5 border-2 border-blue-600 dark:border-blue-300 border-t-transparent dark:border-t-transparent rounded-full mr-2"></div>
                                ) : (
                                    <FiSend className="mr-2" />
                                )}
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center md:text-left">
                        <div className="p-6 rounded-xl shadow-neumorphic dark:shadow-dark-neumorphic bg-white dark:bg-gray-800 transform hover:scale-[1.02] transition-all duration-300 h-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center justify-center md:justify-start">
                                <span className="flex items-center justify-center w-12 h-12 mr-3 rounded-full shadow-neumorphic dark:shadow-dark-neumorphic bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                    {settings?.siteName?.charAt(0) || "B"}
                                </span>
                                {settings?.siteName || "Blog"}
                            </h3>
                            <div className="h-0.5 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-4"></div>
                            <p className="text-gray-600 dark:text-gray-400 px-4 py-4 rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset bg-gray-100 dark:bg-gray-700">
                                {settings?.siteDescription || "A modern blog powered by React and Node.js"}
                            </p>
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <div className="p-6 rounded-xl shadow-neumorphic dark:shadow-dark-neumorphic bg-white dark:bg-gray-800 transform hover:scale-[1.02] transition-all duration-300 h-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center justify-center">
                                <span className="flex items-center justify-center p-3 mr-3 rounded-full shadow-neumorphic dark:shadow-dark-neumorphic bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300">
                                    <FiFileText />
                                </span>
                                Quick Links
                            </h3>
                            <div className="h-0.5 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-4"></div>
                            <ul className="space-y-3">
                                <li>
                                    <a 
                                        href="/" 
                                        className="flex items-center justify-center px-4 py-3 rounded-lg 
                                            shadow-neumorphic dark:shadow-dark-neumorphic
                                            hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                            text-gray-700 dark:text-gray-300 transition-shadow duration-300
                                            hover:translate-x-1 transform"
                                    >
                                        <FiHome className="mr-2" />
                                        Home
                                        <FiArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="/blogs" 
                                        className="flex items-center justify-center px-4 py-3 rounded-lg 
                                            shadow-neumorphic dark:shadow-dark-neumorphic
                                            hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                            text-gray-700 dark:text-gray-300 transition-shadow duration-300
                                            hover:translate-x-1 transform "
                                    >
                                        <FiFileText className="mr-2" />
                                        Blogs
                                        <FiArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="text-center md:text-right">
                        <div className="p-6 rounded-xl shadow-neumorphic dark:shadow-dark-neumorphic bg-white dark:bg-gray-800 transform hover:scale-[1.02] transition-all duration-300 h-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center justify-center md:justify-end">
                                <span className="flex items-center justify-center p-3 mr-3 rounded-full shadow-neumorphic dark:shadow-dark-neumorphic bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                                    <FiMail />
                                </span>
                                Connect With Us
                            </h3>
                            <div className="h-0.5 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-4"></div>
                            <div className="flex justify-center md:justify-end space-x-4 mb-5">
                                {settings?.socialLinks?.twitter && (
                                    <a 
                                        href={settings.socialLinks.twitter} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-full shadow-neumorphic dark:shadow-dark-neumorphic 
                                            hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                            bg-blue-50 dark:bg-blue-900
                                            text-blue-500 dark:text-blue-300 transition-all duration-300
                                            hover:scale-110"
                                    >
                                        <FaTwitter size={18} />
                                    </a>
                                )}
                                {settings?.socialLinks?.facebook && (
                                    <a 
                                        href={settings.socialLinks.facebook} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-full shadow-neumorphic dark:shadow-dark-neumorphic 
                                            hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                            bg-blue-100 dark:bg-blue-900
                                            text-blue-700 dark:text-blue-300 transition-all duration-300
                                            hover:scale-110"
                                    >
                                        <FaFacebook size={18} />
                                    </a>
                                )}
                                {settings?.socialLinks?.instagram && (
                                    <a 
                                        href={settings.socialLinks.instagram} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-full shadow-neumorphic dark:shadow-dark-neumorphic 
                                            hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                            bg-pink-50 dark:bg-pink-900
                                            text-pink-600 dark:text-pink-300 transition-all duration-300
                                            hover:scale-110"
                                    >
                                        <FaInstagram size={18} />
                                    </a>
                                )}
                            </div>
                            {settings?.contactEmail && (
                                <div className="mt-4 px-4 py-3 rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset 
                                    bg-gray-100 dark:bg-gray-700 inline-block">
                                    <a href={`mailto:${settings.contactEmail}`} className="text-blue-600 dark:text-blue-300 flex items-center justify-center hover:underline">
                                        <FiMail className="mr-2" />
                                        {settings.contactEmail}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="mt-16 pt-6 border-t border-gray-300 dark:border-gray-600 text-center">
                    <div className="inline-block px-8 py-4 rounded-xl shadow-neumorphic dark:shadow-dark-neumorphic 
                        bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        <p>{settings?.footerText || "© 2023 My Blog. All rights reserved."}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 
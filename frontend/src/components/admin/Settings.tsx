import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSave, FiRefreshCw } from 'react-icons/fi';
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import { MdEmail, MdTitle, MdDescription, MdOutlineSettingsApplications } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { CgSpinner } from 'react-icons/cg';

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

interface FormError {
    siteName?: string;
    contactEmail?: string;
}

const Settings: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<FormError>({});
    const { user } = useAuth();
    const [settings, setSettings] = useState<SiteSettings>({
        siteName: '',
        siteDescription: '',
        contactEmail: '',
        enableRegistration: true,
        maintenanceMode: false,
        footerText: '',
        socialLinks: {
            twitter: '',
            facebook: '',
            instagram: ''
        }
    });

    const fetchSettings = async () => {
        try {
            setLoading(true);
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
            toast.error('Failed to load settings');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, [user?.token]);

    const validateForm = (): boolean => {
        const newErrors: FormError = {};
        let isValid = true;

        if (!settings.siteName.trim()) {
            newErrors.siteName = 'Site name is required';
            isValid = false;
        }

        if (!settings.contactEmail.trim()) {
            newErrors.contactEmail = 'Contact email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(settings.contactEmail)) {
            newErrors.contactEmail = 'Please enter a valid email address';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (errors[name as keyof FormError]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setSettings(prev => ({
                ...prev,
                [name]: checked
            }));
        } else if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setSettings(prev => ({
                ...prev,
                [parent]: {
                    ...(prev as any)[parent],
                    [child]: value
                }
            }));
        } else {
            setSettings(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the errors before saving');
            return;
        }
        
        try {
            setSaving(true);
            await axios.put(`${API_BASE_URL}/settings`, settings, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            
            toast.success('Settings saved successfully');
            setSaving(false);
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
            setSaving(false);
        }
    };
    
    const handleReset = () => {
        fetchSettings();
        toast.success('Settings have been reset');
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
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                    <MdOutlineSettingsApplications className="mr-2" />
                    Site Settings
                </h1>
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 rounded-lg
                        shadow-neumorphic dark:shadow-dark-neumorphic
                        hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                        transition-shadow duration-300
                        bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300
                        flex items-center space-x-2"
                >
                    <FiRefreshCw />
                    <span>Reset</span>
                </button>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="shadow-neumorphic dark:shadow-dark-neumorphic rounded-lg p-6 space-y-6 bg-gray-100 dark:bg-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="siteName" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <MdTitle className="mr-1" /> Site Name
                            </label>
                            <input
                                type="text"
                                id="siteName"
                                name="siteName"
                                value={settings.siteName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg
                                    ${errors.siteName ? 'shadow-neumorphic-error dark:shadow-dark-neumorphic-error' : 'shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset'}
                                    focus:outline-none
                                    bg-gray-100 dark:bg-gray-800
                                    text-gray-700 dark:text-gray-300`}
                                required
                            />
                            {errors.siteName && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.siteName}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="contactEmail" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <MdEmail className="mr-1" /> Contact Email
                            </label>
                            <input
                                type="email"
                                id="contactEmail"
                                name="contactEmail"
                                value={settings.contactEmail}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg
                                    ${errors.contactEmail ? 'shadow-neumorphic-error dark:shadow-dark-neumorphic-error' : 'shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset'}
                                    focus:outline-none
                                    bg-gray-100 dark:bg-gray-800
                                    text-gray-700 dark:text-gray-300`}
                                required
                            />
                            {errors.contactEmail && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactEmail}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="siteDescription" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                            <MdDescription className="mr-1" /> Site Description
                        </label>
                        <textarea
                            id="siteDescription"
                            name="siteDescription"
                            value={settings.siteDescription}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg
                                shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                                focus:outline-none
                                bg-gray-100 dark:bg-gray-800
                                text-gray-700 dark:text-gray-300"
                        />
                    </div>

                    <div>
                        <label htmlFor="footerText" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                            Footer Text
                        </label>
                        <input
                            type="text"
                            id="footerText"
                            name="footerText"
                            value={settings.footerText}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg
                                shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                                focus:outline-none
                                bg-gray-100 dark:bg-gray-800
                                text-gray-700 dark:text-gray-300"
                        />
                    </div>

                    <div className="p-4 rounded-lg shadow-neumorphic dark:shadow-dark-neumorphic bg-gray-50 dark:bg-gray-700">
                        <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Social Media Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="socialLinks.twitter" className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                                    <FaTwitter className="mr-1" /> Twitter
                                </label>
                                <input
                                    type="url"
                                    id="socialLinks.twitter"
                                    name="socialLinks.twitter"
                                    value={settings.socialLinks.twitter}
                                    onChange={handleChange}
                                    placeholder="https://twitter.com/youraccount"
                                    className="w-full px-4 py-2 rounded-lg
                                        shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                                        focus:outline-none
                                        bg-gray-100 dark:bg-gray-800
                                        text-gray-700 dark:text-gray-300"
                                />
                            </div>
                            <div>
                                <label htmlFor="socialLinks.facebook" className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                                    <FaFacebook className="mr-1" /> Facebook
                                </label>
                                <input
                                    type="url"
                                    id="socialLinks.facebook"
                                    name="socialLinks.facebook"
                                    value={settings.socialLinks.facebook}
                                    onChange={handleChange}
                                    placeholder="https://facebook.com/yourpage"
                                    className="w-full px-4 py-2 rounded-lg
                                        shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                                        focus:outline-none
                                        bg-gray-100 dark:bg-gray-800
                                        text-gray-700 dark:text-gray-300"
                                />
                            </div>
                            <div>
                                <label htmlFor="socialLinks.instagram" className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                                    <FaInstagram className="mr-1" /> Instagram
                                </label>
                                <input
                                    type="url"
                                    id="socialLinks.instagram"
                                    name="socialLinks.instagram"
                                    value={settings.socialLinks.instagram}
                                    onChange={handleChange}
                                    placeholder="https://instagram.com/youraccount"
                                    className="w-full px-4 py-2 rounded-lg
                                        shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset
                                        focus:outline-none
                                        bg-gray-100 dark:bg-gray-800
                                        text-gray-700 dark:text-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg shadow-neumorphic dark:shadow-dark-neumorphic bg-gray-50 dark:bg-gray-700">
                        <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Site Options</h3>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="relative inline-block w-10 mr-2 align-middle">
                                    <input 
                                        type="checkbox" 
                                        id="enableRegistration" 
                                        name="enableRegistration"
                                        checked={settings.enableRegistration}
                                        onChange={handleChange}
                                        className="sr-only" 
                                    />
                                    <label
                                        htmlFor="enableRegistration"
                                        className={`block h-6 rounded-full w-10 transition-colors duration-300 ease-in-out ${
                                            settings.enableRegistration ? 'bg-blue-500' : 'bg-gray-400'
                                        } shadow-neumorphic dark:shadow-dark-neumorphic cursor-pointer`}
                                    >
                                        <span
                                            className={`absolute left-0.5 top-0.5 bg-white dark:bg-gray-200 rounded-full h-5 w-5 transition-transform duration-300 ease-in-out shadow-md transform ${
                                                settings.enableRegistration ? 'translate-x-4' : 'translate-x-0'
                                            }`}
                                        />
                                    </label>
                                </div>
                                <label htmlFor="enableRegistration" className="text-sm text-gray-700 dark:text-gray-300">
                                    Enable User Registration
                                </label>
                            </div>
                            <div className="flex items-center">
                                <div className="relative inline-block w-10 mr-2 align-middle">
                                    <input 
                                        type="checkbox" 
                                        id="maintenanceMode" 
                                        name="maintenanceMode"
                                        checked={settings.maintenanceMode}
                                        onChange={handleChange}
                                        className="sr-only" 
                                    />
                                    <label
                                        htmlFor="maintenanceMode"
                                        className={`block h-6 rounded-full w-10 transition-colors duration-300 ease-in-out ${
                                            settings.maintenanceMode ? 'bg-yellow-500' : 'bg-gray-400'
                                        } shadow-neumorphic dark:shadow-dark-neumorphic cursor-pointer`}
                                    >
                                        <span
                                            className={`absolute left-0.5 top-0.5 bg-white dark:bg-gray-200 rounded-full h-5 w-5 transition-transform duration-300 ease-in-out shadow-md transform ${
                                                settings.maintenanceMode ? 'translate-x-4' : 'translate-x-0'
                                            }`}
                                        />
                                    </label>
                                </div>
                                <label htmlFor="maintenanceMode" className="text-sm text-gray-700 dark:text-gray-300">
                                    Enable Maintenance Mode
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 rounded-lg
                                shadow-neumorphic dark:shadow-dark-neumorphic
                                hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                                disabled:opacity-70 disabled:cursor-not-allowed
                                transition-shadow duration-300
                                bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200
                                flex items-center space-x-2"
                        >
                            <FiSave />
                            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Settings; 
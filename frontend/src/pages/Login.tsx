import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { FiMail, FiLock } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

interface LoginFormData {
    email: string;
    password: string;
}

interface FormError {
    email?: string;
    password?: string;
    general?: string;
}

export const Login = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState<FormError>({});
    const [loading, setLoading] = useState<boolean>(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const validateForm = (): boolean => {
        const newErrors: FormError = {};
        let isValid = true;

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        if (errors[name as keyof FormError]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
                { ...formData }
            );
            
            login({ ...response.data.user, token: response.data.token });
            toast.success("Login successful!");
            navigate("/");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to login. Please try again.";
            toast.error(errorMessage);
            setErrors({ 
                ...errors, 
                general: errorMessage 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full rounded-lg 
                bg-gray-100 dark:bg-gray-800 
                shadow-neumorphic dark:shadow-dark-neumorphic 
                p-8"
            >
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-700 dark:text-gray-300">
                    Login to Your Account
                </h1>
                
                {errors.general && (
                    <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                        {errors.general}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label 
                            htmlFor="email" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiMail className="text-gray-500 dark:text-gray-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-3 py-2 rounded-lg 
                                    bg-gray-100 dark:bg-gray-800 
                                    ${errors.email ? 'shadow-neumorphic-error dark:shadow-dark-neumorphic-error' : 'shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset'} 
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                    text-gray-700 dark:text-gray-300 outline-none`}
                                placeholder="you@example.com"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label 
                            htmlFor="password" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiLock className="text-gray-500 dark:text-gray-400" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-3 py-2 rounded-lg 
                                    bg-gray-100 dark:bg-gray-800 
                                    ${errors.password ? 'shadow-neumorphic-error dark:shadow-dark-neumorphic-error' : 'shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset'} 
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                    text-gray-700 dark:text-gray-300 outline-none`}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 px-4 py-2 rounded-lg
                            shadow-neumorphic dark:shadow-dark-neumorphic 
                            hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                            transition-shadow duration-300
                            text-blue-500 font-medium disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <CgSpinner fontSize={24} className="animate-spin dark:text-gray-200" />
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Register now
                    </Link>
                </div>
            </div>
        </div>
    );
};
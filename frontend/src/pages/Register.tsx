import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

interface RegisterFormData {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormError {
    userName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

export const Register = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState<FormError>({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = (): boolean => {
        const newErrors: FormError = {};
        let isValid = true;

        if (!formData.userName.trim()) {
            newErrors.userName = "Name is required";
            isValid = false;
        }

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

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
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

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
                name: formData.userName,
                email: formData.email,
                password: formData.password
            });

            toast.success("Registration successful! Please login.");
            navigate("/login");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
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
                    Create an Account
                </h1>

                {errors.general && (
                    <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
        <div>
                        <label
                            htmlFor="userName"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiUser className="text-gray-500 dark:text-gray-400" />
                            </div>
                            <input
                                id="userName"
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-3 py-2 rounded-lg 
                                    bg-gray-100 dark:bg-gray-800 
                                    ${errors.userName ? 'shadow-neumorphic-error dark:shadow-dark-neumorphic-error' : 'shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset'} 
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                    text-gray-700 dark:text-gray-300 outline-none`}
                                placeholder="John Doe"
                            />
                        </div>
                        {errors.userName && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.userName}</p>
                        )}
                </div>

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

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiLock className="text-gray-500 dark:text-gray-400" />
                            </div>
                            <input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-3 py-2 rounded-lg 
                                    bg-gray-100 dark:bg-gray-800 
                                    ${errors.confirmPassword ? 'shadow-neumorphic-error dark:shadow-dark-neumorphic-error' : 'shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset'} 
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                    text-gray-700 dark:text-gray-300 outline-none`}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 px-4 py-2 mt-6 rounded-lg
                            shadow-neumorphic dark:shadow-dark-neumorphic 
                            hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                            transition-shadow duration-300
                            text-blue-500 font-medium disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <CgSpinner fontSize={24} className="animate-spin dark:text-gray-200" />
                                Registering...
                            </>
                        ) : (
                            "Register"
                        )}
                    </button>
            </form>

                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Login instead
                    </Link>
                </div>
            </div>
        </div>
    );
};
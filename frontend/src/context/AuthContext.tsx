import { createContext, ReactNode, useEffect, useState } from "react";

export type UserRole = "user" | "admin";

interface AuthUser {
    id: string;
    name: string;
    email: string;
    token: string;
    role: UserRole;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (userData: AuthUser) => void;
    logout: () => void;
    isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const login = (userData: AuthUser) => {
        setUser(userData);
        setIsAdmin(userData.role === "admin");
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem('user');
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        // local storage value is string so it should be pared to match AuthUser object
        const parsedUser: AuthUser | null = storedUser ? JSON.parse(storedUser) as AuthUser : null;

        if (parsedUser) {
            setUser(parsedUser);
            setIsAdmin(parsedUser.role === "admin");
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    )
};



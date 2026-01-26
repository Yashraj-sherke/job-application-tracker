import React, { createContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { authApi } from '../api/auth';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = await authApi.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []); // Empty dependency array - runs only once

    const login = useCallback(async (email: string, password: string) => {
        const user = await authApi.login(email, password);
        setUser(user);
        toast.success('Logged in successfully!');
    }, []);

    const register = useCallback(async (name: string, email: string, password: string) => {
        const user = await authApi.register(name, email, password);
        setUser(user);
        toast.success('Account created successfully!');
    }, []);

    const logout = useCallback(async () => {
        await authApi.logout();
        setUser(null);
        toast.success('Logged out successfully!');
    }, []);

    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(
        () => ({ user, loading, login, register, logout }),
        [user, loading, login, register, logout]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

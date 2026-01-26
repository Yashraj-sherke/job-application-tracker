import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Function to apply theme to DOM
const applyTheme = (theme: 'light' | 'dark') => {
    const root = document.documentElement;

    console.log('Applying theme:', theme);

    if (theme === 'dark') {
        root.classList.add('dark');
        console.log('Dark mode applied - classList:', root.classList.toString());
    } else {
        root.classList.remove('dark');
        console.log('Light mode applied - classList:', root.classList.toString());
    }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        // Check localStorage for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        console.log('Initial theme from localStorage:', savedTheme);

        if (savedTheme === 'dark' || savedTheme === 'light') {
            // Apply theme immediately before component mounts
            applyTheme(savedTheme);
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark');
            return 'dark';
        }

        applyTheme('light');
        return 'light';
    });

    // Apply theme whenever it changes
    useEffect(() => {
        console.log('Theme changed to:', theme);
        applyTheme(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        console.log('Toggle theme called, current theme:', theme);
        setTheme((prev) => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            console.log('New theme will be:', newTheme);
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

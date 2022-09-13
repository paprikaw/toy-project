import { useState, useEffect } from 'react';

export const useDarkMode = () => {
    const [isDarkModeLoading, setIsDarkModeLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if ((typeof window !== 'undefined')) {
            // Get the dark mode from localstorage
            setIsDarkModeLoading(false);
            setDarkMode(localStorage.getItem('darkMode') === 'true');
        }
    }, []);

    return { darkMode, isDarkModeLoading };
}
import { useState, useEffect } from 'react';

export const useDarkMode = () => {
    const [shouldDisplay, setShouldDisplay] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if ((typeof window !== 'undefined')) {
            // Get the dark mode from localstorage
            setShouldDisplay(true);
            setDarkMode(localStorage.getItem('darkMode') === 'true');
        }
    }, []);

    return { darkMode, shouldDisplay };
}
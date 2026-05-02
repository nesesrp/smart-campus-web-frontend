'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

const translations = {
    tr: {
        // Settings page
        settings: 'Ayarlar',
        settingsDescription: 'Uygulama tercihlerinizi yönetin',
        appearance: 'Görünüm',
        darkMode: 'Karanlık Mod',
        darkModeDescription: 'Göz yorgunluğunu azaltmak için karanlık temayı etkinleştirin',
        language: 'Dil',
        languageDescription: 'Uygulama dilini seçin',
        turkish: 'Türkçe',
        english: 'İngilizce',
        // Common
        home: 'Ana Sayfa',
        courses: 'Dersler',
        myCourses: 'Kayıtlı Derslerim',
        schedule: 'Ders Programım',
        grades: 'Notlarım',
        attendance: 'Yoklama Durumum',
        events: 'Etkinlikler',
        profile: 'Profilim',
        logout: 'Çıkış',
        save: 'Kaydet',
        cancel: 'İptal',
        loading: 'Yükleniyor...',
        error: 'Hata',
        success: 'Başarılı',
    },
    en: {
        // Settings page
        settings: 'Settings',
        settingsDescription: 'Manage your application preferences',
        appearance: 'Appearance',
        darkMode: 'Dark Mode',
        darkModeDescription: 'Enable dark theme to reduce eye strain',
        language: 'Language',
        languageDescription: 'Select application language',
        turkish: 'Turkish',
        english: 'English',
        // Common
        home: 'Home',
        courses: 'Courses',
        myCourses: 'My Courses',
        schedule: 'My Schedule',
        grades: 'My Grades',
        attendance: 'My Attendance',
        events: 'Events',
        profile: 'Profile',
        logout: 'Logout',
        save: 'Save',
        cancel: 'Cancel',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
    }
};

export function SettingsProvider({ children }) {
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('tr');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load from localStorage
        const savedTheme = localStorage.getItem('theme') || 'light';
        const savedLanguage = localStorage.getItem('language') || 'tr';
        setTheme(savedTheme);
        setLanguage(savedLanguage);

        // Apply theme
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key) => {
        return translations[language]?.[key] || translations['tr'][key] || key;
    };

    if (!mounted) {
        return null;
    }

    return (
        <SettingsContext.Provider value={{ theme, toggleTheme, language, changeLanguage, t }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}

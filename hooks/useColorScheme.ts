import React from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { create } from 'zustand';

interface ColorSchemeStore {
    colorScheme: 'light' | 'dark';
    setColorScheme: (scheme: 'light' | 'dark') => void;
    toggleColorScheme: () => void;
}

const useColorSchemeStore = create<ColorSchemeStore>((set) => ({
    colorScheme: 'light', // Default value
    setColorScheme: (scheme) => set({ colorScheme: scheme }),
    toggleColorScheme: () => set(state => ({
        colorScheme: state.colorScheme === 'light' ? 'dark' : 'light'
    }))
}));

export function useColorScheme() {
    const systemTheme = useNativeColorScheme();
    const store = useColorSchemeStore();

    React.useEffect(() => {
        store.setColorScheme(systemTheme ?? 'light');
    }, [systemTheme]);

    return store;
}
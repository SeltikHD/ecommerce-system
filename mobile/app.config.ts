import type { ConfigContext, ExpoConfig } from '@expo/config';

export default (_context: ConfigContext): ExpoConfig => {
    return {
        name: 'E-Commerce',
        slug: 'e-commerce',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'light',
        splash: {
            image: './assets/splash.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
        },
        assetBundlePatterns: ['**/*'],
        ios: {
            supportsTablet: true,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
        },
        web: {
            favicon: './assets/favicon.png',
        },
    };
};

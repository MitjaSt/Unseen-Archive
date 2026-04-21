
class ConfigurationService {
  isDevEnvironment(): boolean {
    // Vite replaces import.meta.env.MODE at build time
    // In development: 'development', in production: 'production'
    return import.meta.env.MODE === 'development';
  }

  isProductionEnvironment(): boolean {
    return import.meta.env.MODE === 'production';
  }

  getEnvironment(): string {
    return import.meta.env.MODE || 'development';
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  isExtension(): boolean {
    // Check if running as Chrome extension
    return this.isBrowser() && typeof chrome !== 'undefined' && !!chrome.runtime?.id;
  }

  isLocalhost(): boolean {
    if (!this.isBrowser()) return false;

    // For Chrome extensions, check if running in development mode
    if (this.isExtension()) {
      return this.isDevEnvironment();
    }

    // For regular web app
    return window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname === '[::1]';
  }
}

export const configService = new ConfigurationService();

export default ConfigurationService;

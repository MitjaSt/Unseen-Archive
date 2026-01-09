
class ConfigurationService {
  isDevEnvironment(): boolean {
    // In Next.js, process.env.NODE_ENV is replaced at build time
    // This is safe to use in client components as it becomes a static value
    return process.env.NODE_ENV === 'development';
  }

  isProductionEnvironment(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  getEnvironment(): string {
    return process.env.NODE_ENV || 'development';
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  isLocalhost(): boolean {
    if (!this.isBrowser()) return false;
    return window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname === '[::1]';
  }
}

export const configService = new ConfigurationService();

export default ConfigurationService;

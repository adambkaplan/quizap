// API Configuration
export const API_CONFIG = {
  // Backend API base URL
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-domain.com' 
    : 'http://localhost:8080',
  
  // API endpoints
  ENDPOINTS: {
    HELLO: '/hello',
  },
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

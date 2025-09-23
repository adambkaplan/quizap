import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Dashboard } from './Dashboard';
import { buildApiUrl } from '@app/config/api';

// Mock the API configuration
jest.mock('@app/config/api', () => ({
  API_CONFIG: {
    BASE_URL: 'http://localhost:8080',
    ENDPOINTS: {
      HELLO: '/hello',
    },
  },
  buildApiUrl: jest.fn((endpoint: string) => `http://localhost:8080${endpoint}`),
}));

// Mock fetch
global.fetch = jest.fn();

describe('Dashboard', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    (buildApiUrl as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<Dashboard />);
    
    expect(screen.getByText('Loading message from backend...')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading message from backend')).toBeInTheDocument();
  });

  it('displays message when API call succeeds', async () => {
    const mockResponse = { message: 'Hello, World!' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Backend Message:')).toBeInTheDocument();
      expect(screen.getByText('Hello, World!')).toBeInTheDocument();
    });

    // Verify fetch was called with the correct URL
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/hello');
    expect(fetch).toHaveBeenCalledTimes(1);
    
    // Verify buildApiUrl was called with the correct endpoint
    expect(buildApiUrl).toHaveBeenCalledWith('/hello');
    expect(buildApiUrl).toHaveBeenCalledTimes(1);
  });

  it('displays error when API call fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Error loading message')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('displays error when API returns non-ok status', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Error loading message')).toBeInTheDocument();
      expect(screen.getByText('HTTP error! status: 500')).toBeInTheDocument();
    });
  });
});

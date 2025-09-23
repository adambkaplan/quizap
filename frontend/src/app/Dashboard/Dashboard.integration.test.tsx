import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Dashboard } from './Dashboard';

// Integration test - requires backend to be running
describe('Dashboard Integration', () => {
  it('should fetch and display message from backend', async () => {
    // Skip this test if backend is not running
    try {
      const response = await fetch('http://localhost:8080/hello');
      if (!response.ok) {
        console.log('Backend not available, skipping integration test');
        return;
      }
    } catch {
      console.log('Backend not available, skipping integration test');
      return;
    }

    render(<Dashboard />);

    // Wait for the message to be loaded
    await waitFor(() => {
      expect(screen.getByText('Backend Message:')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Verify the message is displayed
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  }, 10000); // 10 second timeout
});

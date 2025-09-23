import * as React from 'react';
import { Alert, AlertGroup, PageSection, Spinner, Title } from '@patternfly/react-core';
import { API_CONFIG, buildApiUrl} from '@app/config/api';

interface HelloResponse {
  message: string;
}

const Dashboard: React.FunctionComponent = () => {
  const [message, setMessage] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchHelloMessage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Call the backend /hello endpoint
        const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.HELLO));
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: HelloResponse = await response.json();
        setMessage(data.message);
      } catch (err) {
        console.error('Error fetching hello message:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch message');
      } finally {
        setLoading(false);
      }
    };

    fetchHelloMessage();
  }, []);

  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">Dashboard Page Title!</Title>
      
      {loading && (
        <div style={{ marginTop: '20px' }}>
          <Spinner size="lg" aria-label="Loading message from backend" />
          <span style={{ marginLeft: '10px' }}>Loading message from backend...</span>
        </div>
      )}
      
      {error && (
        <AlertGroup>
          <Alert 
            variant="danger" 
            title="Error loading message"
            style={{ marginTop: '20px' }}
          >
            {error}
          </Alert>
        </AlertGroup>
      )}
      
      {!loading && !error && message && (
        <div style={{ marginTop: '20px' }}>
          <Title headingLevel="h2" size="md">Backend Message:</Title>
          <p style={{ fontSize: '18px', color: '#0066cc' }}>{message}</p>
        </div>
      )}
    </PageSection>
  );
};

export { Dashboard };

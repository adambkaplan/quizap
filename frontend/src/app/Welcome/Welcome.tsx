import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Grid,
  GridItem,
  PageSection,
  Title
} from '@patternfly/react-core';
import { PlayIcon, PlusIcon } from '@patternfly/react-icons';

const Welcome: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const handleCreateQuiz = () => {
    // TODO: Navigate to quiz creation page
    console.log('Navigate to create quiz');
  };

  const handleStartQuiz = () => {
    navigate('/quizzes');
  };

  return (
    <PageSection hasBodyWrapper={false}>
      <div>
        <Title headingLevel="h1" size="4xl" style={{ color: 'var(--cncf-blue)', textAlign: 'center', marginBottom: '2rem' }}>
          Welcome to QuiZap
        </Title>
        <Title headingLevel="h2" size="lg" style={{ color: 'var(--cncf-black)', textAlign: 'center', marginBottom: '3rem' }}>
          Cloud Native Computing Foundation's Interactive Quiz Platform
        </Title>
      </div>
      
      <Grid hasGutter>
        <GridItem span={6}>
          <Card style={{ height: '100%', border: '2px solid var(--cncf-blue)' }}>
            <CardHeader>
              <CardTitle style={{ color: 'var(--cncf-blue)', fontSize: '1.5rem' }}>
                <PlusIcon style={{ marginRight: '0.5rem' }} />
                Create a Quiz
              </CardTitle>
            </CardHeader>
            <CardBody>
              <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
                Design and build your own interactive quizzes to test knowledge on cloud native technologies, 
                Kubernetes, and CNCF projects. Share your expertise with the community.
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleCreateQuiz}
                style={{ 
                  backgroundColor: 'var(--cncf-blue)', 
                  borderColor: 'var(--cncf-blue)',
                  width: '100%'
                }}
              >
                Create New Quiz
              </Button>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem span={6}>
          <Card style={{ height: '100%', border: '2px solid var(--cncf-turquoise)' }}>
            <CardHeader>
              <CardTitle style={{ color: 'var(--cncf-blue)', fontSize: '1.5rem' }}>
                <PlayIcon style={{ marginRight: '0.5rem' }} />
                Start a Quiz
              </CardTitle>
            </CardHeader>
            <CardBody>
              <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
                Explore our collection of quizzes covering Kubernetes, cloud native technologies, 
                and CNCF projects. Test your knowledge and learn something new.
              </p>
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={handleStartQuiz}
                style={{ 
                  backgroundColor: 'var(--cncf-turquoise)', 
                  borderColor: 'var(--cncf-turquoise)',
                  color: 'var(--cncf-black)',
                  width: '100%'
                }}
              >
                Browse Quizzes
              </Button>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
      
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--cncf-black)', fontSize: '1rem' }}>
          Join the Cloud Native Computing Foundation community and enhance your learning experience
        </p>
      </div>
    </PageSection>
  );
};

export { Welcome };

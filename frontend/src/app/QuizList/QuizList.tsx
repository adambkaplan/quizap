import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Badge,
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
import { ArrowLeftIcon, PlayIcon } from '@patternfly/react-icons';

// Mock quiz data - in a real app, this would come from an API
const mockQuizzes = [
  {
    id: 'building-containers',
    title: 'Building Containers',
    description: 'How many ways can you build and deploy containers?',
    difficulty: 'Beginner',
    questions: 6,
    duration: '15 minutes',
    category: 'Application Development',
  },
  {
    id: 'kubernetes-basics',
    title: 'Kubernetes Fundamentals',
    description: 'Test your knowledge of Kubernetes core concepts, pods, services, and deployments.',
    difficulty: 'Beginner',
    questions: 15,
    duration: '20 minutes',
    category: 'Kubernetes'
  },
  {
    id: 'cncf-projects',
    title: 'CNCF Project Landscape',
    description: 'Explore the Cloud Native Computing Foundation project ecosystem and their purposes.',
    difficulty: 'Intermediate',
    questions: 20,
    duration: '25 minutes',
    category: 'CNCF Projects'
  },
  {
    id: 'container-security',
    title: 'Container Security Best Practices',
    description: 'Learn about securing containers, images, and runtime environments.',
    difficulty: 'Advanced',
    questions: 18,
    duration: '30 minutes',
    category: 'Security'
  },
  {
    id: 'service-mesh',
    title: 'Service Mesh Technologies',
    description: 'Understand Istio, Linkerd, and other service mesh solutions.',
    difficulty: 'Intermediate',
    questions: 12,
    duration: '15 minutes',
    category: 'Networking'
  },
  {
    id: 'observability',
    title: 'Cloud Native Observability',
    description: 'Monitoring, logging, and tracing in cloud native environments.',
    difficulty: 'Intermediate',
    questions: 16,
    duration: '22 minutes',
    category: 'Observability'
  },
  {
    id: 'gitops',
    title: 'GitOps Methodology',
    description: 'Continuous deployment and infrastructure as code with GitOps.',
    difficulty: 'Advanced',
    questions: 14,
    duration: '18 minutes',
    category: 'DevOps'
  }
];

const QuizList: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const handleQuizSelect = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleBackToWelcome = () => {
    navigate('/');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'green';
      case 'intermediate':
        return 'orange';
      case 'advanced':
        return 'red';
      default:
        return 'blue';
    }
  };

  return (
    <PageSection hasBodyWrapper={false}>
      <div style={{ marginBottom: '2rem' }}>
        <Button 
          variant="plain" 
          onClick={handleBackToWelcome}
          style={{ marginBottom: '1rem' }}
        >
          <ArrowLeftIcon style={{ marginRight: '0.5rem' }} />
          Back to Welcome
        </Button>
        
        <div>
          <Title headingLevel="h1" size="2xl" style={{ color: 'var(--cncf-blue)' }}>
            Available Quizzes
          </Title>
          <Title headingLevel="h2" size="lg" style={{ color: 'var(--cncf-black)', marginBottom: '2rem' }}>
            Choose a quiz to test your cloud native knowledge
          </Title>
        </div>
      </div>
      
      <Grid hasGutter>
        {mockQuizzes.map((quiz) => (
          <GridItem span={6} key={quiz.id}>
            <Card 
              style={{ 
                height: '100%', 
                border: '1px solid var(--cncf-stone)',
                transition: 'border-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--cncf-blue)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--cncf-stone)';
              }}
            >
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CardTitle style={{ color: 'var(--cncf-blue)', fontSize: '1.3rem' }}>
                    {quiz.title}
                  </CardTitle>
                  <Badge 
                    color={getDifficultyColor(quiz.difficulty)}
                    style={{ fontSize: '0.8rem' }}
                  >
                    {quiz.difficulty}
                  </Badge>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <Badge style={{ marginRight: '0.5rem', backgroundColor: 'var(--cncf-stone)', color: 'var(--cncf-black)' }}>
                    {quiz.category}
                  </Badge>
                  <Badge style={{ marginRight: '0.5rem', backgroundColor: 'var(--cncf-stone)', color: 'var(--cncf-black)' }}>
                    {quiz.questions} questions
                  </Badge>
                  <Badge style={{ backgroundColor: 'var(--cncf-stone)', color: 'var(--cncf-black)' }}>
                    {quiz.duration}
                  </Badge>
                </div>
              </CardHeader>
              <CardBody>
                <p style={{ marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.5' }}>
                  {quiz.description}
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => handleQuizSelect(quiz.id)}
                  style={{ 
                    backgroundColor: 'var(--cncf-blue)', 
                    borderColor: 'var(--cncf-blue)',
                    width: '100%'
                  }}
                >
                  <PlayIcon style={{ marginRight: '0.5rem' }} />
                  Start Quiz
                </Button>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>
      
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--cncf-black)', fontSize: '1rem' }}>
          Don't see what you're looking for? Create your own quiz to share with the community!
        </p>
        <Button 
          variant="secondary" 
          onClick={() => console.log('Navigate to create quiz')}
          style={{ 
            backgroundColor: 'var(--cncf-turquoise)', 
            borderColor: 'var(--cncf-turquoise)',
            color: 'var(--cncf-black)',
            marginTop: '1rem'
          }}
        >
          Create New Quiz
        </Button>
      </div>
    </PageSection>
  );
};

export { QuizList };

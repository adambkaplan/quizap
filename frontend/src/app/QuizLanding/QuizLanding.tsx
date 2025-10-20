import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  PageSection, 
  Title, 
  Card, 
  CardBody, 
  CardHeader, 
  CardTitle, 
  Button, 
  Badge,
  Divider,
  List,
  ListItem,
  Grid,
  GridItem
} from '@patternfly/react-core';
import { ArrowLeftIcon, PlayIcon, ClockIcon, QuestionCircleIcon } from '@patternfly/react-icons';

// Mock quiz data - in a real app, this would come from an API
const mockQuizDetails = {
  'kubernetes-basics': {
    title: 'Kubernetes Fundamentals',
    description: 'Test your knowledge of Kubernetes core concepts, pods, services, and deployments. This comprehensive quiz covers the essential building blocks of Kubernetes that every cloud native practitioner should know.',
    difficulty: 'Beginner',
    questions: 15,
    duration: '20 minutes',
    category: 'Kubernetes',
    topics: [
      'Pods and Containers',
      'Services and Networking',
      'Deployments and ReplicaSets',
      'ConfigMaps and Secrets',
      'Namespaces',
      'Basic kubectl commands'
    ],
    prerequisites: [
      'Basic understanding of containers',
      'Familiarity with command line interface',
      'General knowledge of distributed systems'
    ]
  },
  'cncf-projects': {
    title: 'CNCF Project Landscape',
    description: 'Explore the Cloud Native Computing Foundation project ecosystem and their purposes. Learn about the various projects that make up the cloud native landscape.',
    difficulty: 'Intermediate',
    questions: 20,
    duration: '25 minutes',
    category: 'CNCF Projects',
    topics: [
      'Graduated Projects (Kubernetes, Prometheus, etc.)',
      'Incubating Projects',
      'Sandbox Projects',
      'Project Lifecycle',
      'CNCF Landscape Categories'
    ],
    prerequisites: [
      'Understanding of cloud native concepts',
      'Basic knowledge of Kubernetes',
      'Familiarity with open source projects'
    ]
  },
  'container-security': {
    title: 'Container Security Best Practices',
    description: 'Learn about securing containers, images, and runtime environments. This quiz covers essential security practices for containerized applications.',
    difficulty: 'Advanced',
    questions: 18,
    duration: '30 minutes',
    category: 'Security',
    topics: [
      'Image Security Scanning',
      'Runtime Security',
      'Network Security',
      'Secrets Management',
      'Compliance and Governance'
    ],
    prerequisites: [
      'Strong understanding of containers',
      'Knowledge of security principles',
      'Experience with Kubernetes'
    ]
  },
  'service-mesh': {
    title: 'Service Mesh Technologies',
    description: 'Understand Istio, Linkerd, and other service mesh solutions. Learn about service-to-service communication patterns and observability.',
    difficulty: 'Intermediate',
    questions: 12,
    duration: '15 minutes',
    category: 'Networking',
    topics: [
      'Service Mesh Architecture',
      'Istio Components',
      'Linkerd Features',
      'Traffic Management',
      'Security Policies'
    ],
    prerequisites: [
      'Understanding of microservices',
      'Basic networking knowledge',
      'Kubernetes experience'
    ]
  },
  'observability': {
    title: 'Cloud Native Observability',
    description: 'Monitoring, logging, and tracing in cloud native environments. Learn about the three pillars of observability.',
    difficulty: 'Intermediate',
    questions: 16,
    duration: '22 minutes',
    category: 'Observability',
    topics: [
      'Metrics Collection',
      'Log Aggregation',
      'Distributed Tracing',
      'Alerting Systems',
      'Dashboards and Visualization'
    ],
    prerequisites: [
      'Understanding of monitoring concepts',
      'Basic knowledge of metrics and logs',
      'Familiarity with cloud native applications'
    ]
  },
  'gitops': {
    title: 'GitOps Methodology',
    description: 'Continuous deployment and infrastructure as code with GitOps. Learn about declarative configuration management.',
    difficulty: 'Advanced',
    questions: 14,
    duration: '18 minutes',
    category: 'DevOps',
    topics: [
      'GitOps Principles',
      'ArgoCD and Flux',
      'Infrastructure as Code',
      'Continuous Deployment',
      'Configuration Management'
    ],
    prerequisites: [
      'Strong Git knowledge',
      'Understanding of CI/CD',
      'Experience with Kubernetes'
    ]
  }
};

const QuizLanding: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  
  const quiz = quizId ? mockQuizDetails[quizId as keyof typeof mockQuizDetails] : null;

  const handleBackToQuizzes = () => {
    navigate('/quizzes');
  };

  const handleStartQuiz = () => {
    // TODO: Navigate to actual quiz taking interface
    console.log(`Starting quiz: ${quizId}`);
    alert(`Starting quiz: ${quiz?.title}`);
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

  if (!quiz) {
    return (
      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="xl" style={{ color: 'var(--cncf-blue)' }}>
          Quiz Not Found
        </Title>
        <p>The requested quiz could not be found.</p>
        <Button onClick={handleBackToQuizzes} style={{ marginTop: '1rem' }}>
          Back to Quiz List
        </Button>
      </PageSection>
    );
  }

  return (
    <PageSection hasBodyWrapper={false}>
      <div style={{ marginBottom: '2rem' }}>
        <Button 
          variant="plain" 
          onClick={handleBackToQuizzes}
          style={{ marginBottom: '1rem' }}
        >
          <ArrowLeftIcon style={{ marginRight: '0.5rem' }} />
          Back to Quiz List
        </Button>
        
        <div>
          <Title headingLevel="h1" size="3xl" style={{ color: 'var(--cncf-blue)', marginBottom: '1rem' }}>
            {quiz.title}
          </Title>
          <div style={{ marginBottom: '2rem' }}>
            <Badge 
              color={getDifficultyColor(quiz.difficulty)}
              style={{ marginRight: '1rem', fontSize: '1rem', padding: '0.5rem 1rem' }}
            >
              {quiz.difficulty}
            </Badge>
            <Badge style={{ marginRight: '1rem', fontSize: '1rem', padding: '0.5rem 1rem', backgroundColor: 'var(--cncf-stone)', color: 'var(--cncf-black)' }}>
              {quiz.category}
            </Badge>
            <Badge style={{ marginRight: '1rem', fontSize: '1rem', padding: '0.5rem 1rem', backgroundColor: 'var(--cncf-stone)', color: 'var(--cncf-black)' }}>
              <QuestionCircleIcon style={{ marginRight: '0.25rem' }} />
              {quiz.questions} questions
            </Badge>
            <Badge style={{ fontSize: '1rem', padding: '0.5rem 1rem', backgroundColor: 'var(--cncf-stone)', color: 'var(--cncf-black)' }}>
              <ClockIcon style={{ marginRight: '0.25rem' }} />
              {quiz.duration}
            </Badge>
          </div>
        </div>
      </div>
      
      <Grid hasGutter>
        <GridItem span={8}>
          <Card style={{ marginBottom: '2rem' }}>
            <CardHeader>
              <CardTitle style={{ color: 'var(--cncf-blue)', fontSize: '1.5rem' }}>
                About This Quiz
              </CardTitle>
            </CardHeader>
            <CardBody>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {quiz.description}
              </p>
              
              <Divider style={{ margin: '1.5rem 0' }} />
              
              <Title headingLevel="h3" size="lg" style={{ color: 'var(--cncf-blue)', marginBottom: '1rem' }}>
                Topics Covered
              </Title>
              <List isPlain>
                {quiz.topics.map((topic, index) => (
                  <ListItem key={index} style={{ marginBottom: '0.5rem' }}>
                    • {topic}
                  </ListItem>
                ))}
              </List>
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle style={{ color: 'var(--cncf-blue)', fontSize: '1.5rem' }}>
                Prerequisites
              </CardTitle>
            </CardHeader>
            <CardBody>
              <p style={{ marginBottom: '1rem' }}>
                Before taking this quiz, you should have:
              </p>
              <List isPlain>
                {quiz.prerequisites.map((prereq, index) => (
                  <ListItem key={index} style={{ marginBottom: '0.5rem' }}>
                    • {prereq}
                  </ListItem>
                ))}
              </List>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem span={4}>
          <Card style={{ position: 'sticky', top: '2rem' }}>
            <CardHeader>
              <CardTitle style={{ color: 'var(--cncf-blue)', fontSize: '1.3rem' }}>
                Ready to Start?
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                  This quiz will test your knowledge on <strong>{quiz.category}</strong> concepts.
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--cncf-black)' }}>
                  You'll have <strong>{quiz.duration}</strong> to complete <strong>{quiz.questions} questions</strong>.
                </p>
              </div>
              
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleStartQuiz}
                style={{ 
                  backgroundColor: 'var(--cncf-blue)', 
                  borderColor: 'var(--cncf-blue)',
                  width: '100%',
                  fontSize: '1.1rem',
                  padding: '1rem'
                }}
              >
                <PlayIcon style={{ marginRight: '0.5rem' }} />
                Start Quiz
              </Button>
              
              <p style={{ fontSize: '0.8rem', color: 'var(--cncf-black)', marginTop: '1rem', textAlign: 'center' }}>
                You can pause and resume at any time
              </p>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </PageSection>
  );
};

export { QuizLanding };

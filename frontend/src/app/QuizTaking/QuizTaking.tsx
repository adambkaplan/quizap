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
  GridItem,
  Radio,
  Progress,
  Alert
} from '@patternfly/react-core';
import { ArrowLeftIcon, CheckCircleIcon, TimesCircleIcon } from '@patternfly/react-icons';

// Mock quiz questions data
const mockQuizQuestions = {
  'kubernetes-basics': [
    {
      id: 1,
      question: "What is a Pod in Kubernetes?",
      options: [
        "A collection of containers that share storage and network",
        "A single container running in Kubernetes",
        "A Kubernetes cluster node",
        "A networking component in Kubernetes"
      ],
      correctAnswer: 0,
      explanation: "A Pod is the smallest deployable unit in Kubernetes and can contain one or more containers that share storage and network resources."
    },
    {
      id: 2,
      question: "Which command is used to create a deployment in Kubernetes?",
      options: [
        "kubectl create deployment",
        "kubectl deploy create",
        "kubectl new deployment",
        "kubectl make deployment"
      ],
      correctAnswer: 0,
      explanation: "The correct command is 'kubectl create deployment' followed by the deployment name and image."
    },
    {
      id: 3,
      question: "What is the purpose of a Service in Kubernetes?",
      options: [
        "To store configuration data",
        "To provide a stable network endpoint for Pods",
        "To manage Pod lifecycles",
        "To store secrets"
      ],
      correctAnswer: 1,
      explanation: "A Service provides a stable network endpoint and load balancing for a set of Pods."
    },
    {
      id: 4,
      question: "Which of the following is NOT a Kubernetes resource type?",
      options: [
        "Deployment",
        "ConfigMap",
        "Dockerfile",
        "Secret"
      ],
      correctAnswer: 2,
      explanation: "Dockerfile is a Docker concept, not a Kubernetes resource. Kubernetes resources include Deployments, ConfigMaps, Secrets, etc."
    },
    {
      id: 5,
      question: "What does 'kubectl get pods' command do?",
      options: [
        "Creates new pods",
        "Lists all pods in the current namespace",
        "Deletes pods",
        "Updates pod configurations"
      ],
      correctAnswer: 1,
      explanation: "The 'kubectl get pods' command lists all pods in the current namespace."
    }
  ],
  'cncf-projects': [
    {
      id: 1,
      question: "Which of the following is a graduated CNCF project?",
      options: [
        "Istio",
        "Kubernetes",
        "Helm",
        "Prometheus"
      ],
      correctAnswer: 1,
      explanation: "Kubernetes is a graduated CNCF project, along with Prometheus. Istio and Helm are incubating projects."
    },
    {
      id: 2,
      question: "What is the primary purpose of Prometheus?",
      options: [
        "Container orchestration",
        "Service mesh",
        "Monitoring and alerting",
        "Package management"
      ],
      correctAnswer: 2,
      explanation: "Prometheus is a monitoring and alerting toolkit designed for reliability and scalability."
    },
    {
      id: 3,
      question: "Which CNCF project is known as 'The Linux of the cloud'?",
      options: [
        "Docker",
        "Kubernetes",
        "OpenShift",
        "Mesos"
      ],
      correctAnswer: 1,
      explanation: "Kubernetes is often referred to as 'The Linux of the cloud' due to its foundational role in cloud native computing."
    }
  ],
  'container-security': [
    {
      id: 1,
      question: "What is the principle of least privilege in container security?",
      options: [
        "Running containers as root user",
        "Granting minimal necessary permissions",
        "Using the latest container images",
        "Running all containers in privileged mode"
      ],
      correctAnswer: 1,
      explanation: "The principle of least privilege means granting only the minimal necessary permissions required for the container to function."
    },
    {
      id: 2,
      question: "Which of the following is a best practice for container image security?",
      options: [
        "Using base images with many pre-installed packages",
        "Regularly scanning images for vulnerabilities",
        "Running containers as root",
        "Disabling security policies"
      ],
      correctAnswer: 1,
      explanation: "Regularly scanning container images for vulnerabilities is a critical security best practice."
    }
  ],
  'service-mesh': [
    {
      id: 1,
      question: "What is the primary benefit of a service mesh?",
      options: [
        "Faster application development",
        "Automatic service discovery and load balancing",
        "Reduced memory usage",
        "Simplified database management"
      ],
      correctAnswer: 1,
      explanation: "Service meshes provide automatic service discovery, load balancing, and traffic management between microservices."
    }
  ],
  'observability': [
    {
      id: 1,
      question: "What are the three pillars of observability?",
      options: [
        "Metrics, Logs, and Traces",
        "CPU, Memory, and Disk",
        "Request, Response, and Error",
        "Input, Process, and Output"
      ],
      correctAnswer: 0,
      explanation: "The three pillars of observability are Metrics (quantitative data), Logs (discrete events), and Traces (request flows)."
    }
  ],
  'gitops': [
    {
      id: 1,
      question: "What is GitOps?",
      options: [
        "A version control system for code",
        "A methodology for managing infrastructure and applications using Git",
        "A CI/CD tool",
        "A container orchestration platform"
      ],
      correctAnswer: 1,
      explanation: "GitOps is a methodology that uses Git as the single source of truth for declarative infrastructure and applications."
    }
  ]
};

interface QuizTakingProps {}

const QuizTaking: React.FunctionComponent<QuizTakingProps> = () => {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [quizCompleted, setQuizCompleted] = React.useState(false);
  const [answeredQuestions, setAnsweredQuestions] = React.useState<boolean[]>([]);

  const questions = quizId ? mockQuizQuestions[quizId as keyof typeof mockQuizQuestions] : [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  React.useEffect(() => {
    if (questions.length > 0) {
      setAnsweredQuestions(new Array(questions.length).fill(false));
    }
  }, [questions.length]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showAnswer) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null) {
      setShowAnswer(true);
      if (selectedAnswer === currentQuestion.correctAnswer) {
        setScore(score + 1);
      }
      const newAnsweredQuestions = [...answeredQuestions];
      newAnsweredQuestions[currentQuestionIndex] = true;
      setAnsweredQuestions(newAnsweredQuestions);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleFinishQuiz = () => {
    navigate('/quizzes');
  };

  const handleBackToQuiz = () => {
    navigate(`/quiz/${quizId}`);
  };

  if (!questions || questions.length === 0) {
    return (
      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="xl" style={{ color: 'var(--cncf-blue)' }}>
          Quiz Not Found
        </Title>
        <p>The requested quiz could not be found.</p>
        <Button onClick={() => navigate('/quizzes')} style={{ marginTop: '1rem' }}>
          Back to Quiz List
        </Button>
      </PageSection>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const isPassing = percentage >= 70;
    
    return (
      <PageSection hasBodyWrapper={false}>
        <div style={{ marginBottom: '2rem' }}>
          <Button 
            variant="plain" 
            onClick={handleBackToQuiz}
            style={{ marginBottom: '1rem' }}
          >
            <ArrowLeftIcon style={{ marginRight: '0.5rem' }} />
            Back to Quiz Details
          </Button>
        </div>

        <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
          <CardHeader>
            <CardTitle style={{ color: 'var(--cncf-blue)', fontSize: '2rem', textAlign: 'center' }}>
              Quiz Completed!
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {isPassing ? '🎉' : '📚'}
              </div>
              <Title headingLevel="h2" size="xl" style={{ color: isPassing ? 'var(--cncf-blue)' : 'var(--cncf-pink)' }}>
                {isPassing ? 'Congratulations!' : 'Keep Learning!'}
              </Title>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                You scored <strong>{score}</strong> out of <strong>{totalQuestions}</strong> questions correctly.
              </p>
              <Badge 
                color={isPassing ? 'green' : 'red'}
                style={{ fontSize: '1.5rem', padding: '1rem 2rem' }}
              >
                {percentage}%
              </Badge>
            </div>

            <Divider style={{ margin: '2rem 0' }} />

            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '2rem' }}>
                {isPassing 
                  ? 'Great job! You have a solid understanding of this topic.'
                  : 'Don\'t worry! Review the material and try again to improve your score.'
                }
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button 
                  variant="primary" 
                  onClick={handleFinishQuiz}
                  style={{ 
                    backgroundColor: 'var(--cncf-blue)', 
                    borderColor: 'var(--cncf-blue)'
                  }}
                >
                  Back to Quiz List
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setSelectedAnswer(null);
                    setShowAnswer(false);
                    setScore(0);
                    setQuizCompleted(false);
                    setAnsweredQuestions(new Array(questions.length).fill(false));
                  }}
                  style={{ 
                    backgroundColor: 'var(--cncf-turquoise)', 
                    borderColor: 'var(--cncf-turquoise)',
                    color: 'var(--cncf-black)'
                  }}
                >
                  Retake Quiz
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </PageSection>
    );
  }

  return (
    <PageSection hasBodyWrapper={false}>
      <div style={{ marginBottom: '2rem' }}>
        <Button 
          variant="plain" 
          onClick={handleBackToQuiz}
          style={{ marginBottom: '1rem' }}
        >
          <ArrowLeftIcon style={{ marginRight: '0.5rem' }} />
          Back to Quiz Details
        </Button>
        
        <div style={{ marginBottom: '1rem' }}>
          <Title headingLevel="h1" size="xl" style={{ color: 'var(--cncf-blue)' }}>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Title>
          <Progress 
            value={progress} 
            style={{ marginTop: '1rem' }}
            aria-label={`Quiz progress: ${Math.round(progress)}%`}
          />
        </div>
      </div>
      
      <Card style={{ 
        maxWidth: '800px', 
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        <CardHeader>
          <CardTitle style={{ color: 'var(--cncf-blue)', fontSize: '1.5rem' }}>
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div style={{ marginBottom: '2rem' }}>
            {currentQuestion.options.map((option, index) => (
              <div key={index} style={{ marginBottom: '1rem' }}>
                <Radio
                  id={`option-${index}`}
                  name="quiz-answer"
                  label={option}
                  isChecked={selectedAnswer === index}
                  onChange={() => handleAnswerSelect(index)}
                  isDisabled={showAnswer}
                  style={{
                    fontSize: '1.1rem',
                    padding: '0.75rem',
                    border: selectedAnswer === index ? '2px solid var(--cncf-blue)' : '1px solid var(--cncf-stone)',
                    borderRadius: '4px',
                    backgroundColor: showAnswer && index === currentQuestion.correctAnswer 
                      ? 'var(--cncf-turquoise)' 
                      : showAnswer && selectedAnswer === index && index !== currentQuestion.correctAnswer
                      ? '#ffebee'
                      : 'transparent'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Fixed width container for explanation to prevent layout shift */}
          <div style={{ 
            width: '100%',
            marginBottom: '2rem',
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            {showAnswer && (
              <Alert
                variant={selectedAnswer === currentQuestion.correctAnswer ? 'success' : 'warning'}
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect!'}
                  </div>
                }
                style={{ 
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <p style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  {currentQuestion.explanation}
                </p>
              </Alert>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {!showAnswer ? (
                <Button 
                  variant="primary" 
                  onClick={handleSubmitAnswer}
                  isDisabled={selectedAnswer === null}
                  style={{ 
                    backgroundColor: 'var(--cncf-blue)', 
                    borderColor: 'var(--cncf-blue)'
                  }}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={handleNextQuestion}
                  style={{ 
                    backgroundColor: 'var(--cncf-blue)', 
                    borderColor: 'var(--cncf-blue)'
                  }}
                >
                  {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
                </Button>
              )}
            </div>
            
            <div style={{ fontSize: '0.9rem', color: 'var(--cncf-black)' }}>
              Score: {score}/{currentQuestionIndex + (showAnswer ? 1 : 0)}
            </div>
          </div>
        </CardBody>
      </Card>
    </PageSection>
  );
};

export { QuizTaking };

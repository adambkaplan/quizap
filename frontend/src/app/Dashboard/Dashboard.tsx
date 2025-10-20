import * as React from 'react';
import { PageSection, Title, Card, CardBody, CardHeader, CardTitle, Grid, GridItem } from '@patternfly/react-core';

const Dashboard: React.FunctionComponent = () => (
  <PageSection hasBodyWrapper={false}>
    <div>
      <Title headingLevel="h1" size="lg" style={{ color: 'var(--cncf-blue)' }}>
        Cloud Native University
      </Title>
      <p style={{ color: 'var(--cncf-black)', fontSize: '1.2em', marginBottom: '2rem' }}>
        Welcome to the Cloud Native Computing Foundation's educational platform
      </p>
    </div>
    
    <Grid hasGutter>
      <GridItem span={6}>
        <Card>
          <CardHeader>
            <CardTitle>CNCF Projects</CardTitle>
          </CardHeader>
          <CardBody>
            <p>
              Explore the comprehensive ecosystem of cloud native projects maintained by the CNCF.
            </p>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem span={6}>
        <Card>
          <CardHeader>
            <CardTitle>Learning Paths</CardTitle>
          </CardHeader>
          <CardBody>
            <p>
              Follow structured learning paths to master cloud native technologies and best practices.
            </p>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem span={6}>
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardBody>
            <p>
              Earn industry-recognized certifications in Kubernetes and cloud native technologies.
            </p>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem span={6}>
        <Card>
          <CardHeader>
            <CardTitle>Community</CardTitle>
          </CardHeader>
          <CardBody>
            <p>
              Connect with the global cloud native community and contribute to open source projects.
            </p>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  </PageSection>
)

export { Dashboard };

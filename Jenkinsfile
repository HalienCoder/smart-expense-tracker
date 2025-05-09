pipeline {
  agent {
    docker {
      image 'node:18' // or 'node:20' if needed
    }
  }

  environment {
    AWS_ACCESS_KEY_ID     = credentials('aws-access-key-id')
    AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
    VITE_SUPABASE_URL     = credentials('supabase-url')
    VITE_SUPABASE_ANON_KEY= credentials('supabase-anon-key')
    AWS_DEFAULT_REGION    = 'us-east-1'
    BUCKET_NAME           = ''
  }

  stages {
    stage('Install Dependencies & Build') {
      steps {
        dir('frontend') {
          sh 'npm ci || npm install'
          sh 'npm run build'
        }
      }
    }

    stage('Install AWS CLI') {
      steps {
        sh '''
          apt-get update && \
          apt-get install -y unzip curl && \
          curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
          unzip awscliv2.zip && \
          ./aws/install
        '''
      }
    }

    stage('Deploy to S3') {
      steps {
        dir('frontend') {
          sh "aws s3 sync dist/ s3://$BUCKET_NAME --delete"
        }
      }
    }
  }
}

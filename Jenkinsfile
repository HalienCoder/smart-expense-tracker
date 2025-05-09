pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID = credentials('aws-access-key')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-key')
        VITE_SUPABASE_URL = credentials('supabase-url')
        VITE_SUPABASE_ANON_KEY = credentials('supabase-anon-key')
        BUCKET_NAME = 'my-expense-tracker-app11'  // Replace with your actual bucket name
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build & Deploy using Node Docker') {
            agent {
                docker {
                    image 'node:18'
                    args '-u root:root' // Ensures npm installs correctly in container
                }
            }

            environment {
                PATH = "$PATH:/root/.npm-global/bin"
            }

            steps {
                dir('frontend') {
                    withEnv([
                        "VITE_SUPABASE_URL=${env.VITE_SUPABASE_URL}",
                        "VITE_SUPABASE_ANON_KEY=${env.VITE_SUPABASE_ANON_KEY}"
                    ]) {
                        sh '''
                          npm ci
                          npm run build
                        '''
                    }
                }
            }
        }

        stage('Install AWS CLI & Deploy to S3') {
            agent any
            steps {
                sh '''
                  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
                  unzip -q awscliv2.zip
                  sudo ./aws/install

                  aws s3 rm s3://$BUCKET_NAME --recursive
                  aws s3 cp frontend/dist s3://$BUCKET_NAME --recursive
                '''
            }
        }
    }
}

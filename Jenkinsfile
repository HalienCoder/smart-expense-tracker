pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        VITE_SUPABASE_URL = credentials('supabase-url')
        VITE_SUPABASE_ANON_KEY = credentials('supabase-anon-key')
        BUCKET_NAME = 'my-expense-tracker-app11'  // Replace with your actual bucket name
    }

    stages {
        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/HalienCoder/smart-expense-tracker', branch: 'main'
            }
        }

        stage('Build React App') {
            steps {
                sh '''
                    echo "Installing dependencies..."
                    npm install

                    echo "Building the app..."
                    npm run build
                '''
            }
        }

        stage('Deploy to S3') {
            steps {
                sh '''
                    echo "Uploading build to S3..."
                    aws s3 sync dist/ s3://your-s3-bucket-name --delete
                '''
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed.'
        }
        success {
            echo 'Deployed successfully to S3!'
        }
    }
}
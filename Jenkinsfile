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
                dir('frontend') {
                    script {
                        if (fileExists('package.json')) {
                            sh '''
                                echo "Installing dependencies..."
                                sudo npm install

                                echo "Supabase URL: $VITE_SUPABASE_URL"
                                echo "Bucket: $BUCKET_NAME"


                                echo "Building the app..."
                                npm run build

                                echo "Listing current directory:"
                                ls -l

                                echo "Listing dist directory:"
                                ls -l dist || echo "dist not found"
                            '''
                        } else {
                            error "package.json not found in 'frontend' directory!"
                        }
                    }
                }
            }
        }

        stage('Deploy to S3') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "Uploading to S3..."
                        aws s3 sync dist/ s3://$BUCKET_NAME --delete
                    '''
                }
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
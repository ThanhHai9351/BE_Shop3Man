pipeline {
    agent any

    environment {
        NODE_VERSION = '16.20.0'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/ThanhHai9351/BE_Shop3Man'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'node -v'
                    sh 'npm install --legacy-peer-deps'
                }
            }
        }

         stage('Run Test') {
            steps {
                script {
                    sh 'npm run test'
                }
            }
        }

        stage('Run Build') {
            steps {
                script {
                    sh 'npm run build'
                }
            }
        }

         stage('Run Code') {
            steps {
                script {
                    sh 'npm run dev'
                }
            }
        }
    }

    stage('Build Docker Image') {
    steps {
        script {
            sh 'docker-compose up --build'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }

}

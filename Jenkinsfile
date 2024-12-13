pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/ThanhHai9351/BE_Shop3Man'
            }
        }

        stage('Install Dependencies') {
    steps {
        script {
            def nodejs = tool name: 'NodeJs', type: 'NodeJS'
            env.PATH = "${nodejs}/bin:${env.PATH}"
            sh 'node -v'
            sh 'npm install'
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

        stage('Build Docker Image') {
        steps {
            script {
                echo 'Building Docker Image...'
                sh '''
                docker-compose -v
                docker-compose up --build
                    '''
                }
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

pipeline {
    agent any
    tools {
        nodejs 'nodejs1820'
    }

    environment {
        DOCKER_COMPOSE_VERSION = '1.29.2'
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
                    sh 'npm -v'
                    sh 'npm install --legacy-peer-deps'
                }
            }
        }

        stage('Run Tests') {
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

        // stage('Set Up Docker Compose Environment') {
        //     steps {
        //         script {
        //             echo 'Setting up Docker Compose environment...'
        //             sh '''
        //                 mkdir -p $HOME/bin
        //                 curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o $HOME/bin/docker-compose
        //                 chmod +x $HOME/bin/docker-compose
        //                 export PATH=$HOME/bin:$PATH
        //                 $HOME/bin/docker-compose -v || docker-compose -v
        //             '''
        //         }
        //     }
        // }

        // stage('Deploy with Docker Compose') {
        //     steps {
        //         script {
        //             echo 'Deploying application using Docker Compose...'
        //             sh '''
        //                 export MONGO_DB=${MONGO_DB}
        //                 export REDIS_HOST=${REDIS_HOST}
        //                 export REDIS_PW=${REDIS_PW}
        //                 export REDIS_PORT=${REDIS_PORT}
        //                 $HOME/bin/docker-compose up --build
        //             '''
        //         }
        //     }
        // }
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

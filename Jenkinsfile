pipeline {
    agent any
    stages {
        stage('Initialize') {
            steps {
                script {
                    sh 'docker compose down || true'
                }
            }
        }
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Clean Up') {
            steps {
                script {
                    sh 'docker rm -f $(docker ps -a -f status=exited -q) || true'
                    sh 'docker rmi $(docker images -a -q) || true'
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    sh 'docker compose up -d'
                }
            }
        }
    }
    post {
        success {
            script {
                echo 'Deployment succeeded!'
            }
        }
        failure {
            script {
                echo 'Deployment failed. Cleaning up...'
                sh 'docker compose down || true'
            }
        }
    }
}
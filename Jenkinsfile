pipeline {
    agent {
        label 'nodejs'
    }
    stages {
        stage('External Components Install') {            
            steps {
                dir("projects/external-components") {
                    sh 'npm ci -d'                
                }
            }     
        }
        stage('Install') {            
            steps {
                sh 'npm ci -d'
            }     
        }
        stage('Build') {
            steps {
                sh 'npm run build:nowatch'                
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploy'                
            }
        }
    }
}
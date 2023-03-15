pipeline {
    agent {
        label 'nodejs'
    }
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'                
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
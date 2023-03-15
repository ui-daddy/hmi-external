pipeline {
    agent {
        label 'nodejs'
    }
    stages {
        stage('Install') {
            dir("./projects/external-components") {
                steps {
                    sh 'npm i'                
                }
            }     
        }
        stage('Build') {
            dir("./projects/external-components") {
                steps {
                    sh 'npm run build:nowatch'
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploy'                
            }
        }
    }
}
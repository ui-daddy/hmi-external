pipeline {
    agent {
        label 'nodejs'
    }
    stages {
        stage('Install') {            
            steps {
                dir("./projects/external-components") {
                    sh 'npm i'                
                }
            }     
        }
        stage('Build') {
            steps {
                dir("./projects/external-components") {
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
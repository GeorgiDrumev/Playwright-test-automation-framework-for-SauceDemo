pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-jammy'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    npm ci
                '''
            }
        }
        stage('Run Playwright Tests') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-jammy'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    npm test
                '''
            }
        }
    }
    post {
        always {
            junit 'test-results/junit.xml'
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report',
                reportTitles: '',
                includes: '**/*',
                escapeUnderscores: false
            ])
        }
    }
}

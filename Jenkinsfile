// pipeline {
// agent any

// tools {
//     allure 'Allure'
// }

// stages {

//     stage('Checkout Source') {
//         steps {
//             checkout scm
//         }
//     }

//     stage('Install Dependencies') {
//         steps {
//             bat 'npm ci'
//         }
//     }

//     stage('Install Playwright Browsers') {
//         steps {
//             bat 'npx playwright install'
//         }
//     }

//     stage('Run Playwright Tests') {
//         steps {
//             catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
//                 bat 'npx playwright test'
//             }
//         }
//     }
// }

// post {

//     always {

//         allure(
//             includeProperties: false,
//             jdk: '',
//             results: [[path: 'allure-results']]
//         )

//         publishHTML([
//             allowMissing: false,
//             alwaysLinkToLastBuild: true,
//             keepAll: true,
//             reportDir: 'playwright-report',
//             reportFiles: 'index.html',
//             reportName: 'Playwright Report'
//         ])

//         archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true

//         archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true

//         archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
//     }

//     success {
//         echo 'Playwright execution completed successfully.'
//     }

//     unstable {
//         echo 'Some tests failed, but reports were generated.'
//     }

//     failure {
//         echo 'Pipeline failed.'
//     }
// }
// }
pipeline {
    agent any

    tools {
        nodejs "Node22"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Nimish57/Capg_sprint_parabank.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
                bat 'npx playwright install'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def status = bat(
                        script: 'npx playwright test',
                        returnStatus: true
                    )
                    if (status != 0) {
                        echo "Tests failed, but continuing to generate reports..."
                    }
                }
            }
        }

        stage('Publish Reports') {
            steps {
                publishHTML(target: [
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright HTML Report',
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    allowMissing: true,
                    linkRelative: false
                ])
                allure(
                    includeProperties: false,
                    jdk: '',
                    results: [[path: 'allure-results']]
                )
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
            archiveArtifacts artifacts: 'allure-results/**', fingerprint: true
        }
    }
}
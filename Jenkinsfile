pipeline {
    agent any

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        APP_NAME = 'securecart-coach'
        APP_VERSION = "${BUILD_NUMBER}"
        STAGING_HEALTH_URL = 'http://localhost:3001/health'
        PRODUCTION_HEALTH_URL = 'http://localhost:3002/health'
        METRICS_URL = 'http://localhost:3001/metrics'
        PROMETHEUS_TARGETS_URL = 'http://localhost:9090/api/v1/targets'
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building SecureCart Coach API and Docker image...'
                bat 'npm ci'
                bat 'docker build -t %APP_NAME%:%APP_VERSION% .'
                bat 'docker tag %APP_NAME%:%APP_VERSION% %APP_NAME%:latest'
            }
        }

        stage('Test') {
            steps {
                echo 'Running Jest and Supertest automated API tests...'
                bat 'npm test'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
                }
            }
        }

        stage('Code Quality') {
            steps {
                echo 'Running ESLint code quality gate...'
                bat 'npx eslint . --max-warnings=0'
            }
        }

        stage('Security') {
            steps {
                echo 'Running npm audit and Trivy dependency security scan...'
                bat 'npm audit --audit-level=high'
                bat 'docker run --rm -v "%cd%:/project" aquasec/trivy:latest fs --scanners vuln --severity HIGH,CRITICAL --exit-code 0 /project'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying to staging environment using Docker Compose...'
                bat 'docker rm -f securecart-staging securecart-prometheus 2>NUL || ver >NUL'
                bat 'docker compose up -d --build'
                bat '''
                powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='SilentlyContinue'; for ($i=0; $i -lt 12; $i++) { $response = Invoke-WebRequest -UseBasicParsing $env:STAGING_HEALTH_URL; if ($response.StatusCode -eq 200) { Write-Host 'Staging health check passed'; exit 0 }; Start-Sleep -Seconds 5 }; Write-Host 'Staging health check failed'; exit 1"
                '''
            }
        }

        stage('Release') {
            steps {
                echo 'Promoting tested image to production-like release environment...'
                bat 'docker tag %APP_NAME%:%APP_VERSION% %APP_NAME%:release-%BUILD_NUMBER%'
                bat 'docker rm -f securecart-production 2>NUL || ver >NUL'
                bat 'set APP_VERSION=release-%BUILD_NUMBER%&& docker compose -f docker-compose.prod.yml up -d'
                bat '''
                powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='SilentlyContinue'; for ($i=0; $i -lt 12; $i++) { $response = Invoke-WebRequest -UseBasicParsing $env:PRODUCTION_HEALTH_URL; if ($response.StatusCode -eq 200) { Write-Host 'Production health check passed'; exit 0 }; Start-Sleep -Seconds 5 }; Write-Host 'Production health check failed'; exit 1"
                '''
            }
        }

        stage('Monitoring') {
            steps {
                echo 'Checking Prometheus metrics endpoint and monitoring target...'
                bat '''
                powershell -NoProfile -ExecutionPolicy Bypass -Command "$metrics = Invoke-WebRequest -UseBasicParsing $env:METRICS_URL; if ($metrics.Content -match 'securecart_http_requests_total') { Write-Host 'Metrics endpoint check passed'; exit 0 } else { Write-Host 'Metrics endpoint check failed'; exit 1 }"
                '''
                bat '''
                powershell -NoProfile -ExecutionPolicy Bypass -Command "$targets = Invoke-WebRequest -UseBasicParsing $env:PROMETHEUS_TARGETS_URL; if ($targets.Content -match 'securecart-coach') { Write-Host 'Prometheus target check passed'; exit 0 } else { Write-Host 'Prometheus target check failed'; exit 1 }"
                '''
            }
        }
    }

    post {
        success {
            echo 'SecureCart Coach Jenkins DevOps pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check the failed stage and console output.'
        }
        always {
            bat 'docker ps'
        }
    }
}
# SecureCart Coach DevOps Pipeline

SecureCart Coach is a privacy-first grocery savings API developed for the SIT753 7.3HD Jenkins DevOps pipeline task. The project is based on the SecureCart Coach extension idea for DiscountMate, where users can calculate grocery budgets, receive deal recommendations, analyse receipt data, and keep sensitive shopping information private.

The purpose of this repository is to demonstrate a complete Jenkins CI/CD pipeline with automated build, testing, code quality analysis, security scanning, deployment, release promotion, and monitoring.

## Project Overview

SecureCart Coach provides backend API endpoints for:

* checking application health
* calculating grocery shopping plans against a user budget
* recommending discounted grocery deals
* analysing receipt data using privacy-first processing
* exposing Prometheus-compatible monitoring metrics

This project is suitable for a DevOps pipeline because it contains backend logic, testable API endpoints, Docker deployment support, security scanning, and monitoring integration.

## Technologies Used

* Node.js
* Express.js
* Jest
* Supertest
* ESLint
* Docker
* Docker Compose
* Jenkins
* npm audit
* Trivy
* Prometheus

## Jenkins Pipeline Stages

The Jenkins pipeline contains seven automated stages.

### 1. Build

The Build stage installs project dependencies using `npm ci`, builds a Docker image for the SecureCart Coach API, and tags the image with the Jenkins build number.

### 2. Test

The Test stage runs automated API tests using Jest and Supertest. These tests verify the health endpoint, metrics endpoint, shopping plan calculation, deal recommendation logic, and privacy-focused receipt analysis.

### 3. Code Quality

The Code Quality stage runs ESLint to check code structure, maintainability, and JavaScript quality. The pipeline fails if ESLint detects errors or warnings.

### 4. Security

The Security stage runs two security checks:

* `npm audit --audit-level=high` to detect high-severity dependency vulnerabilities
* Trivy filesystem scanning to detect HIGH and CRITICAL vulnerabilities in the project dependencies

### 5. Deploy

The Deploy stage uses Docker Compose to deploy the application to a staging container. The staging application runs on port `3001`, and Jenkins verifies deployment success using the `/health` endpoint.

### 6. Release

The Release stage promotes the tested Docker image to a production-like release environment. The production container runs on port `3002`, and Jenkins verifies release success using the production `/health` endpoint.

### 7. Monitoring

The Monitoring stage validates that the application exposes Prometheus-compatible metrics through the `/metrics` endpoint. Jenkins also checks the Prometheus target API to confirm that the SecureCart Coach monitoring target is available.

## API Endpoints

### Health Check

```text
GET /health
```

Example response:

```json
{
  "status": "UP",
  "service": "SecureCart Coach API",
  "environment": "development",
  "timestamp": "2026-05-29T00:00:00.000Z"
}
```

### Metrics

```text
GET /metrics
```

This endpoint exposes Prometheus-compatible application metrics.

### Shopping Plan

```text
POST /api/shopping/plan
```

Example request:

```json
{
  "budget": 50,
  "items": [
    {
      "name": "Rice",
      "price": 12.5,
      "quantity": 2
    },
    {
      "name": "Milk",
      "price": 3.2,
      "quantity": 1
    }
  ]
}
```

### Deal Recommendations

```text
POST /api/recommendations/deals
```

Example request:

```json
{
  "budget": 10,
  "products": [
    {
      "name": "Pasta",
      "category": "pantry",
      "originalPrice": 5,
      "currentPrice": 3
    },
    {
      "name": "Cereal",
      "category": "breakfast",
      "originalPrice": 8,
      "currentPrice": 6
    }
  ]
}
```

### Receipt Analysis

```text
POST /api/receipts/analyse
```

Example request:

```json
{
  "consentGiven": false,
  "receipt": {
    "store": "Woolworths",
    "date": "2026-05-29",
    "total": 42.75,
    "customerName": "Test User",
    "email": "test@example.com",
    "paymentCard": "4111111111111111",
    "items": [
      {
        "name": "Eggs",
        "price": 6.5
      }
    ]
  }
}
```

## Local Setup

Install dependencies:

```bash
npm install
```

Run automated tests:

```bash
npm test
```

Run ESLint:

```bash
npm run lint
```

Run security audit:

```bash
npm audit
```

Start the application locally:

```bash
npm start
```

Local application URLs:

```text
http://localhost:3000/health
http://localhost:3000/metrics
```

## Docker Build

Build the Docker image:

```bash
docker build -t securecart-coach:1.0.0 .
```

## Staging Deployment

Start the staging environment and Prometheus monitoring:

```bash
docker compose up -d
```

Staging API:

```text
http://localhost:3001/health
```

Staging metrics endpoint:

```text
http://localhost:3001/metrics
```

Prometheus target page:

```text
http://localhost:9090/targets
```

## Production Release

Start the production-like release environment:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Production API:

```text
http://localhost:3002/health
```

## Security Scanning

Run npm audit:

```bash
npm audit --audit-level=high
```

Run Trivy filesystem scan:

```bash
docker run --rm -v "%cd%:/project" aquasec/trivy:latest fs --scanners vuln --severity HIGH,CRITICAL --exit-code 0 /project
```

## Jenkins Usage

The repository includes a `Jenkinsfile` with all seven required pipeline stages:

1. Build
2. Test
3. Code Quality
4. Security
5. Deploy
6. Release
7. Monitoring

To run the pipeline in Jenkins:

1. Create a new Jenkins Pipeline job.
2. Select **Pipeline script from SCM**.
3. Choose Git.
4. Enter this repository URL.
5. Set the branch to `main`.
6. Set the script path to `Jenkinsfile`.
7. Save and click **Build Now**.

## Evidence Generated by the Pipeline

The Jenkins pipeline generates evidence for the 7.3HD task through:

* Docker image build logs
* Jest and Supertest test results
* code coverage output
* ESLint code quality result
* npm audit security result
* Trivy security scan result
* staging deployment health check
* production release health check
* Prometheus metrics endpoint check
* Prometheus target health check

## Author

MD TAMZID HOSSAIN

SIT753 Professional Practice in Information Technology

const request = require('supertest');
const app = require('../src/app');

describe('Health and monitoring endpoints', () => {
  test('GET /health should return API status', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('UP');
    expect(response.body.service).toBe('SecureCart Coach API');
  });

  test('GET /metrics should expose Prometheus metrics', async () => {
    const response = await request(app).get('/metrics');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('securecart_http_requests_total');
  });
});
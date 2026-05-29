const request = require('supertest');
const app = require('../src/app');

describe('Shopping plan API', () => {
  test('POST /api/shopping/plan should calculate total and budget status', async () => {
    const response = await request(app)
      .post('/api/shopping/plan')
      .send({
        budget: 50,
        items: [
          { name: 'Rice', price: 12.5, quantity: 2 },
          { name: 'Milk', price: 3.2, quantity: 1 }
        ]
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.total).toBe(28.2);
    expect(response.body.status).toBe('WITHIN_BUDGET');
    expect(response.body.remainingBudget).toBe(21.8);
  });

  test('POST /api/shopping/plan should detect over-budget shopping', async () => {
    const response = await request(app)
      .post('/api/shopping/plan')
      .send({
        budget: 20,
        items: [
          { name: 'Chicken', price: 16, quantity: 2 }
        ]
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.total).toBe(32);
    expect(response.body.status).toBe('OVER_BUDGET');
  });
});
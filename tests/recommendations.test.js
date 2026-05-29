const request = require('supertest');
const app = require('../src/app');

describe('Deal recommendation API', () => {
  test('POST /api/recommendations/deals should return sorted discount recommendations', async () => {
    const response = await request(app)
      .post('/api/recommendations/deals')
      .send({
        budget: 10,
        products: [
          {
            name: 'Pasta',
            category: 'pantry',
            originalPrice: 5,
            currentPrice: 3
          },
          {
            name: 'Cereal',
            category: 'breakfast',
            originalPrice: 8,
            currentPrice: 6
          }
        ]
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.count).toBe(2);
    expect(response.body.recommendations[0].name).toBe('Pasta');
    expect(response.body.recommendations[0].discountPercent).toBe(40);
  });
});
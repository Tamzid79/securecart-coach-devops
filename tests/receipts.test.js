const request = require('supertest');
const app = require('../src/app');

describe('Receipt privacy API', () => {
  test('POST /api/receipts/analyse should remove sensitive receipt fields', async () => {
    const response = await request(app)
      .post('/api/receipts/analyse')
      .send({
        consentGiven: false,
        receipt: {
          store: 'Woolworths',
          date: '2026-05-29',
          total: 42.75,
          customerName: 'Test User',
          email: 'test@example.com',
          paymentCard: '4111111111111111',
          items: [
            { name: 'Eggs', price: 6.5 }
          ]
        }
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.safeReceipt.store).toBe('Woolworths');
    expect(response.body.safeReceipt.removedSensitiveFields).toContain('paymentCard');
    expect(response.body.consent.sharingMode).toBe('LOCAL_ONLY_PROCESSING');
  });
});
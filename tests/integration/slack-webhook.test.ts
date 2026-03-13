import request from 'supertest';
import { app } from '../../src/index';

describe('slack-webhook integration', () => {
  test('returns 400 for invalid decision', async () => {
    const response = await request(app).post('/webhooks/gate/g1/invalid');
    expect(response.status).toBe(400);
  });
});

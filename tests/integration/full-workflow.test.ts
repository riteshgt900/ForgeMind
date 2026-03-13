import request from 'supertest';
import { app } from '../../src/index';

describe('full workflow integration', () => {
  test('queues task via API', async () => {
    const response = await request(app).post('/tasks').send({
      title: 'Add password strength indicator',
      requirement: 'Add weak medium strong indicator and block weak submission.',
      requestedBy: 'ba@company.com',
    });
    expect(response.status).toBe(202);
    expect(response.body.ok).toBe(true);
    expect(response.body.taskId).toBeDefined();
  });

  test('returns health payload', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.service).toBe('forgemind');
  });
});

import { describe, expect, it } from 'vitest';
import express from 'express';
import request from 'supertest';
import { enlace } from './index.js';

const sampleSpec = { openapi: '3.0.0', info: { title: 'Test', version: '1.0.0' }, paths: {} };

function buildApp() {
  const app = express();
  app.use('/enlace', enlace({ spec: sampleSpec }));
  return app;
}

describe('enlace (express adapter)', () => {
  it('serves the spec at /api/spec', async () => {
    const res = await request(buildApp()).get('/enlace/api/spec');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(sampleSpec);
  });

  it('serves the built UI bundle', async () => {
    const res = await request(buildApp()).get('/enlace/index.html');
    expect(res.status).toBe(200);
    expect(res.type).toBe('text/html');
  });
});

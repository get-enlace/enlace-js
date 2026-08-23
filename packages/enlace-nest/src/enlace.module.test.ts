import { afterEach, describe, expect, it } from 'vitest';
import { NestFactory } from '@nestjs/core';
import { Module, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import { EnlaceModule } from './enlace.module.js';

const sampleSpec = { openapi: '3.0.0', info: { title: 'Test', version: '1.0.0' }, paths: {} };

// Boots via NestFactory.create rather than @nestjs/testing's
// Test.createTestingModule — the latter doesn't finalize an app's routing
// in the same order as a real bootstrap, and ServeStaticModule (which
// registers its Express middleware directly against the underlying
// httpAdapter in onModuleInit, bypassing Nest's own routing layer) ends up
// mounted after Nest's default 404 handler in that path, 404-ing every
// static request. A real NestFactory boot doesn't have that ordering issue,
// and is what every consumer of this module actually goes through anyway.
async function buildApp(path?: string): Promise<INestApplication> {
  class AppModule {}
  // Applied as a plain function call rather than `@Module(...)` decorator
  // syntax, since esbuild's legacy-decorator transform (which Vitest uses)
  // doesn't support decorating a class declared inside a function body —
  // this is functionally identical to the decorator form.
  Module({ imports: [EnlaceModule.forRoot({ spec: sampleSpec, path })] })(AppModule);

  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();
  return app;
}

describe('EnlaceModule', () => {
  let app: INestApplication;

  afterEach(async () => {
    await app?.close();
  });

  it('serves the spec at the default /enlace/api/spec path', async () => {
    app = await buildApp();
    const res = await request(app.getHttpServer()).get('/enlace/api/spec');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(sampleSpec);
  });

  it('serves the built UI bundle at the default mount path', async () => {
    app = await buildApp();
    const res = await request(app.getHttpServer()).get('/enlace/index.html');
    expect(res.status).toBe(200);
    expect(res.type).toBe('text/html');
  });

  it('falls through to the UI bundle for an unmatched client route, without shadowing /api/spec', async () => {
    app = await buildApp();

    const fallback = await request(app.getHttpServer()).get('/enlace/some/deep/client-route');
    expect(fallback.status).toBe(200);
    expect(fallback.type).toBe('text/html');

    const spec = await request(app.getHttpServer()).get('/enlace/api/spec');
    expect(spec.status).toBe(200);
    expect(spec.body).toEqual(sampleSpec);
  });

  it('respects a custom mount path for both the spec and the UI bundle', async () => {
    app = await buildApp('canvas');

    const specRes = await request(app.getHttpServer()).get('/canvas/api/spec');
    expect(specRes.status).toBe(200);
    expect(specRes.body).toEqual(sampleSpec);

    const uiRes = await request(app.getHttpServer()).get('/canvas/index.html');
    expect(uiRes.status).toBe(200);
    expect(uiRes.type).toBe('text/html');
  });
});

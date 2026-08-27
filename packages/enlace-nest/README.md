# @get-enlace/nest

NestJS adapter for [Enlace](https://github.com/get-enlace/enlace-ui) — a visual,
chained-execution canvas for any OpenAPI-documented API. This adapter's job is intentionally
small: it serves the OpenAPI document and the `@get-enlace/ui` static bundle. Everything else
(wiring up a chain, running it, credentials) happens client-side, in the browser.

## Install

```bash
npm install @get-enlace/nest
```

## Usage

### With `@nestjs/swagger` (generated spec)

```ts
// app.module.ts — just import, no config needed
import { EnlaceModule } from '@get-enlace/nest';

@Module({ imports: [EnlaceModule] })
export class AppModule {}

// main.ts — one line after the app is built
const app = await NestFactory.create(AppModule);
const doc = SwaggerModule.createDocument(app, config);
EnlaceModule.setSpec(app, doc);
```

### With a static spec (file path or pre-parsed object)

```ts
@Module({ imports: [EnlaceModule.forRoot({ spec: './openapi.json' })] })
export class AppModule {}
```

`spec` accepts a file path, a URL, or an already-parsed OpenAPI 3.x object.

### What Enlace needs from your spec

Whatever produces it, `servers[0].url` needs to be your API's real, reachable base URL — Enlace
sends every request in a chain straight there from the browser. `operationId` is optional (Enlace
falls back to a synthetic `METHOD /path` label without one) but is what shows on the node and in
the operation search — `@nestjs/swagger` sets one per route by default (`ControllerName_methodName`).

Already serving `@nestjs/swagger`'s own Swagger UI from that same document? Handing it to Enlace
too doesn't change how that keeps working — they're independent consumers of the same object.

### Custom mount path

By default the canvas is at `/enlace`. To change it:

```ts
@Module({ imports: [EnlaceModule.forRoot({ path: 'canvas' })] })
export class AppModule {}
```

## Learn more

See the [`enlace-js` repo](https://github.com/get-enlace/enlace-js) for the other adapters in
this family, and the [`enlace-ui` repo](https://github.com/get-enlace/enlace-ui) for how Enlace
itself works.

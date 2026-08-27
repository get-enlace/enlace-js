# @get-enlace/express

Express adapter for [Enlace](https://github.com/get-enlace/enlace-ui) — a visual,
chained-execution canvas for any OpenAPI-documented API. This adapter's job is intentionally
small: it serves the OpenAPI document and the `@get-enlace/ui` static bundle. Everything else
(wiring up a chain, running it, credentials) happens client-side, in the browser.

## Install

```bash
npm install @get-enlace/express
```

## Usage

```ts
import { enlace } from '@get-enlace/express';

app.use('/enlace', enlace({ spec: './openapi.json' }));
```

`spec` is a file path, a URL, or an already-parsed OpenAPI 3.x object — whatever's easiest to
point at your API's own document.

## Using an existing spec setup

Already generating your OpenAPI document with [`swagger-jsdoc`](https://www.npmjs.com/package/swagger-jsdoc)?
Call it yourself and pass the result straight through as `spec` — no separate export step:

```ts
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import { enlace } from '@get-enlace/express';

const spec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: { title: 'My API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:4000' }], // Enlace sends requests here
  },
  apis: ['./routes/*.js'],
});

app.use('/enlace', enlace({ spec }));
```

`swaggerJsdoc()` runs synchronously with no server instance required, so this works before
`app.listen()`. Already mounting `swagger-ui-express` from the same document? Handing that same
object to `enlace()` too doesn't change how that keeps working — they're independent consumers of
the same spec.

## Learn more

See the [`enlace-js` repo](https://github.com/get-enlace/enlace-js) for the other adapters in
this family, and the [`enlace-ui` repo](https://github.com/get-enlace/enlace-ui) for how Enlace
itself works.

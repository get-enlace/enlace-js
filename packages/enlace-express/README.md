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

## Learn more

See the [`enlace-js` repo](https://github.com/get-enlace/enlace-js) for the other adapters in
this family, and the [`enlace-ui` repo](https://github.com/get-enlace/enlace-ui) for how Enlace
itself works.

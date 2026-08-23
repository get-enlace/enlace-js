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

```ts
import { EnlaceModule } from '@get-enlace/nest';

@Module({ imports: [EnlaceModule.forRoot({ spec: './openapi.json' })] })
export class AppModule {}
```

`spec` is a file path, a URL, or an already-parsed OpenAPI 3.x object — whatever's easiest to
point at your API's own document.

## Learn more

See the [`enlace-js` repo](https://github.com/get-enlace/enlace-js) for the other adapters in
this family, and the [`enlace-ui` repo](https://github.com/get-enlace/enlace-ui) for how Enlace
itself works.

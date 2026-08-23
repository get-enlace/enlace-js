# enlace-js

Node/JS framework adapters for [Enlace](https://github.com/get-enlace/enlace-ui) —
a visual, chained-execution canvas for any OpenAPI-documented API. Each
adapter here is a thin, idiomatic package for its own framework: it serves
the OpenAPI document and the `@get-enlace/ui` static bundle, and nothing
else — all execution runs client-side, in the browser, inside
`@get-enlace/ui` itself. See that repo's `ARCHITECTURE.md` for the full
design.

## Packages

- **`packages/enlace-express`** (`@get-enlace/express`) — Express adapter.
- **`packages/enlace-nest`** (`@get-enlace/nest`) — NestJS adapter.

More planned: `@get-enlace/fastify`. Each new adapter is its own package
here, alongside the others, not a separate repo — same shared CI, same
install/build conventions.

## Install & usage

**Express:**

```bash
npm install @get-enlace/express
```

```ts
import { enlace } from '@get-enlace/express';

app.use('/enlace', enlace({ spec: './openapi.json' }));
```

**NestJS:**

```bash
npm install @get-enlace/nest
```

```ts
import { EnlaceModule } from '@get-enlace/nest';

@Module({ imports: [EnlaceModule.forRoot({ spec: './openapi.json' })] })
export class AppModule {}
```

In both cases, `spec` is a file path, a URL, or an already-parsed OpenAPI
3.x object — whatever's easiest to point at your API's own document.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for local development setup and
how the CI/CD pipeline works.

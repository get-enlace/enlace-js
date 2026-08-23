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

More planned: `@get-enlace/nest`, `@get-enlace/fastify`. Each new adapter is
its own package here, alongside the others, not a separate repo — same
shared CI, same install/build conventions.

## Development

```bash
npm install
npm run typecheck
npm run build
```

`@get-enlace/ui` is installed from GitHub Packages (`dev` dist-tag today —
see `.npmrc`), not as a local workspace sibling — this repo has no access
to that package's source, only its published bundle.

## Publishing

Dev builds publish to GitHub Packages under the `dev` dist-tag, same
pattern as `get-enlace/enlace-ui`. See `.github/workflows/main.yml`.

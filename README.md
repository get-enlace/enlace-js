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

Three workflows under `.github/workflows/`:

- **`build.yml`** — every PR: typecheck, build, test, e2e across the whole
  workspace.
- **`enlace-express.yml`** / **`enlace-nest.yml`** — one per package,
  path-scoped to that package's own directory so unrelated packages don't
  rebuild or republish on each other's changes. On push to `main`:
  `deploy-dev` publishes to GitHub Packages' `dev` dist-tag (skipped if
  that package hasn't changed since its last publish), then `deploy-prod`
  — gated behind the `production` environment's required-reviewer
  approval — publishes the version already committed in that package's
  `package.json` to npmjs.org, tags it, and bumps the patch version for
  next time.

Publishing to npmjs.org needs an `NPM_TOKEN` secret scoped to the
`production` GitHub Environment. The `development`/`production`
environments already exist (Settings → Environments); `production` still
needs required reviewers configured there before the gate does anything.

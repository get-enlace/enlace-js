# Contributing to enlace-js

## Development

```bash
npm install
npm run typecheck
npm run build
```

`@get-enlace/ui` is installed from GitHub Packages (`dev` dist-tag today —
see `.npmrc`), not as a local workspace sibling — this repo has no access
to that package's source, only its published bundle.

## CI/CD

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

  Both also listen for `repository_dispatch: enlace-ui-release`, fired by
  `enlace-ui`'s own release workflow after it publishes (see
  [`release-strategy.md`](../release-strategy.md)) — no manual
  `workflow_dispatch` escape hatch; a manual override is just a commit
  pushed to `main`.

  Each package pins an **exact** `@get-enlace/ui` version for its prod
  publishes, in its own `ui-version.txt` (`packages/enlace-express/
  ui-version.txt`, `packages/enlace-nest/ui-version.txt` — one per package,
  not shared, since a single dispatch triggers both workflows concurrently
  and a shared file would race). `handle-ui-release` only runs for a
  *production* dispatch (a dev dispatch is a no-op — its `ui-version`
  carries a `-dev.<run>` prerelease suffix, never a valid pin target) and
  does exactly one thing: writes the incoming version into that file and
  commits it.

  The committed `package.json` dependency on `@get-enlace/ui` stays the
  bare `dev` dist-tag **permanently** — that's deliberate, not a
  to-be-replaced placeholder. Every `npm ci` in this repo (PR builds,
  `deploy-dev`, even `deploy-prod`'s own build/test steps) needs something
  reliably resolvable from GitHub Packages, and `dev` is the only thing
  that ever is; nothing else published there is a plain semver version.
  `deploy-prod` alone reads the real pin from `ui-version.txt`, and swaps
  it into `package.json` **transiently**, immediately before `npm
  publish`, then reverts it (`git checkout --`) right after — so the
  published tarball is fully deterministic, but the repo's committed state
  never drifts from `dev`.

  `deploy-prod` refuses to run at all until that file holds a real pinned
  version — a dedicated step checks it before any build work happens.
  `ui-version.txt` starts as `unreleased`; it only becomes real once
  `enlace-ui`'s own first prod release fires a dispatch that pins it. This
  means, unlike the earlier semver-range design, `enlace-js` now needs to
  react to **every** `enlace-ui` production release, not just majors —
  each one prods a new `enlace-js` publish for consumers to see it, since
  an exact pin never resolves to anything newer on its own the way a range
  would. That trade was made deliberately: no `0.0.x`-caret surprises, no
  semver-prerelease edge cases, fully deterministic installs — at the cost
  of `enlace-js` cutting a release for every `enlace-ui` change instead of
  only majors.

Publishing to npmjs.org needs an `NPM_TOKEN` secret scoped to the
`production` GitHub Environment. The `development`/`production`
environments already exist (Settings → Environments), `production` with a
required reviewer configured — only the `NPM_TOKEN` secret is still
outstanding.

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
  (e.g. a manually-bumped `@get-enlace/ui` range) pushed to `main`. These
  packages are **dependency-based** adapters (`@get-enlace/ui` is a real
  npm dependency) — an ordinary patch/minor `enlace-ui` release needs no
  action here at all, since consumers pick it up on their own next
  `npm install`.
  The `handle-ui-release` job only acts on a **major** bump on a
  *production* dispatch (a development dispatch is always a no-op here,
  since its `ui-version` carries a `-dev.<run>` prerelease suffix that must
  never be treated as a candidate for widening a prod dependency range): it
  widens the package's declared `@get-enlace/ui` dependency range and
  falls through into the normal `deploy-dev`/`deploy-prod` path; anything
  else is a no-op.
  (`@get-enlace/ui` is still installed via the bare `dev` dist-tag today,
  not a `^N.x` semver range — that switch happens once `enlace-ui` cuts its
  first real prod version, at which point `handle-ui-release`'s major-bump
  comparison starts actually widening something.)

Publishing to npmjs.org needs an `NPM_TOKEN` secret scoped to the
`production` GitHub Environment. The `development`/`production`
environments already exist (Settings → Environments), `production` with a
required reviewer configured — only the `NPM_TOKEN` secret is still
outstanding.

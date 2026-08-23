import { DynamicModule, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'node:path';
import { createRequire } from 'node:module';
import { ENLACE_OPTIONS } from './constants.js';
import { EnlaceController } from './enlace.controller.js';
import type { SpecSource } from './specLoader.js';

const require = createRequire(import.meta.url);

export interface EnlaceOptions {
  /** A file/URL path or an already-parsed object — the only input this needs is a valid OpenAPI 3.x document, however it's produced or served. */
  spec: SpecSource;
  /**
   * Mount path for the canvas, e.g. `'enlace'` serves the UI at `/enlace`
   * and the spec at `/enlace/api/spec`. Defaults to `'enlace'`.
   *
   * Nest controller prefixes are fixed at decorator time, so this can't
   * vary per `forRoot()` call the way the express adapter's `app.use(path,
   * enlace(...))` does — it's applied via `RouterModule.register()` instead,
   * the standard Nest pattern for a dynamic module with a configurable
   * route prefix.
   */
  path?: string;
}

/**
 * Mounts the Enlace canvas.
 *
 *   @Module({ imports: [EnlaceModule.forRoot({ spec })] })
 *   export class AppModule {}
 *
 * This adapter's job is deliberately small — per ARCHITECTURE.md's MVP
 * model, execution runs entirely client-side in @get-enlace/ui, so there's
 * no `/api/run` or `/api/credentials` here at all. All this does is:
 *   - serve the raw OpenAPI document (parsed into an Operation[] list
 *     client-side, not here — see @get-enlace/ui's engine/specParser.ts),
 *     via EnlaceController
 *   - serve the built UI bundle, via @nestjs/serve-static (platform-
 *     agnostic — works whether the host app runs Nest's Express or Fastify
 *     adapter, unlike @get-enlace/express's direct `express.static` use)
 */
@Module({})
export class EnlaceModule {
  static forRoot(options: EnlaceOptions): DynamicModule {
    const mountPath = options.path ?? 'enlace';

    // Resolved via Node's own module resolution against the installed
    // `@get-enlace/ui` package (a real dependency, see package.json) — not a
    // relative path into this monorepo — so this works identically whether
    // `@get-enlace/ui` got here via an npm workspace symlink (local dev) or
    // a real `node_modules` install (anyone who installs @get-enlace/nest on
    // its own). There's nothing to copy or build into this package itself;
    // the bundle lives wherever @get-enlace/ui's own "files" field ships it
    // (dist/), and it must already be built (`npm run build --workspace
    // @get-enlace/ui`) before this resolves.
    const uiPackageJson = require.resolve('@get-enlace/ui/package.json');
    const uiDist = path.join(path.dirname(uiPackageJson), 'dist');

    return {
      module: EnlaceModule,
      imports: [
        ServeStaticModule.forRoot({
          rootPath: uiDist,
          serveRoot: `/${mountPath}`,
          // Keeps the static middleware from shadowing EnlaceController's
          // `/api/spec` route. `{*splat}` is path-to-regexp v8's wildcard
          // syntax (the version @nestjs/serve-static v5 bundles) — the
          // older unnamed `(.*)` capture group it replaces silently 500s
          // instead of matching, since it's now invalid syntax rather than
          // just non-matching.
          exclude: [`/${mountPath}/api/{*splat}`],
        }),
        RouterModule.register([{ path: mountPath, module: EnlaceModule }]),
      ],
      controllers: [EnlaceController],
      providers: [{ provide: ENLACE_OPTIONS, useValue: options }],
    };
  }
}

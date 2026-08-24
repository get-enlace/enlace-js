import { Inject, Injectable, type OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { Request, Response } from 'express';
import { ENLACE_MOUNT_PATH, ENLACE_OPTIONS } from './constants.js';
import { loadSpec } from './specLoader.js';
import type { EnlaceOptions } from './enlace.module.js';

const NO_SPEC_MESSAGE =
  'No OpenAPI spec configured — call EnlaceModule.setSpec(app, spec) in main.ts, '
  + 'or pass { spec } to EnlaceModule.forRoot().';

/**
 * Registers `<mount>/api/spec` directly on the underlying HTTP adapter —
 * the same technique `@nestjs/swagger` uses for its own `/docs-json` route
 * — instead of as a Nest `@Controller`.
 *
 * A `@Controller` route is resolved through Nest's full request pipeline,
 * which includes any global guards/interceptors the host app has
 * registered (e.g. an app-wide `APP_GUARD` auth guard). That would gate
 * this adapter's spec endpoint behind the host app's own auth policy,
 * breaking zero-config installs the same way it'd break `@nestjs/swagger`
 * if swagger-ui-express routes went through Nest's router instead of being
 * registered on the raw adapter. Registering here the same way — like
 * `ServeStaticModule` already does for the UI bundle (see
 * enlace.module.test.ts) — keeps this endpoint outside the host app's
 * guard/interceptor pipeline entirely, matching ARCHITECTURE.md's "adapter
 * is thin and never entangled with app policy" model.
 */
@Injectable()
export class SpecRouteRegistrar implements OnModuleInit {
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    @Inject(ENLACE_OPTIONS) private readonly options: EnlaceOptions,
    @Inject(ENLACE_MOUNT_PATH) private readonly mountPath: string,
  ) {}

  onModuleInit(): void {
    const httpAdapter = this.adapterHost.httpAdapter;
    httpAdapter.get(`/${this.mountPath}/api/spec`, (_req: Request, res: Response) => {
      if (this.options.spec == null) {
        res.status(503).json({ statusCode: 503, message: NO_SPEC_MESSAGE });
        return;
      }
      res.status(200).json(loadSpec(this.options.spec));
    });
  }
}

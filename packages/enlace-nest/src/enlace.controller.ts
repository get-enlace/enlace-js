import { Controller, Get, Inject } from '@nestjs/common';
import { ENLACE_OPTIONS } from './constants.js';
import { loadSpec } from './specLoader.js';
import type { EnlaceOptions } from './enlace.module.js';

/**
 * Serves the raw OpenAPI document at `<mount>/api/spec`. Read fresh on each
 * request, not cached — matches the "not stored, read fresh each load" rule
 * from ARCHITECTURE.md §4, same as the express adapter's `/api/spec` route.
 *
 * This is the only route this adapter defines — per ARCHITECTURE.md's MVP
 * model, execution runs entirely client-side in @get-enlace/ui, so there's
 * no `/api/run` or `/api/credentials` here at all.
 */
@Controller('api')
export class EnlaceController {
  constructor(@Inject(ENLACE_OPTIONS) private readonly options: EnlaceOptions) {}

  @Get('spec')
  getSpec() {
    return loadSpec(this.options.spec);
  }
}

/** DI token for injecting a module instance's {@link EnlaceOptions} into its spec route. */
export const ENLACE_OPTIONS = Symbol('ENLACE_OPTIONS');

/** DI token for the mount path this instance serves at (e.g. `'enlace'`, `'canvas'`). */
export const ENLACE_MOUNT_PATH = Symbol('ENLACE_MOUNT_PATH');

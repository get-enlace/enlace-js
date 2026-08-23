// Nest's decorators (@Module, @Controller, @Injectable, ...) rely on
// reflect-metadata's Reflect.getMetadata at runtime. The app's own bootstrap
// (main.ts) normally imports this once at the entry point — in tests, this
// file is that entry point.
import 'reflect-metadata';

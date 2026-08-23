import { describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadSpec } from './specLoader.js';

describe('loadSpec', () => {
  it('returns an already-parsed object source unchanged', () => {
    const spec = { openapi: '3.0.0' };
    expect(loadSpec(spec)).toBe(spec);
  });

  it('parses a .json file', () => {
    const dir = mkdtempSync(join(tmpdir(), 'enlace-spec-'));
    try {
      const file = join(dir, 'spec.json');
      writeFileSync(file, JSON.stringify({ openapi: '3.0.0', info: { title: 'Test' } }));
      expect(loadSpec(file)).toEqual({ openapi: '3.0.0', info: { title: 'Test' } });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('parses a .yaml file', () => {
    const dir = mkdtempSync(join(tmpdir(), 'enlace-spec-'));
    try {
      const file = join(dir, 'spec.yaml');
      writeFileSync(file, 'openapi: 3.0.0\ninfo:\n  title: Test\n');
      expect(loadSpec(file)).toEqual({ openapi: '3.0.0', info: { title: 'Test' } });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

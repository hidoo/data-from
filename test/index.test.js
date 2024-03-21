/* eslint import/no-unresolved: off, node/no-sync: off */
import assert from 'node:assert';

describe('@hidoo/data-from', () => {
  it('should be importable.', async () => {
    const module = await import('@hidoo/data-from');

    assert(module);
    assert.equal(typeof module.fromFiles, 'function');
    assert.equal(typeof module.fromFilesSync, 'function');
    assert.equal(typeof module.fromFrontMatter, 'function');
    assert.equal(typeof module.fromString, 'function');
    assert.equal(module.default.fromFiles, module.fromFiles);
    assert.equal(module.default.fromFilesSync, module.fromFilesSync);
    assert.equal(module.default.fromFrontMatter, module.fromFrontMatter);
    assert.equal(module.default.fromString, module.fromString);
  });
});

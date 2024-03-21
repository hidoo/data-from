/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import normalize from '../src/normalize.js';

describe('normalize', () => {
  it('should return empty object if argument "value" is not set.', () => {
    const result = normalize();

    assert.deepStrictEqual(result, {});
  });

  it('should return normalized value if argument "value" is set.', () => {
    const cases = [
      [null, {}],
      ['', {}],
      [0, {}],
      ['test', { test: 'test' }],
      [9, { 9: 9 }],
      [['test'], ['test']],
      [{ test: null }, { test: null }],
      [{ test: [{ hoge: 'hoge' }] }, { test: [{ hoge: 'hoge' }] }]
    ];

    cases.forEach(([value, expected]) => {
      const result = normalize(value);

      assert.deepStrictEqual(result, expected);
    });
  });
});

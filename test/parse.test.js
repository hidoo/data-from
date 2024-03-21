/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import parse from '../src/parse.js';

describe('parse', () => {
  it('should return empty object if argument "value" is not set.', () => {
    const result = parse();

    assert.deepStrictEqual(result, {});
  });

  it('should throw Error if argument "value" is invalid format.', () => {
    try {
      parse('------');
    } catch (error) {
      assert(error instanceof Error);
    }
  });

  it('should return object if argument "value" is valid JSON format string.', () => {
    const cases = [
      [null, {}],
      ['', {}],
      ['0', {}],
      ['test', { test: 'test' }],
      ['9', { 9: 9 }],
      ['["test"]', ['test']],
      ['{"test": null}', { test: null }],
      ['{"test": [{"hoge": "hoge"}]}', { test: [{ hoge: 'hoge' }] }]
    ];

    cases.forEach(([value, expected]) => {
      const result = parse(value);

      assert.deepStrictEqual(result, expected);
    });
  });

  it('should return object if argument "value" is valid JSON5 format string.', () => {
    const cases = [
      [null, {}],
      ['', {}],
      ['0', {}],
      ['test', { test: 'test' }],
      ['9', { 9: 9 }],
      ["['test']", ['test']],
      ['{test: null}', { test: null }],
      ['{test: [{\'hoge\': "ho\nge"}]}', { test: [{ hoge: 'ho ge' }] }]
    ];

    cases.forEach(([value, expected]) => {
      const result = parse(value);

      assert.deepStrictEqual(result, expected);
    });
  });

  it('should return object if argument "value" is valid YAML format string.', () => {
    const cases = [
      [null, {}],
      ['', {}],
      ['0', {}],
      ['test', { test: 'test' }],
      ['9', { 9: 9 }],
      ['- test', ['test']],
      ['test:', { test: null }],
      ['test:\n  - hoge: hoge', { test: [{ hoge: 'hoge' }] }]
    ];

    cases.forEach(([value, expected]) => {
      const result = parse(value);

      assert.deepStrictEqual(result, expected);
    });
  });

  it('should return empty object if argument "value" is not string.', () => {
    const cases = [0, [], {}, () => {}];

    cases.forEach((value) => {
      const result = parse(value);

      assert.deepStrictEqual(result, {});
    });
  });
});

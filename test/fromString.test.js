/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import Handlebars from 'handlebars';
import fromString from '../src/fromString.js';

describe('fromString', () => {
  it('should return empty object if arguments is not set.', () => {
    const result = fromString(),
      expected = {};

    assert.deepStrictEqual(result, expected);
  });

  it('should throw Error if argument "value" is invalid format.', () => {
    try {
      fromString('------');
    } catch (error) {
      assert(error instanceof Error);
    }
  });

  it('should return object if argument "value" is string that valid format.', () => {
    const cases = [
      [null, {}],
      ['', {}],
      ['0', {}],
      ['test', { test: 'test' }],
      ['9', { 9: 9 }],
      // JSON
      ['["test"]', ['test']],
      ['{"test": null}', { test: null }],
      ['{"test": [{"hoge": "hoge"}]}', { test: [{ hoge: 'hoge' }] }],
      // JSON5
      ["['test']", ['test']],
      ['{test: null}', { test: null }],
      ['{test: [{\'hoge\': "ho\nge"}]}', { test: [{ hoge: 'ho ge' }] }],
      // YAML
      ['- test', ['test']],
      ['test:', { test: null }],
      ['test:\n  - hoge: hoge', { test: [{ hoge: 'hoge' }] }]
    ];

    cases.forEach(([value, expected]) => {
      const result = fromString(value);

      assert.deepStrictEqual(result, expected);
    });
  });

  it('should return object if argument "value" is string that valid format includes Handlebars template.', () => {
    const cases = [
      // JSON
      [
        '{"test": {"hoge": "hoge", "fuga": "{{test.hoge}}"}}',
        { test: { hoge: 'hoge', fuga: 'hoge' } }
      ],
      // JSON5
      [
        "{test: {hoge: 'hoge', fuga: '{{test.hoge}}'}}",
        { test: { hoge: 'hoge', fuga: 'hoge' } }
      ],
      // YAML
      [
        'test:\n  hoge: hoge\n  fuga: "{{test.hoge}}"',
        { test: { hoge: 'hoge', fuga: 'hoge' } }
      ]
    ];

    cases.forEach(([value, expected]) => {
      const result = fromString(value);

      assert.deepStrictEqual(result, expected);
    });
  });

  it('should return object if argument "value" is string that valid format includes Handlebars template and argument "options.context" is object.', () => {
    const cases = [
      // JSON
      [
        '{"test": {"hoge": "hoge", "fuga": "{{data.hoge}}", "piyo": "{{test.hoge}}"}}',
        { data: { hoge: 'piyo' } },
        { test: { hoge: 'hoge', fuga: 'piyo', piyo: 'hoge' } }
      ],
      // JSON5
      [
        "{test: {hoge: 'hoge', fuga: '{{data.hoge}}', piyo: '{{test.hoge}}'}}",
        { data: { hoge: 'piyo' } },
        { test: { hoge: 'hoge', fuga: 'piyo', piyo: 'hoge' } }
      ],
      // YAML
      [
        'test:\n  hoge: hoge\n  fuga: "{{data.hoge}}"\n  piyo: "{{test.hoge}}"',
        { data: { hoge: 'piyo' } },
        { test: { hoge: 'hoge', fuga: 'piyo', piyo: 'hoge' } }
      ]
    ];

    cases.forEach(([value, context, expected]) => {
      const result = fromString(value, { context });

      assert.deepStrictEqual(result, expected);
    });
  });

  it('should use specified Handlebars instance if argument "options.handlebars" is set.', () => {
    const hbs = Handlebars.create(),
      cases = [
        // JSON
        [
          '{"test": {"hoge": "hoge", "fuga": "{{wrapBrackets test.hoge}}"}}',
          { test: { hoge: 'hoge', fuga: '[[ hoge ]]' } }
        ],
        // JSON5
        [
          "{test: {hoge: 'hoge', fuga: '{{wrapBrackets test.hoge}}'}}",
          { test: { hoge: 'hoge', fuga: '[[ hoge ]]' } }
        ],
        // YAML
        [
          'test:\n  hoge: hoge\n  fuga: "{{wrapBrackets test.hoge}}"',
          { test: { hoge: 'hoge', fuga: '[[ hoge ]]' } }
        ]
      ];

    // add custom helper
    hbs.registerHelper(
      'wrapBrackets',
      (value) => new Handlebars.SafeString(`[[ ${value} ]]`)
    );

    cases.forEach(([value, expected]) => {
      const result = fromString(value, { handlebars: hbs });

      assert.deepStrictEqual(result, expected);
    });
  });
});

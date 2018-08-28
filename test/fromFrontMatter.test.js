/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import Handlebars from 'handlebars';
import fromFrontMatter from '../src/fromFrontMatter';

describe('fromFrontMatter', () => {

  it('should return formatted object that attributes is null if argument "value" is not set.', () => {
    const result = fromFrontMatter(),
          expected = {body: '', attributes: null, frontmatter: ''};

    assert.deepStrictEqual(result, expected);
  });

  it('should throw Error if argument "value" is invalid format.', () => {
    try {
      fromFrontMatter('------');
    }
    catch (error) {
      assert(error instanceof Error);
    }
  });

  it('should return formatted object if argument "value" is string that includes Front Matter.', () => {
    const cases = [
      [
        'test',
        {body: 'test', attributes: null, frontmatter: ''}
      ],
      // JSON
      [
        '---\n"test"\n---',
        {body: '', attributes: {test: 'test'}, frontmatter: '"test"'}
      ],
      [
        '---\n9\n---',
        {body: '', attributes: {9: 9}, frontmatter: '9'}
      ],
      [
        '---\n["test"]\n---',
        {body: '', attributes: ['test'], frontmatter: '["test"]'}
      ],
      [
        '---\n{"test": null}\n---',
        {body: '', attributes: {test: null}, frontmatter: '{"test": null}'}
      ],
      [
        '---\n{"test": [{"hoge": "hoge"}]}\n---',
        {body: '', attributes: {test: [{hoge: 'hoge'}]}, frontmatter: '{"test": [{"hoge": "hoge"}]}'}
      ],
      [
        '---\n"test"\n---\ntest',
        {body: 'test', attributes: {test: 'test'}, frontmatter: '"test"'}
      ],
      [
        '---\n{"test": {"hoge": "hoge"}}\n---\ntest',
        {body: 'test', attributes: {test: {hoge: 'hoge'}}, frontmatter: '{"test": {"hoge": "hoge"}}'}
      ],
      // JSON5
      [
        '---\n\'test\'\n---',
        {body: '', attributes: {test: 'test'}, frontmatter: '\'test\''}
      ],
      [
        '---\n9\n---',
        {body: '', attributes: {9: 9}, frontmatter: '9'}
      ],
      [
        '---\n[\'test\']\n---',
        {body: '', attributes: ['test'], frontmatter: '[\'test\']'}
      ],
      [
        '---\n{test: null}\n---',
        {body: '', attributes: {test: null}, frontmatter: '{test: null}'}
      ],
      [
        '---\n{test: [{hoge: \'hoge\'}]}\n---',
        {body: '', attributes: {test: [{hoge: 'hoge'}]}, frontmatter: '{test: [{hoge: \'hoge\'}]}'}
      ],
      [
        '---\n\'test\'\n---\ntest',
        {body: 'test', attributes: {test: 'test'}, frontmatter: '\'test\''}
      ],
      [
        '---\n{test: {hoge: \'hoge\'}}\n---\ntest',
        {body: 'test', attributes: {test: {hoge: 'hoge'}}, frontmatter: '{test: {hoge: \'hoge\'}}'}
      ],
      // YAML
      [
        '---\ntest\n---',
        {body: '', attributes: {test: 'test'}, frontmatter: 'test'}
      ],
      [
        '---\n9\n---',
        {body: '', attributes: {9: 9}, frontmatter: '9'}
      ],
      [
        '---\n- test\n---',
        {body: '', attributes: ['test'], frontmatter: '- test'}
      ],
      [
        '---\ntest:\n---',
        {body: '', attributes: {test: null}, frontmatter: 'test:'}
      ],
      [
        '---\ntest:\n  - hoge: hoge\n---',
        {body: '', attributes: {test: [{hoge: 'hoge'}]}, frontmatter: 'test:\n  - hoge: hoge'}
      ],
      [
        '---\ntest\n---\ntest',
        {body: 'test', attributes: {test: 'test'}, frontmatter: 'test'}
      ],
      [
        '---\ntest:\n  hoge: hoge\n---\ntest',
        {body: 'test', attributes: {test: {hoge: 'hoge'}}, frontmatter: 'test:\n  hoge: hoge'}
      ]
    ];

    cases.forEach(([value, expected]) => {
      const result = fromFrontMatter(value);

      assert.deepStrictEqual(result, expected);
    });
  });

  it('should return formatted object if argument "value" is string that includes Front Matter that includes Handlebars Template.', () => {
    const cases = [
      // JSON
      [
        '---\n{"test": {"hoge": "hoge", "fuga": "{{test.hoge}}"}}\n---\n',
        {body: '', attributes: {test: {hoge: 'hoge', fuga: 'hoge'}}, frontmatter: '{"test": {"hoge": "hoge", "fuga": "{{test.hoge}}"}}'}
      ],
      // JSON5
      [
        '---\n{test: {hoge: \'hoge\', fuga: \'{{test.hoge}}\'}}\n---\n',
        {body: '', attributes: {test: {hoge: 'hoge', fuga: 'hoge'}}, frontmatter: '{test: {hoge: \'hoge\', fuga: \'{{test.hoge}}\'}}'}
      ],
      // YAML
      [
        '---\ntest:\n  hoge: hoge\n  fuga: "{{test.hoge}}"\n---\n',
        {body: '', attributes: {test: {hoge: 'hoge', fuga: 'hoge'}}, frontmatter: 'test:\n  hoge: hoge\n  fuga: "{{test.hoge}}"'}
      ]
    ];

    cases.forEach(([value, expected]) => {
      const result = fromFrontMatter(value);

      assert.deepStrictEqual(result, expected);
    });
  });

  it('should return formatted object if argument "value" is string that includes Front Matter that includes Handlebars Template and argument "options.context" is object.', () => {
    const cases = [
      // JSON
      [
        '---\n{"test": {"hoge": "hoge", "fuga": "{{data.hoge}}", "piyo": "{{test.hoge}}"}}\n---\n',
        {data: {hoge: 'piyo'}},
        {body: '', attributes: {test: {hoge: 'hoge', fuga: 'piyo', piyo: 'hoge'}}, frontmatter: '{"test": {"hoge": "hoge", "fuga": "{{data.hoge}}", "piyo": "{{test.hoge}}"}}'}
      ],
      // JSON5
      [
        '---\n{test: {hoge: \'hoge\', fuga: \'{{data.hoge}}\', piyo: \'{{test.hoge}}\'}}\n---\n',
        {data: {hoge: 'piyo'}},
        {body: '', attributes: {test: {hoge: 'hoge', fuga: 'piyo', piyo: 'hoge'}}, frontmatter: '{test: {hoge: \'hoge\', fuga: \'{{data.hoge}}\', piyo: \'{{test.hoge}}\'}}'}
      ],
      // YAML
      [
        '---\ntest:\n  hoge: hoge\n  fuga: "{{data.hoge}}"\n  piyo: "{{test.hoge}}"\n---\n',
        {data: {hoge: 'piyo'}},
        {body: '', attributes: {test: {hoge: 'hoge', fuga: 'piyo', piyo: 'hoge'}}, frontmatter: 'test:\n  hoge: hoge\n  fuga: "{{data.hoge}}"\n  piyo: "{{test.hoge}}"'}
      ]
    ];

    cases.forEach(([value, context, expected]) => {
      const result = fromFrontMatter(value, {context});

      assert.deepStrictEqual(result, expected);
    });
  });

  it('should use specified Handlebars instance if argument "options.handlebars" is set.', () => {
    const hbs = Handlebars.create(),
          cases = [
            // JSON
            [
              '---\n{"test": {"hoge": "hoge", "fuga": "{{wrapBrackets test.hoge}}"}}\n---\n',
              {body: '', attributes: {test: {hoge: 'hoge', fuga: '[[ hoge ]]'}}, frontmatter: '{"test": {"hoge": "hoge", "fuga": "{{wrapBrackets test.hoge}}"}}'}
            ],
            // JSON5
            [
              '---\n{test: {hoge: \'hoge\', fuga: \'{{wrapBrackets test.hoge}}\'}}\n---\n',
              {body: '', attributes: {test: {hoge: 'hoge', fuga: '[[ hoge ]]'}}, frontmatter: '{test: {hoge: \'hoge\', fuga: \'{{wrapBrackets test.hoge}}\'}}'}
            ],
            // YAML
            [
              '---\ntest:\n  hoge: hoge\n  fuga: "{{wrapBrackets test.hoge}}"\n---\n',
              {body: '', attributes: {test: {hoge: 'hoge', fuga: '[[ hoge ]]'}}, frontmatter: 'test:\n  hoge: hoge\n  fuga: "{{wrapBrackets test.hoge}}"'}
            ]
          ];

    // add custom helper
    hbs.registerHelper('wrapBrackets', (value) => new Handlebars.SafeString(`[[ ${value} ]]`));

    cases.forEach(([value, expected]) => {
      const result = fromFrontMatter(value, {handlebars: hbs});

      assert.deepStrictEqual(result, expected);
    });
  });

});

import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';
import fromFiles from '../src/fromFiles.js';

describe('fromFiles', () => {
  let dirname = null;
  let fixturesDir = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
  });

  it('should return empty object if argument "pattern" matched files not readable.', () => {
    const result = fromFiles(
      path.join(fixturesDir, 'not_exists.{json,json5,yaml}')
    );

    assert.deepEqual(result, {});
  });

  it('should throw Error if argument "pattern" matched files are invalid format.', () => {
    try {
      fromFiles(path.join(fixturesDir, 'invalid.{json,json5,yaml}'));
    } catch (error) {
      assert(error instanceof Error);
    }
  });

  it('should return object if argument "pattern" matched files are valid format.', () => {
    const result = fromFiles(path.join(fixturesDir, 'valid.{json,json5,yaml}'));

    assert.deepEqual(result, {
      validJSON: { hoge: 'hoge' },
      validJSON5: { hoge: 'hoge' },
      validYAML: { hoge: 'hoge' }
    });
  });

  it('should return object if argument "pattern" matched files are valid format that includes Handlebars Template.', () => {
    const result = fromFiles(
      path.join(fixturesDir, 'template.{json,json5,yaml}')
    );

    assert.deepEqual(result, {
      validJSON: { hoge: 'hoge', fuga: 'hoge' },
      validJSON5: { hoge: 'hoge', fuga: 'hoge' },
      validYAML: { hoge: 'hoge', fuga: 'hoge' }
    });
  });

  it('should return object if argument "pattern" matched files are valid format that includes Handlebars Template and argument "options.context" is object.', () => {
    const context = { data: { hoge: 'piyo' } },
      result = fromFiles(
        path.join(fixturesDir, 'template-context.{json,json5,yaml}'),
        { context }
      );

    assert.deepEqual(result, {
      validJSON: { hoge: 'hoge', fuga: 'hoge', piyo: 'piyo' },
      validJSON5: { hoge: 'hoge', fuga: 'hoge', piyo: 'piyo' },
      validYAML: { hoge: 'hoge', fuga: 'hoge', piyo: 'piyo' }
    });
  });

  it('should use specified Handlebars instance if argument "options.handlebars" is set.', () => {
    const hbs = Handlebars.create();

    // add custom helper
    hbs.registerHelper(
      'wrapBrackets',
      (value) => new Handlebars.SafeString(`[[ ${value} ]]`)
    );

    const result = fromFiles(
      path.join(fixturesDir, 'template-custom-handlebars.{json,json5,yaml}'),
      { handlebars: hbs }
    );

    assert.deepEqual(result, {
      validJSON: { hoge: 'hoge', fuga: '[[ hoge ]]' },
      validJSON5: { hoge: 'hoge', fuga: '[[ hoge ]]' },
      validYAML: { hoge: 'hoge', fuga: '[[ hoge ]]' }
    });
  });
});

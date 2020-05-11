/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import path from 'path';
import Handlebars from 'handlebars';
import fromFiles from '../src/fromFiles';

describe('fromFiles', () => {

  it('should return empty object if argument "pattern" matched files not readed.', () => {
    const result = fromFiles(path.join(__dirname, 'fixtures/not_exists.{json,json5,yaml}'));

    assert.deepStrictEqual(result, {});
  });

  it('should throw Error if argument "pattern" matched files are invalid format.', () => {
    try {
      fromFiles(path.join(__dirname, 'fixtures/invalid.{json,json5,yaml}'));
    }
    catch (error) {
      assert(error instanceof Error);
    }
  });

  it('should return object if argument "pattern" matched files are valid format.', () => {
    const result = fromFiles(path.join(__dirname, 'fixtures/valid.{json,json5,yaml}'));

    assert.deepStrictEqual(result, {
      validJSON: {hoge: 'hoge'},
      validJSON5: {hoge: 'hoge'},
      validYAML: {hoge: 'hoge'}
    });
  });

  it('should return object if argument "pattern" matched files are valid format that includes Handlebars Template.', () => {
    const result = fromFiles(path.join(__dirname, 'fixtures/template.{json,json5,yaml}'));

    assert.deepStrictEqual(result, {
      validJSON: {hoge: 'hoge', fuga: 'hoge'},
      validJSON5: {hoge: 'hoge', fuga: 'hoge'},
      validYAML: {hoge: 'hoge', fuga: 'hoge'}
    });
  });

  it('should return object if argument "pattern" matched files are valid format that includes Handlebars Template and argument "options.context" is object.', () => {
    const context = {data: {hoge: 'piyo'}},
          result = fromFiles(path.join(__dirname, 'fixtures/template-context.{json,json5,yaml}'), {context});

    assert.deepStrictEqual(result, {
      validJSON: {hoge: 'hoge', fuga: 'hoge', piyo: 'piyo'},
      validJSON5: {hoge: 'hoge', fuga: 'hoge', piyo: 'piyo'},
      validYAML: {hoge: 'hoge', fuga: 'hoge', piyo: 'piyo'}
    });
  });

  it('should use specified Handlebars instance if argument "options.handlebars" is set.', () => {
    const hbs = Handlebars.create();

    // add custom helper
    hbs.registerHelper('wrapBrackets', (value) => new Handlebars.SafeString(`[[ ${value} ]]`));

    const result = fromFiles(path.join(__dirname, 'fixtures/template-custom-handlebars.{json,json5,yaml}'), {handlebars: hbs});

    assert.deepStrictEqual(result, {
      validJSON: {hoge: 'hoge', fuga: '[[ hoge ]]'},
      validJSON5: {hoge: 'hoge', fuga: '[[ hoge ]]'},
      validYAML: {hoge: 'hoge', fuga: '[[ hoge ]]'}
    });
  });

});

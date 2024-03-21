import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';
import { fromFiles, fromFilesSync } from '../src/fromFiles.js';

describe('fromFiles', () => {
  let dirname = null;
  let fixturesDir = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
  });

  describe('Async API', () => {
    context('if argument "pattern" matched files are invalid format.', () => {
      it('should throw Error.', async () => {
        let error = null;

        try {
          await fromFiles(path.join(fixturesDir, 'invalid.{json,json5,yaml}'));
        } catch (err) {
          error = err;
        }

        assert(error instanceof Error);
      });
    });

    context('if argument "pattern" matched files are not readable.', () => {
      it('should return an empty object.', async () => {
        const result = await fromFiles(
          path.join(fixturesDir, 'not_exists.{json,json5,yaml}')
        );

        assert.deepEqual(result, {});
      });
    });

    context('if argument "pattern" matched files are valid format.', () => {
      it('should return an object includes merged data.', async () => {
        const result = await fromFiles(
          path.join(fixturesDir, 'valid.{json,json5,yaml}')
        );

        assert.deepEqual(result, {
          validJSON: { hoge: 'hoge' },
          validJSON5: { hoge: 'hoge' },
          validYAML: { hoge: 'hoge' }
        });
      });

      it('should return an object includes merged data evaluated with Handlebars Template.', async () => {
        const result = await fromFiles(
          path.join(fixturesDir, 'template.{json,json5,yaml}')
        );

        assert.deepEqual(result, {
          validJSON: { hoge: 'hoge', fuga: 'hoge' },
          validJSON5: { hoge: 'hoge', fuga: 'hoge' },
          validYAML: { hoge: 'hoge', fuga: 'hoge' }
        });
      });

      context('with options.', () => {
        it('should use additional context with options.context.', async () => {
          const context = { data: { hoge: 'piyo' } };
          const result = await fromFiles(
            path.join(fixturesDir, 'template-context.{json,json5,yaml}'),
            { context }
          );

          assert.deepEqual(result, {
            validJSON: { hoge: 'hoge', fuga: 'hoge', piyo: 'piyo' },
            validJSON5: { hoge: 'hoge', fuga: 'hoge', piyo: 'piyo' },
            validYAML: { hoge: 'hoge', fuga: 'hoge', piyo: 'piyo' }
          });
        });

        it('should use specified Handlebars instance with options.handlebars.', async () => {
          const hbs = Handlebars.create();
          const wrapBrackets = (value) =>
            new Handlebars.SafeString(`[[ ${value} ]]`);

          // add custom helper
          hbs.registerHelper('wrapBrackets', wrapBrackets);

          const result = await fromFiles(
            path.join(
              fixturesDir,
              'template-custom-handlebars.{json,json5,yaml}'
            ),
            { handlebars: hbs }
          );

          assert.deepEqual(result, {
            validJSON: { hoge: 'hoge', fuga: '[[ hoge ]]' },
            validJSON5: { hoge: 'hoge', fuga: '[[ hoge ]]' },
            validYAML: { hoge: 'hoge', fuga: '[[ hoge ]]' }
          });
        });
      });
    });
  });

  describe('Sync API', () => {
    context('if argument "pattern" matched files are invalid format.', () => {
      it('should throw Error.', () => {
        let error = null;

        try {
          fromFilesSync(path.join(fixturesDir, 'invalid.{json,json5,yaml}'));
        } catch (err) {
          error = err;
        }

        assert(error instanceof Error);
      });
    });

    context('if argument "pattern" matched files are not readable.', () => {
      it('should return an empty object.', () => {
        const result = fromFilesSync(
          path.join(fixturesDir, 'not_exists.{json,json5,yaml}')
        );

        assert.deepEqual(result, {});
      });
    });

    context('if argument "pattern" matched files are valid format.', () => {
      it('should return an object includes merged data.', () => {
        const result = fromFilesSync(
          path.join(fixturesDir, 'valid.{json,json5,yaml}')
        );

        assert.deepEqual(result, {
          validJSON: { hoge: 'hoge' },
          validJSON5: { hoge: 'hoge' },
          validYAML: { hoge: 'hoge' }
        });
      });

      it('should return an object includes merged data evaluated with Handlebars Template.', () => {
        const result = fromFilesSync(
          path.join(fixturesDir, 'template.{json,json5,yaml}')
        );

        assert.deepEqual(result, {
          validJSON: { hoge: 'hoge', fuga: 'hoge' },
          validJSON5: { hoge: 'hoge', fuga: 'hoge' },
          validYAML: { hoge: 'hoge', fuga: 'hoge' }
        });
      });

      context('with options.', () => {
        it('should use additional context with options.context.', () => {
          const context = { data: { hoge: 'piyo' } };
          const result = fromFilesSync(
            path.join(fixturesDir, 'template-context.{json,json5,yaml}'),
            { context }
          );

          assert.deepEqual(result, {
            validJSON: { hoge: 'hoge', fuga: 'hoge', piyo: 'piyo' },
            validJSON5: { hoge: 'hoge', fuga: 'hoge', piyo: 'piyo' },
            validYAML: { hoge: 'hoge', fuga: 'hoge', piyo: 'piyo' }
          });
        });

        it('should use specified Handlebars instance with options.handlebars.', () => {
          const hbs = Handlebars.create();
          const wrapBrackets = (value) =>
            new Handlebars.SafeString(`[[ ${value} ]]`);

          // add custom helper
          hbs.registerHelper('wrapBrackets', wrapBrackets);

          const result = fromFilesSync(
            path.join(
              fixturesDir,
              'template-custom-handlebars.{json,json5,yaml}'
            ),
            { handlebars: hbs }
          );

          assert.deepEqual(result, {
            validJSON: { hoge: 'hoge', fuga: '[[ hoge ]]' },
            validJSON5: { hoge: 'hoge', fuga: '[[ hoge ]]' },
            validYAML: { hoge: 'hoge', fuga: '[[ hoge ]]' }
          });
        });
      });
    });
  });
});

import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import { glob, globSync } from 'glob';
import merge from 'lodash.merge';
import normalize from './normalize.js';
import fromString from './fromString.js';

/**
 * default options
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  /**
   * file encoding
   *
   * @type {String|null}
   */
  encoding: 'utf8',

  /**
   * additional template context
   *
   * @type {Object}
   */
  context: {},

  /**
   * Handlebars instance
   *
   * @type {HandlebarsEnvironment}
   */
  handlebars: null,

  /**
   * glob options
   *
   * @type {Object}
   */
  glob: {},

  /**
   * out verbose log
   *
   * @type {Boolean}
   */
  verbose: false
};

/**
 * Parse contents
 * + handlebars template written inside is re-evaluated with data itself
 *
 * @param {Array<Buffer|String>} contents contents list
 * @param {DEFAULT_OPTIONS} options options
 * @return {Object}
 */
function parseContents(contents = [], options = {}) {
  if (!Array.isArray(contents)) {
    return {};
  }

  const ctx = contents
    .map((content) => fromString(content, options))
    .reduce((prev, data) => merge(prev, data), {});
  const context = merge(normalize(options.context), ctx);

  return contents
    .map((content) => fromString(content, { ...options, context }))
    .reduce((prev, current) => merge(prev, current), {});
}

/**
 * Parse data from files.
 *
 * @param {String} pattern glob pattern
 * @param {DEFAULT_OPTIONS} options options
 * @return {Object}
 * @example
 * import { fromFiles } from '@hidoo/data-from';
 *
 * const data = await fromFiles('/path/to/*.json5');
 */
export async function fromFiles(pattern = '', options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const filePaths = await glob(pattern, opts.glob);
  const contents = await Promise.all(
    filePaths.map(
      async (path) => await fsPromises.readFile(path, opts.encoding)
    )
  );

  return parseContents(contents, opts);
}

/**
 * Parse data from files synchronously.
 *
 * @param {String} pattern glob pattern
 * @param {DEFAULT_OPTIONS} options options
 * @return {Object}
 * @example
 * import { fromFilesSync } from '@hidoo/data-from';
 *
 * const data = fromFiles('/path/to/*.json5');
 */
export function fromFilesSync(pattern = '', options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const contents = globSync(pattern, opts.glob).map((path) =>
    // eslint-disable-next-line node/no-sync
    fs.readFileSync(path, opts.encoding)
  );

  return parseContents(contents, opts);
}

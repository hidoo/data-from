import fs from 'node:fs';
import glob from 'glob';
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
   * Handlrbars instance
   *
   * @type {HandlebarsEnvironment}
   */
  handlebars: null,

  /**
   * out verbose log
   *
   * @type {Boolean}
   */
  verbose: false
};

/**
 * parse data from files.
 * + handlebars template written inside is reevaluated with data itself
 *
 * @param {String} pattern glob pattern
 * @param {DEFAULT_OPTIONS} options options
 * @return {Object}
 *
 * @example
 * import {fromFiles} from '@hidoo/data-from';
 *
 * const data = fromFiles('/path/to/*.json5');
 */
export default function fromFiles(pattern = '', options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options },
    { encoding, context } = opts;

  const { contents, data } = glob
    .sync(pattern)
    .map((path) => fs.readFileSync(path, encoding)) // eslint-disable-line node/no-sync
    .map((content) => {
      return { content, data: fromString(content, opts) };
    })
    .reduce(
      (prev, current) => {
        return {
          contents: [...prev.contents, current.content],
          data: merge(prev.data, current.data)
        };
      },
      { contents: [], data: {} }
    );

  const newContext = merge(normalize(context), data);

  return contents
    .map((content) => fromString(content, { ...opts, context: newContext }))
    .reduce((prev, current) => merge(prev, current), {});
}

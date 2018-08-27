import fs from 'fs';
import glob from 'glob';
import merge from 'lodash.merge';
import normalize from './normalize';
import fromString from './fromString';

/**
 * default options
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

  /**
   * file encoding
   * @type {String|Null}
   */
  encoding: 'utf8',

  /**
   * Handlrbars instance
   * @type {HandlebarsEnvironment}
   */
  handlebars: null,

  /**
   * out verbose log
   * @type {Boolean}
   */
  verbose: false
};

/**
 * parse data from files.
 * + handlebars template written inside is reevaluated with data itself
 * @param {String} pattern glob pattern
 * @param {Object} context template context
 * @param {DEFAULT_OPTIONS} options options
 * @return {Object}
 *
 * @example
 * import {fromFiles} from '@hidoo/data-from';
 *
 * const data = fromFiles('/path/to/*.json5');
 */
export default function fromFiles(pattern = '', context = {}, options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};

  const {contents, data} = glob.sync(pattern)
    .map((path) => fs.readFileSync(path, opts.encoding))
    .map((content) => ({content: content, data: fromString(content, context, opts)}))
    .reduce((prev, current) => ({
      contents: [...prev.contents, current.content],
      data: merge(prev.data, current.data)
    }), {contents: [], data: {}});

  const newContext = merge(normalize(context), data);

  return contents
    .map((content) => fromString(content, newContext, opts))
    .reduce((prev, current) => merge(prev, current), {});
}

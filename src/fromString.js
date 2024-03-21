import Handlebars from 'handlebars';
import merge from 'lodash.merge';
import normalize from './normalize';
import parse from './parse';

/**
 * default options
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
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
 * parse data from string.
 * + handlebars template written inside is reevaluated with data itself
 *
 * @param {String} value value
 * @param {DEFAULT_OPTIONS} options options
 * @return {Object}
 *
 * @example
 * import {fromString} from '@hidoo/data-from';
 *
 * const data = fromString('{"test": {"hoge": "hoge", "fuga": "{{test.hoge}}');
 */
export default function fromString(value = '', options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options },
    { context, verbose } = opts,
    handlebars = opts.handlebars || Handlebars.create();

  if (typeof value === 'string') {
    const template = handlebars.compile(value),
      newContext = parse(template(normalize(context), { verbose }));

    return parse(template(merge(context, newContext)));
  }

  return {};
}

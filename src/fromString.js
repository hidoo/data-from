import Handlebars from 'handlebars';
import merge from 'lodash.merge';
import normalize from './normalize';
import parse from './parse';

/**
 * default options
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

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
 * parse data from string.
 * + handlebars template written inside is reevaluated with data itself
 * @param {String} value value
 * @param {Object} context template context
 * @param {DEFAULT_OPTIONS} options options
 * @return {Object}
 *
 * @example
 * import {fromString} from '@hidoo/data-from';
 *
 * const data = fromString('{"test": {"hoge": "hoge", "fuga": "{{test.hoge}}');
 */
export default function fromString(value = '', context = {}, options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options},
        handlebars = opts.handlebars || Handlebars.create();

  if (typeof value === 'string') {
    const template = handlebars.compile(value),
          newContext = parse(template(normalize(context), {verbose: opts.verbose}));

    return parse(template(merge(context, newContext)));
  }

  return {};
}

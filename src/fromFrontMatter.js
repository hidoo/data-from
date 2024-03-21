import frontMatter from 'front-matter';
import fromString from './fromString.js';

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
   * Handlebars instance
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
 * parse data from front matter.
 * + handlebars template written inside is reevaluated with data itself
 *
 * @param {String} value value
 * @param {DEFAULT_OPTIONS} options options
 * @return {Object}
 *
 * @example
 * import {fromFrontMatter} from '@hidoo/data-from';
 *
 * const data = fromFrontMatter('---\ntest:\n  hoge: hoge\n  fuga: "{{test.hoge}}"\n---\n');
 */
export default function fromFrontMatter(value = '', options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (typeof value === 'string') {
    if (frontMatter.test(value)) {
      const { body, frontmatter } = frontMatter(value);

      return { body, attributes: fromString(frontmatter, opts), frontmatter };
    }

    return { body: value, attributes: null, frontmatter: '' };
  }

  return { body: '', attributes: null, frontmatter: '' };
}

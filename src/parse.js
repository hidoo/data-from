import yaml from 'js-yaml';
import JSON5 from 'json5';
import normalize from './normalize.js';
import log from './log.js';

/**
 * default options
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  /**
   * out verbose log
   *
   * @type {Boolean}
   */
  verbose: false
};

/**
 * parse JSON, JSON5, and YAML
 *
 * @param {String} value value
 * @param {DEFAULT_OPTIONS} options options
 * @return {Object}
 *
 * @example
 * const parsed = parse(value, {verbose: true});
 */
export default function parse(value, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let result = {};

  if (typeof value === 'string') {
    // first try parse as JSON
    try {
      result = JSON.parse(value);
    } catch (JSONError) {
      log(JSONError, { verbose: opts.verbose });

      // next try parse as JSON5
      try {
        result = JSON5.parse(value);
      } catch (JSON5Error) {
        log(JSON5Error, { verbose: opts.verbose });

        // finaly try parse as YAML
        result = yaml.load(value);
      }
    }

    // return normalized object
    return normalize(result);
  }

  return result;
}

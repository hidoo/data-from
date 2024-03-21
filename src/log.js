/**
 * logger
 *
 * @param  {Any} value print value
 * @param {Object} options options
 * @return {void}
 * @example
 * log(value, {verbose: true});
 */
export default function log(value, options) {
  const opts = { verbose: false, ...options };

  if (!console || typeof console.error !== 'function') {
    return;
  }
  if (!opts.verbose) {
    return;
  }

  if (value instanceof Error) {
    console.error(value);
  } else {
    console.log(value);
  }
}

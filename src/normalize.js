/**
 * normalize value
 * + it return wrapped to object, if argument "value" is string or number.
 * + it return empty object, if argument "value" is falsy.
 *
 * @param {Any} value value
 * @return {Object}
 *
 * @example
 * const normalized = normalize(value);
 */
export default function normalize(value = {}) {
  if (!value) {
    return {};
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return { [value]: value };
  }
  return value;
}

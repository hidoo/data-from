import fromFiles from './fromFiles.js';
import fromFrontMatter from './fromFrontMatter.js';
import fromString from './fromString.js';

export { fromFiles };
export { fromFrontMatter };
export { fromString };

const defaultExports = {
  fromFiles,
  fromFrontMatter,
  fromString
};

export default defaultExports;

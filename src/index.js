import fromFiles from './fromFiles';
import fromFrontMatter from './fromFrontMatter';
import fromString from './fromString';

export { fromFiles };
export { fromFrontMatter };
export { fromString };

const defaultExports = {
  fromFiles,
  fromFrontMatter,
  fromString
};

export default defaultExports;

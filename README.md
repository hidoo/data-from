# @hidoo/data-from

[![Status](https://github.com/hidoo/data-from/workflows/Main%20workflow/badge.svg)](https://github.com/hidoo/data-from/actions?query=branch%3Amaster)

> A utility library that get data from JSON, JSON5, and YAML.

## Installation

```sh
$ npm install @hidoo/data-from
```

## Usage

from string:

```js
import {fromString} from '@hidoo/data-from';

const data = fromString('{"test": {"hoge": "hoge", "fuga": "{{test.hoge}}');
// {test: {hoge: 'hoge', fuga: 'hoge'}}
```

from Front Matter (wrapper of [front-matter](https://www.npmjs.com/package/front-matter)):

```js
import {fromFrontMatter} from '@hidoo/data-from';

const data = fromFrontMatter('---\ntest:\n  hoge: hoge\n  fuga: "{{test.hoge}}"\n---\n');
// {body: '', attributes: {test: {hoge: 'hoge', fuga: 'hoge'}}, frontmatter: 'test:\n  hoge: hoge\n  fuga: "{{test.hoge}}"'}
```

from files (glob pattern):

```json5
// data.json5
{
  data: {
    hoge: 'hoge',
    fuga: '{{validJSON5.hoge}}'
  }
}
```

```js
import {fromFiles} from '@hidoo/data-from';

const data = fromFiles('/path/to/*.json5');
// {data: {hoge: 'hoge', fuga: 'hoge'}}
```

## Test

```sh
$ npm test
```

## License

MIT

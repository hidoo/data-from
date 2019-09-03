# @hidoo/data-from

[![Build Status](https://travis-ci.org/hidoo/data-from.svg?branch=master)](https://travis-ci.org/hidoo/data-from)

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

# @hidoo/data-from

[![Test](https://github.com/hidoo/data-from/actions/workflows/test.yml/badge.svg)](https://github.com/hidoo/data-from/actions/workflows/test.yml)

> Utility to get data from JSON, JSON5, and YAML.

## Installation

```sh
npm install @hidoo/data-from
```

## Usage

Get data from a string:

```js
import { fromString } from '@hidoo/data-from';

const data = fromString('{"test": {"hoge": "hoge", "fuga": "{{test.hoge}}');
// {test: {hoge: 'hoge', fuga: 'hoge'}}
```

Get data from Front Matter (wrapper of [front-matter](https://www.npmjs.com/package/front-matter)):

```js
import { fromFrontMatter } from '@hidoo/data-from';

const data = fromFrontMatter(
  `---
test:
  hoge: hoge
  fuga: "{{test.hoge}}"
---
`
);
// {body: '', attributes: {test: {hoge: 'hoge', fuga: 'hoge'}}, frontmatter: 'test:\n  hoge: hoge\n  fuga: "{{test.hoge}}"'}
```

Get data from files matched specified glob pattern:

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
import { fromFiles, fromFilesSync } from '@hidoo/data-from';

const data = await fromFiles('/path/to/*.json5');
// {data: {hoge: 'hoge', fuga: 'hoge'}}

// By synchronously
const data = fromFilesSync('/path/to/*.json5');
```

## Test

```sh
pnpm test
```

## License

MIT

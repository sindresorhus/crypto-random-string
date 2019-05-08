# crypto-random-string [![Build Status](https://travis-ci.org/sindresorhus/crypto-random-string.svg?branch=master)](https://travis-ci.org/sindresorhus/crypto-random-string)

> Generate a [cryptographically strong](https://en.wikipedia.org/wiki/Strong_cryptography) random string

Can be useful for creating an identifier, slug, salt, fixture, etc.


## Install

```
$ npm install crypto-random-string
```


## Usage

```js
const cryptoRandomString = require('crypto-random-string');

cryptoRandomString({length: 10});
//=> '2cf05d94db'

cryptoRandomString({length: 10, type: 'base64'});
//=> 'YMiMbaQl6I'

cryptoRandomString({length: 10, type: 'url-safe'});
//=> 'YN-tqc8pOw'

cryptoRandomString({length: 10, characters: '1234567890'});
//=> '1791935639'
```


## API

### cryptoRandomString(options)

Returns a randomized string. [Hex](https://en.wikipedia.org/wiki/Hexadecimal) by default.

#### options

Type: `object`

##### length

*Required*<br>
Type: `number`

Length of the returned string.

##### type

Type: `string`<br>
Default: `'hex'`<br>
Values: `'hex'` `'base64'` `'url-safe'`

Use only characters from a predefined set of allowed characters.

Cannot be set at the same time as the `characters` option.

##### characters

Type: `string`<br>
Minimum length: `1`<br>
Maximum length: `65536`

Use only characters from a custom set of allowed characters.

Cannot be set at the same time as the `type` option.


## Related

- [random-int](https://github.com/sindresorhus/random-int) - Generate a random integer
- [random-float](https://github.com/sindresorhus/random-float) - Generate a random float
- [random-item](https://github.com/sindresorhus/random-item) - Get a random item from an array
- [random-boolean](https://github.com/arthurvr/random-boolean) - Get a random boolean
- [random-obj-key](https://github.com/sindresorhus/random-obj-key) - Get a random key from an object
- [random-obj-prop](https://github.com/sindresorhus/random-obj-prop) - Get a random property from an object
- [unique-random](https://github.com/sindresorhus/unique-random) - Generate random numbers that are consecutively unique


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)

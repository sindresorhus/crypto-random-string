# crypto-random-string [![Build Status](https://travis-ci.org/sindresorhus/crypto-random-string.svg?branch=master)](https://travis-ci.org/sindresorhus/crypto-random-string)

> Generate a [cryptographically strong](https://en.m.wikipedia.org/wiki/Strong_cryptography) random string

Can be useful for creating an identifier, slug, salt, fixture, etc.


## Install

```
$ npm install crypto-random-string
```


## Usage

```js
const cryptoRandomString = require('crypto-random-string');

cryptoRandomString(10);
//=> '2cf05d94db'

cryptoRandomString(10, {type: 'hex'});
//=> 'c00f094c79'

cryptoRandomString(10, {type: 'base64'});
//=> 'YMiMbaQl6I'

cryptoRandomString(10, {type: 'url-safe'});
//=> 'YN-tqc8pOw'

cryptoRandomString(10, {characters: '1234567890'});
//=> '1791935639'
```


## API

### cryptoRandomString(length, [options])

Returns a randomized string. [`hex`](https://en.wikipedia.org/wiki/Hexadecimal) by default.

#### length

Type: `number`

Length of the returned string.

#### options

Type: `object`

##### type

Type: `string`
Values: `hex` `base64` `url-safe`

Setting this option makes it select characters from relevant set. Can not be set at the same time as `characters`

##### characters

Type: `string`

Setting this option makes it select characters from the string. Can not be set at the same time as `type`. Minimum length 1, maximum length 65536.


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

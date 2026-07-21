# crypto-random-string

> Generate a [cryptographically strong](https://en.wikipedia.org/wiki/Strong_cryptography) random string

Can be useful for creating an identifier, slug, salt, PIN code, fixture, etc.

Works in Node.js and browsers.

## Install

```sh
npm install crypto-random-string
```

## Usage

```js
import cryptoRandomString from 'crypto-random-string';

cryptoRandomString({length: 10});
//=> '2cf05d94db'

cryptoRandomString({length: 10, type: 'base64'});
//=> 'YMiMbaQl6I'

cryptoRandomString({length: 10, type: 'url-safe'});
//=> 'YN-tqc8pOw'

cryptoRandomString({length: 10, type: 'numeric'});
//=> '8314659141'

cryptoRandomString({length: 6, type: 'distinguishable'});
//=> 'CDEHKM'

cryptoRandomString({length: 10, type: 'ascii-printable'});
//=> '`#Rt8$IK>B'

cryptoRandomString({length: 10, type: 'alphanumeric'});
//=> 'DMuKL8YtE7'

cryptoRandomString({length: 10, characters: 'abc'});
//=> 'abaaccabac'
```

## API

### cryptoRandomString(options)

Returns a randomized string. [Hex](https://en.wikipedia.org/wiki/Hexadecimal) by default.

#### options

Type: `object`

##### length

*Required*\
Type: `number` *(non-negative integer)*

Length of the returned string.

This is the number of characters, so a string generated from a `characters` set with characters outside the [Basic Multilingual Plane](https://en.wikipedia.org/wiki/Plane_(Unicode)#Basic_Multilingual_Plane), like emoji, has a larger `.length` than this.

##### type

Type: `string`\
Default: `'hex'`\
Values: `'hex' | 'base64' | 'url-safe' | 'numeric' | 'distinguishable' | 'ascii-printable' | 'alphanumeric'`

Use only characters from a predefined set of allowed characters.

Cannot be set at the same time as the `characters` option.

The `distinguishable` set contains only uppercase characters that are not easily confused: `CDEHKMPRTUWXY012458`. It can be useful if you need to print out a short string that you'd like users to read and type back in with minimal errors. For example, reading a code off of a screen that needs to be typed into a phone to connect two devices.

The `ascii-printable` set contains all [printable ASCII characters](https://en.wikipedia.org/wiki/ASCII#ASCII_printable_characters) except the space: ``!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~`` Useful for generating passwords where all possible ASCII characters should be used.

The `alphanumeric` set contains uppercase letters, lowercase letters, and digits: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`. Useful for generating [nonce](https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/nonce) values.

##### characters

Type: `string`\
Minimum length: `1`\
Maximum length: `65536`

Use only characters from a custom set of allowed characters.

Cannot be set at the same time as the `type` option.

Each character is picked with equal probability, so repeating a character in the set makes it more likely to be picked. The length limits count Unicode characters, not UTF-16 code units, so characters outside the [Basic Multilingual Plane](https://en.wikipedia.org/wiki/Plane_(Unicode)#Basic_Multilingual_Plane), like emoji, are handled correctly.

## Related

- [random-int](https://github.com/sindresorhus/random-int) - Generate a random integer
- [random-float](https://github.com/sindresorhus/random-float) - Generate a random float
- [random-item](https://github.com/sindresorhus/random-item) - Get a random item from an array
- [random-boolean](https://github.com/arthurvr/random-boolean) - Get a random boolean
- [random-object-key](https://github.com/sindresorhus/random-object-key) - Get a random key from an object
- [random-object-value](https://github.com/sindresorhus/random-object-value) - Get a random value from an object
- [unique-random](https://github.com/sindresorhus/unique-random) - Generate random numbers that are consecutively unique

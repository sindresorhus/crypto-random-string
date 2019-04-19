/**
Generate a [cryptographically strong](https://en.m.wikipedia.org/wiki/Strong_cryptography) random string.

@param length - Length of the returned string.
@param options.type - Setting this option makes it select characters from relevant set. Can not be set at the same time as `characters`.
@param options.characters - Setting this option makes it select characters from the string. Can not be set at the same time as `type`. Maximum length 65536.
@returns Returns a randomized string. [`hex`](https://en.wikipedia.org/wiki/Hexadecimal) by default.

@example
```
import cryptoRandomString = require('crypto-random-string');

cryptoRandomString(10);
//=> '2cf05d94db'
```
*/
declare function cryptoRandomString(length: number, opts?: {type?: 'hex' | 'base64' | 'url-safe', characters?: string}): string;

export = cryptoRandomString;

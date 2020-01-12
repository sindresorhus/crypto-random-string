import {MergeExclusive} from 'type-fest';

interface BaseOptions {
	/**
	Length of the returned string.
	*/
	length: number;
}

interface TypeOption {
	/**
	Use only characters from a predefined set of allowed characters.

	Cannot be set at the same time as the `characters` option.

	@default 'hex'

	@example
	```
	cryptoRandomString({length: 10});
	//=> '87fc70e2b9'

	cryptoRandomString({length: 10, type: 'base64'});
	//=> 'mhsX7xmIv/'

	cryptoRandomString({length: 10, type: 'url-safe'});
	//=> 'VEjfNW3Yej'

	cryptoRandomString({length: 10, type: 'numeric'});
	//=> '8314659141'
	```
	*/
	type?: 'hex' | 'base64' | 'url-safe' | 'numeric';
}

interface CharactersOption {
	/**
	Use only characters from a custom set of allowed characters.

	Cannot be set at the same time as the `type` option.

	Minimum length: `1`
	Maximum length: `65536`

	@example
	```
	cryptoRandomString({length: 10, characters: '0123456789'});
	//=> '8796225811'
	```
	*/
	characters?: string;
}

declare namespace cryptoRandomString {
	type Options = BaseOptions & MergeExclusive<TypeOption, CharactersOption>;
}

/**
Generate a [cryptographically strong](https://en.wikipedia.org/wiki/Strong_cryptography) random string.

@returns A randomized string.

@example
```
import cryptoRandomString = require('crypto-random-string');

cryptoRandomString({length: 10});
//=> '2cf05d94db'
```
*/
declare function cryptoRandomString(options?: cryptoRandomString.Options): string;

export = cryptoRandomString;

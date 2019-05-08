import {MergeExclusive} from 'type-fest';

declare namespace cryptoRandomString {
	interface TypeOptions {
		/**
		Use only characters from a predefined set of allowed characters.

		Cannot be set at the same time as the `characters` option.

		@default 'hex'

		@example
		```
		cryptoRandomString(10, {type:'hex'});
		//=> '87fc70e2b9'

		cryptoRandomString(10, {type:'base64'});
		//=> 'mhsX7xmIv/'

		cryptoRandomString(10, {type:'url-safe'});
		//=> 'VEjfNW3Yej'
		```
		*/
		type?: 'hex' | 'base64' | 'url-safe';
	}

	interface CharactersOptions {
		/**
		Use only characters from a custom set of allowed characters.

		Cannot be set at the same time as the `type` option.
		
		Minimum length: `1`
		Maximum length: `65536`

		@example
		```
		cryptoRandomString(10, {characters:'0123456789'});
		//=> '8796225811'
		```
		*/
		characters: string;
	}
	type Options = MergeExclusive<TypeOptions, CharactersOptions>;
}

/**
Generate a [cryptographically strong](https://en.wikipedia.org/wiki/Strong_cryptography) random string.

@param length - Length of the returned string.
@returns Returns a randomized string.

@example
```
import cryptoRandomString = require('crypto-random-string');

cryptoRandomString(10);
//=> '2cf05d94db'
```
*/
declare function cryptoRandomString(length: number, options?: cryptoRandomString.Options): string;

export = cryptoRandomString;

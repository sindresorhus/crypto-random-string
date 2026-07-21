import {type MergeExclusive} from 'type-fest';

type BaseOptions = {
	/**
	Length of the returned string.

	Must be a non-negative integer.

	This is the number of characters, so a string generated from a `characters` set with characters outside the [Basic Multilingual Plane](https://en.wikipedia.org/wiki/Plane_(Unicode)#Basic_Multilingual_Plane), like emoji, has a larger `.length` than this.
	*/
	length: number;
};

type TypeOption = {
	/**
	Use only characters from a predefined set of allowed characters.

	Cannot be set at the same time as the `characters` option.

	@default 'hex'

	The `distinguishable` set contains only uppercase characters that are not easily confused: `CDEHKMPRTUWXY012458`. It can be useful if you need to print out a short string that you'd like users to read and type back in with minimal errors. For example, reading a code off of a screen that needs to be typed into a phone to connect two devices.

	The `ascii-printable` set contains all [printable ASCII characters](https://en.wikipedia.org/wiki/ASCII#ASCII_printable_characters) except the space: ``!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~`` Useful for generating passwords where all possible ASCII characters should be used.

	The `alphanumeric` set contains uppercase letters, lowercase letters, and digits: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`. Useful for generating [nonce](https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/nonce) values.

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

	cryptoRandomString({length: 6, type: 'distinguishable'});
	//=> 'CDEHKM'

	cryptoRandomString({length: 10, type: 'ascii-printable'});
	//=> '`#Rt8$IK>B'

	cryptoRandomString({length: 10, type: 'alphanumeric'});
	//=> 'DMuKL8YtE7'
	```
	*/
	type?: 'hex' | 'base64' | 'url-safe' | 'numeric' | 'distinguishable' | 'ascii-printable' | 'alphanumeric';
};

type CharactersOption = {
	/**
	Use only characters from a custom set of allowed characters.

	Cannot be set at the same time as the `type` option.

	Each character is picked with equal probability, so repeating a character in the set makes it more likely to be picked. The length limits count Unicode characters, not UTF-16 code units, so characters outside the [Basic Multilingual Plane](https://en.wikipedia.org/wiki/Plane_(Unicode)#Basic_Multilingual_Plane), like emoji, are handled correctly.

	Minimum length: `1`
	Maximum length: `65536`

	@example
	```
	cryptoRandomString({length: 10, characters: '0123456789'});
	//=> '8796225811'
	```
	*/
	characters?: string;
};

export type Options = BaseOptions & MergeExclusive<TypeOption, CharactersOption>;

/**
Generate a [cryptographically strong](https://en.wikipedia.org/wiki/Strong_cryptography) random string.

@returns A randomized string.

@example
```
import cryptoRandomString from 'crypto-random-string';

cryptoRandomString({length: 10});
//=> '2cf05d94db'
```
*/
export default function cryptoRandomString(options: Options): string;

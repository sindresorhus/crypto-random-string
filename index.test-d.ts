import {expectType, expectError} from 'tsd';
import cryptoRandomString from './index.js';

expectType<string>(cryptoRandomString({length: 10}));
expectType<string>(cryptoRandomString({length: 10, type: 'url-safe'}));
expectType<string>(cryptoRandomString({length: 10, type: 'numeric'}));
expectType<string>(cryptoRandomString({length: 10, characters: '1234'}));
expectType<Promise<string>>(cryptoRandomString.async({length: 10}));

expectError(cryptoRandomString({type: 'url-safe'}));
expectError(cryptoRandomString({length: 10, type: 'url-safe', characters: '1234'}));
expectError(cryptoRandomString({type: 'numeric'}));
expectError(cryptoRandomString({length: 10, type: 'numeric', characters: '1234'}));

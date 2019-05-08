import {expectType, expectError} from 'tsd';
import cryptoRandomString = require('.');

expectType<string>(cryptoRandomString({length: 10}));
expectType<string>(cryptoRandomString({length: 10, type: 'url-safe'}));
expectType<string>(cryptoRandomString({length: 10, characters: '1234'}));

expectError(cryptoRandomString({type: 'url-safe'}));
expectError(cryptoRandomString({length: 10, type: 'url-safe', characters: '1234'}));

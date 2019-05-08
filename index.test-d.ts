import {expectType} from 'tsd';
import cryptoRandomString = require('.');

expectType<string>(cryptoRandomString(10));
expectType<string>(cryptoRandomString(10, {type: 'url-safe'}));
expectType<string>(cryptoRandomString(10, {characters: '1234'}));

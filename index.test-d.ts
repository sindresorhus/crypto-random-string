import {expectType} from 'tsd';
import cryptoRandomString = require('.');

expectType<string>(cryptoRandomString(10));

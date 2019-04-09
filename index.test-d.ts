import {expectType} from 'tsd';
import generate = require('.');

expectType<string>(generate(10));

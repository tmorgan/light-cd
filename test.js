var lightcd = require('./index.js');
var assert = require('assert');

assert(lightcd.testUrl('https://github.com/a-b.c/a-b.c.git') === 'a-b.c/a-b.c')
assert(lightcd.testUrl('git@github.com:a-b.c/a-b.c.git') === 'a-b.c/a-b.c')

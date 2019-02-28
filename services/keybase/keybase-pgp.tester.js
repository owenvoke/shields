'use strict'

const t = (module.exports = require('../tester').createServiceTester())
const label = 'PGP'

t.create('gets the keybase key of pxgamer')
  .get('/pxgamer.json?style=_shields_test')
  .expectJSON({
    name: label,
    value: '',
    color: 'blue',
  })

t.create('gets the keybase key an invalid user')
  .get('/does-not-exist.json?style=_shields_test')
  .expectJSON({
    name: label,
    value: 'no',
    color: 'red',
  })


'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./firebase-backend.cjs.production.min.js')
} else {
  module.exports = require('./firebase-backend.cjs.development.js')
}
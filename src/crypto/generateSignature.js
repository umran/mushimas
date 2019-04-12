const crypto = require('crypto')

module.exports = schemas => {
  return crypto.createHash('sha256')
    .update(JSON.stringify(schemas))
    .digest('hex')
}
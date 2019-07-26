const crypto = require('crypto')
const simplencrypt = require('simplencrypt')

export const pass = crypto.scryptSync(simplencrypt.getKey(), simplencrypt.getSalt(), 32)

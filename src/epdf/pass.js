const crypto = require('crypto')

/* global EPDF_PSK, EPDF_PSK_SALT */

export const pass = crypto.scryptSync(EPDF_PSK, EPDF_PSK_SALT, 32)

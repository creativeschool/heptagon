import crypto from 'crypto'
import simplencrypt from 'simplencrypt'

export const pass = crypto.scryptSync(simplencrypt.getKey(), simplencrypt.getSalt(), 32)

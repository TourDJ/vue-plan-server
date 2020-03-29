const jwt = require('jsonwebtoken')
const secret = "Jfx1!@Dgx3#"

export function generateToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: 60 * 60 })
}

export function parseToken(token) {
  return jwt.verity(token, secret)
}
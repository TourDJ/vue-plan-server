//Json Web Token generate and verity tools
const jwt = require('jsonwebtoken')

//Secret is a string, buffer, or object containing either 
//the secret for HMAC algorithms or the PEM encoded private 
//key for RSA and ECDSA. 
//In case of a private key with passphrase an object 
//{ key, passphrase } can be used in this case be sure you 
//pass the algorithm option.
const secret = "Jfx1!@Dgx3#"

// options:
//    algorithm (default: HS256)
//    expiresIn: expressed in seconds or a string describing a time span zeit/ms.
//               Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as 
//               a seconds count. If you use a string be sure you provide the time 
//               units (days, hours, etc), otherwise milliseconds unit is used by 
//               default ("120" is equal to "120ms").
//    notBefore: expressed in seconds or a string describing a time span zeit/ms.
//               Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as 
//               a seconds count. If you use a string be sure you provide the time 
//               units (days, hours, etc), otherwise milliseconds unit is used by 
//               default ("120" is equal to "120ms").
//    audience
//    issuer
//    jwtid
//    subject
//    noTimestamp
//    header
//    keyid
//    mutatePayload: if true, the sign function will modify the payload object directly. 
//                   This is useful if you need a raw reference to the payload after 
//                   claims have been applied to it but before it has been encoded into 
//                   a token.
// 
//  There are no default values for expiresIn, notBefore, audience, subject, issuer. 
//  These claims can also be provided in the payload directly with exp, nbf, aud, sub 
//  and iss respectively, but you can't include in both places.
const options = {
  expiresIn: 30 * 60
}

//Signing a token with expiration.
//
//If a callback is supplied, it's asynchronous and the 
//callback is called with the err or the JWT, otherwise
//it's synchronous and returns the JsonWebToken as string.
//
//Payload could be an object literal, buffer or string 
//representing valid JSON.
//
export function generateToken(payload, callback) {
  return jwt.sign(payload, secret, options, callback)
}

//If a callback is supplied, function acts asynchronously.
//The callback is called with the decoded payload if the 
//signature is valid and optional expiration, audience, 
//or issuer are valid. If not, it will be called with the error.
//If a callback is not supplied, function acts synchronously. 
//Returns the payload decoded if the signature is valid and 
//optional expiration, audience, or issuer are valid. If not, 
//it will throw the error.
export function parseToken(token, callback) {
  return jwt.verify(token, secret, {}, callback)
}
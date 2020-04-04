const arangodb = require('../utils/arangodb')
import { vertex, statusCode, message } from '../utils/options'
import { parseToken } from '../utils/jwt'

module.exports = async (req, res, next) => {
  const { token } = req.query
  const { plan_user, plan_log } = vertex
  let result
  
  try {

    var decoded = parseToken(token)
    if (decoded) {
      if (decoded.mobile) {

      } else if (decoded.username) {
        
      }
    }

    const cursor = await arangodb.query(`
        FOR p IN ${plan_user} 
        FILTER p.userid==${id} and p.status==1 
        RETURN p
    `)

    const data = await cursor.next()

    result = res.json({
      statusCode: statusCode.STATUS_CODE_OK,
      msg: message.MESSAGE_SUCCESS,
      data: data
    })
  } catch (error) {
    console.log(error)
    
    result = res.json({
      statusCode: statusCode.STATUS_CODE_ERROR,
      msg: message.MESSAGE_EXCEPTION
    })
  }

  return result
}
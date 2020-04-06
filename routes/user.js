const arangodb = require('../utils/arangodb')
import { vertex, statusCode, message } from '../utils/options'
import { parseToken } from '../utils/jwt'

module.exports = async (req, res, next) => {
  const { token } = req.query
  const { plan_user, plan_log } = vertex
  let result, aql
  
  try {

    var decoded = parseToken(token)
    if (decoded) {
      if (decoded.mobile) {
        aql = `
          FOR p IN ${plan_user} 
            FILTER p.mobile == '${decoded.mobile}'
              and p.status == 1 
            RETURN p
        `
      } else if (decoded.username) {
        aql = `
          FOR p IN ${plan_user} 
            FILTER p.username == '${decoded.username}'
              and p.status==1 
            RETURN p
        `
      } else if (decoded.email) {
        aql = `
          FOR p IN ${plan_user} 
            FILTER p.email == '${decoded.email}'
              and p.status==1 
            RETURN p
        `
      }
    } else
      return res.json({status: statusCode.STATUS_CODE_ERROR, message: "操作失败，数据异常。"})

    const cursor = await arangodb.query(aql)
    const data = await cursor.next()
    if (data) {
      return res.json({
        status: statusCode.STATUS_CODE_OK, 
        message: message.MESSAGE_SUCCESS,
        result: data
      })
    } else
      return res.json({status: statusCode.STATUS_CODE_ERROR, message: "操作失败，数据异常。"})
  } catch (error) {
    return res.json({status: statusCode.STATUS_CODE_ERROR, message: e.message})
  }
}
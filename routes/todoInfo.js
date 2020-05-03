const arangodb = require('../utils/arangodb')
import { vertex, statusCode, message } from '../utils/options'

module.exports = async (req, res, next) => {
  const { user, date } = req.query
  const { plan_doing, plan_log } = vertex
  let result, aql
  
  try {
    if (!user || !date) {
      return res.json({status: statusCode.STATUS_CODE_ERROR, message: "操作失败，数据异常。"})
    }

    aql = `
      FOR d IN ${plan_doing}
        FILTER d.user == '${user}' and d.date == '${date}'
        and d.status == 1
        RETURN d
    `
    const cursor = await arangodb.query(aql)
    const data = await cursor.next()
    return res.json({
        status: statusCode.STATUS_CODE_OK, 
        message: message.MESSAGE_SUCCESS,
        result: data
      })
  } catch (error) {
    return res.json({status: statusCode.STATUS_CODE_ERROR, message: e.message})
  }
}
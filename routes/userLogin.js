const arangodb = require('../utils/arangodb')
import { doAction } from '../utils/arangoUtils'
import { datePlus } from '../utils/util'
import { vertex, statusCode, message } from '../utils/options'

module.exports = async (req, res, next) => {
  const { user } = req.body
  const { plan_user, plan_log } = vertex
  let mobileObj = {}, ret, result, data = {}

  try {
    // if(phone) {
    //   mobileObj.createTime = datePlus(Date.now(), 8)
    //   mobileObj.status = 1
    //   mobileObj.phone = phone
    //   mobileObj.captcha = generateRandom(1, 999999)
    // } else
    //   return res.json({status: 500, msg: "操作失败，数据异常。"})

    if(!plan_user || typeof plan_user !== "string")
      return res.json({status: 500, msg: "操作失败，数据库表不存在。"})

    let record = JSON.stringify(user)
    let aql = `
      INSERT ${record}
      INTO ${plan_user}
      RETURN NEW
    `
    result = await doAction(arangodb, plan_user, aql, null, null)

    try {
      ret = result._extra.stats.writesExecuted
    } catch (e) {
      ret = -1
    }

    //If add album successed, return it
    if(ret == 1) {
      data = result._documents && result._documents[0]
    } else
      return res.json({status: 500, msg: "操作失败，数据异常。"})

    return res.json({status: 200, msg: "ok", data: data})
  } catch (e) {
    return res.json({status: 500, msg: e.message})
  }
}
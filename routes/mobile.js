const arangodb = require('../utils/arangodb')
import { doAction } from '../utils/arangoUtils'
import { generateRandom, datePlus } from '../utils/util'
import { vertex, statusCode, message } from '../utils/options'

module.exports = async (req, res, next) => {
  const { phone } = req.body
  const { plan_mobile, plan_log } = vertex
  let mobile = {}, ret, result, data = {}

  try {
    if(phone) {
      mobile.createTime = datePlus(Date.now(), 8)
      mobile.status = 1
      mobile.phone = phone
      mobile.captcha = generateRandom(1, 999999)
    } else
      return res.json({status: 500, msg: "操作失败，数据异常。"})

    if(!plan_mobile || typeof plan_mobile !== "string")
      return res.json({status: 500, msg: "操作失败，数据库表不存在。"})

    let record = JSON.stringify(mobile)
    let aql = `
      INSERT ${record}
      INTO ${plan_mobile}
      RETURN NEW
    `
    result = await doAction(arangodb, plan_mobile, aql, null, null)

    try {
      ret = result._extra.stats.writesExecuted
    } catch (e) {
      ret = -1
    }

    //If add album successed, return it
    if(ret == 1) {
      data = result._documents && result._documents[0].captcha
    } else
      return res.json({status: 500, msg: "操作失败，数据异常。"})

    return res.json({status: 200, msg: "ok", data: data})
  } catch (e) {
    return res.json({status: 500, msg: e.message})
  }
}
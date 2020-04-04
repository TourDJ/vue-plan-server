const arangodb = require('../utils/arangodb')
import { doAction } from '../utils/arangoUtils'
import { datePlus, isEmpty } from '../utils/util'
import { vertex, statusCode, message } from '../utils/options'
import { generateToken } from '../utils/jwt'

function baseInfo(user) {
  user.create_time = datePlus(Date.now(), 8)
  user.status = 1
}

async function loginWithMobile(plan_mobile, plan_user, user) {
  let cursor, 
      token,
      interval = 5,
      data,
      result

  //First check the captcha is correct
  cursor = await arangodb.query(`
      FOR p IN ${plan_mobile}
        FILTER p.captcha == '${user.captcha}'
          AND p.phone == '${user.mobile}'
          AND DATE_NOW() <= p.create_time + ${interval} * 60 * 1000
        AND p.status == 1
        RETURN p          
      `, 
      {}, 
      {count: true}
    )
  
  //Mobile login success
  if(cursor.count == 1) {
    
    cursor = await arangodb.query(`
      FOR p IN ${plan_user} 
        FILTER p.mobile == '${user.mobile}'
          and p.status == 1 
        RETURN p
    `)

    result = await cursor.next()
    if (!result) {
      user.username = ''
      user.email = ''
      user.password = ''
      user.nickname = user.mobile
      let record = JSON.stringify(user),
          aql = `
            INSERT ${record}
            INTO ${plan_user}
            RETURN NEW
          `
      data = await doAction(arangodb, plan_user, aql, null, null)
      if (data && data._extra.stats.writesExecuted == 1)
        result = data._documents && data._documents[0]
    }
  }

  if (result) {

    //Generate access token with mobile
    token = generateToken(user)

    result.token = token

  } else {
    result = {status: 500, message: "登陆失败。"}
  }

  return result
}

module.exports = async (req, res, next) => {
  const { user } = req.body
  const { plan_user, plan_mobile, plan_log } = vertex
  let result = {}, cursor
  
  try {
    if(isEmpty(user))
      return res.json({status: 500, message: "操作失败，数据异常。"})

    if(!plan_user || typeof plan_user !== "string")
      return res.json({status: 500, message: "操作失败，数据库表不存在。"})
      
    baseInfo(user)
    
    if (user.mobile) {
      //Mobile login
      result = await loginWithMobile(plan_mobile, plan_user, user)

    } else if (user.username) {
      //Username or email login
      cursor = await arangodb.query(`
          FOR p IN ${plan_user} 
          FILTER p.username == ${user.username} and p.status == 1 
          RETURN p
      `)

    }

    if (result.status == 500) {
      return res.json({status: 500, message: "操作失败，登陆异常。"})
    } else {
      return res.json({status: 200, message: "登陆成功", result: result})
    }
    
  } catch (e) {
    return res.json({status: 500, message: e.message})
  }
}
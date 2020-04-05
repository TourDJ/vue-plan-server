const arangodb = require('../utils/arangodb')
import { doAction } from '../utils/arangoUtils'
import { datePlus, isEmpty } from '../utils/util'
import { vertex, statusCode, message } from '../utils/options'
import { generateToken } from '../utils/jwt'

function mountBaseInfo(user) {
  user.create_time = datePlus(Date.now(), 8)
  user.update_time = user.create_time
  user.status = 1
  user.nickname = user.mobile
  user.username = ""
  user.role = {
    permissions: [
      {
        permission: "dashboard"
      }
    ]
  }
}

module.exports = async (req, res, next) => {
  const { user } = req.body
  const { plan_user, plan_mobile, plan_log } = vertex
  let result = {}, cursor, token

  try {
    if(isEmpty(user))
      return res.json({
          status: statusCode.STATUS_CODE_ERROR, 
          message: message.MESSAGE_DATA_EXCEPTION
        })

    if(!plan_user || typeof plan_user !== "string")
      return res.json({
          status: statusCode.STATUS_CODE_ERROR, 
          message: message.MESSAGE_TABLE_NOT_EXISTS
        })

    //Check email if exists
    cursor = await arangodb.query(`
      FOR p IN ${plan_user}
        FILTER p.email == '${user.email}'
        AND p.status == 1
        RETURN p          
      `, 
      {}, 
      {count: true}
    )
    if(cursor.count == 1) {
      return res.json({
          status: statusCode.STATUS_CODE_ERROR, 
          message: message.MESSAGE_EMAIL_EXISTS
        })
    }

    //Check mobile if exists
    cursor = await arangodb.query(`
      FOR p IN ${plan_user}
        FILTER p.mobile == '${user.mobile}'
        AND p.status == 1
        RETURN p          
      `, 
      {}, 
      {count: true}
    )
    if(cursor.count == 1) {
      return res.json({
          status: statusCode.STATUS_CODE_ERROR, 
          message: message.MESSAGE_MOBILE_EXISTS
        })
    }

    mountBaseInfo(user)

    let record = JSON.stringify(user),
        aql = `
          INSERT ${record}
          INTO ${plan_user}
          RETURN NEW
        `
    
    let data = await doAction(arangodb, plan_user, aql, null, null)
    if (data && data._extra.stats.writesExecuted == 1) {
      result = data._documents && data._documents[0]

      //Generate access token with mobile
      token = generateToken(user)
      result.token = token
    } else
      return res.json({
          status: statusCode.STATUS_CODE_ERROR, 
          message: message.MESSAGE_REGISTER_FAILURE
        })
    
    return res.json({
      status: statusCode.STATUS_CODE_OK,
      message: message.MESSAGE_REGISTER_SUCCESS,
      result: result
    })
  } catch (e) {
    console.log(e.message)
    return res.json({
        status: statusCode.STATUS_CODE_ERROR, 
        message: message.MESSAGE_REGISTER_FAILURE
      })
  }
}
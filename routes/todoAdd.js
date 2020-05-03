const arangodb = require('../utils/arangodb')
import { doAction } from '../utils/arangoUtils'
import { isEmpty, datePlus } from '../utils/util'
import { vertex, statusCode, message } from '../utils/options'

module.exports = async (req, res, next) => {
  const todo = req.body
  const { plan_doing, plan_log } = vertex
  let result = {}, cursor, doing, aql, records

  try {
    if(isEmpty(todo) || !todo.date || !todo.user)
      return res.json({
          status: statusCode.STATUS_CODE_ERROR, 
          message: message.MESSAGE_DATA_EXCEPTION
        })

    if(!plan_doing || typeof plan_doing !== "string")
      return res.json({
          status: statusCode.STATUS_CODE_ERROR, 
          message: message.MESSAGE_TABLE_NOT_EXISTS
        })

    //Check if have the current date's todos of the user
    cursor = await arangodb.query(`
      FOR d IN ${plan_doing}
        FILTER d.user == '${todo.user}' and d.date == '${todo.date}'
        and d.status == 1
        RETURN d        
      `
    )
    doing = await cursor.next()
    if(doing) {
      todo.update_time = datePlus(Date.now(), 0)
      records = JSON.stringify(todo)
      aql = `
        FOR d IN ${plan_doing}
          FILTER d.user == '${todo.user}' and d.date == '${todo.date}'
          and d.status == 1
        UPDATE d WITH ${records} IN ${plan_doing} 
        RETURN NEW
      `
    } else {
      todo.create_time = datePlus(Date.now(), 0)
      todo.update_time = datePlus(Date.now(), 0)
      todo.status = 1
      records = JSON.stringify(todo)
      aql = `
          INSERT ${records}
          INTO ${plan_doing}
          RETURN NEW
        `
    }
    
    let data = await doAction(arangodb, plan_doing, aql, null, null)
    if (data && data._extra.stats.writesExecuted == 1) {
      result = data._documents && data._documents[0]
    } else {
      return res.json({
          status: statusCode.STATUS_CODE_ERROR, 
          message: message.MESSAGE_FAILURE
        })
    }
 
    return res.json({
      status: statusCode.STATUS_CODE_OK,
      message: message.MESSAGE_SUCCESS,
      result: result
    })
  } catch (e) {
    console.log(e.message)
    return res.json({
        status: statusCode.STATUS_CODE_ERROR, 
        message: message.MESSAGE_FAILURE
      })
  }
}
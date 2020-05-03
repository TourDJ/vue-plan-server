// Base properties configuration
module.exports = {

  // Vertex represent database's entity table.
  vertex: {
    plan_user: "plan_user",
    plan_mobile: "plan_mobile",
    plan_log: "plan_log",
    plan_doing: "plan_doing"
  },

  // Http status code
  statusCode: {
    STATUS_CODE_OK: 200,
    STATUS_CODE_NOT_FOUND: 404,
    STATUS_CODE_ERROR: 500
  },

  // Process response message
  message: {
    MESSAGE_SUCCESS: "操作成功",
    MESSAGE_FAILURE: "操作失败",
    MESSAGE_EXCEPTION: "服务器异常",
    MESSAGE_DATA_EXCEPTION: "操作失败，数据异常",
    MESSAGE_TABLE_NOT_EXISTS: "操作失败，数据库表不存在",
    MESSAGE_REGISTER_SUCCESS: "注册成功",
    MESSAGE_REGISTER_FAILURE: "注册失败",
    MESSAGE_EMAIL_EXISTS: "邮箱已存在",
    MESSAGE_MOBILE_EXISTS: "手机已存在"
  }

}
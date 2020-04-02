// Base properties configuration
module.exports = {

  // Vertex represent database's entity table.
  vertex: {
    plan_user: "plan_user",
    plan_mobile: "plan_mobile",
    category: "display_category",
    plan_log: "plan_log"
  },

  statusCode: {
    STATUS_CODE_OK: 200,
    STATUS_CODE_NOT_FOUND: 404,
    STATUS_CODE_ERROR: 500
  },

  message: {
    MESSAGE_SUCCESS: "成功",
    MESSAGE_FAILURE: "失败",
    MESSAGE_EXCEPTION: "服务器异常"
  }

}
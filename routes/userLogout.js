module.exports = async (req, res, next) => {
  
  try {
    return res.json({status: 200, message: "登出成功", result: {}})
    
  } catch (e) {
    return res.json({status: 500, message: e.message})
  }
}
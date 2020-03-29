var fs = require("fs");
const dbconfig = JSON.parse(fs.readFileSync('./config/database.json'))

console.log(dbconfig)
var fs = require("fs")
var path = require('path')
import { Database } from "arangojs"

let dbFile = '../config/database.json',
  _config, 
  _username, 
  _password, 
  _host, 
  _port

parseDBArgs(dbFile)

const arangodb = new Database({
  url: generateDBUrl(_username, _password, _host, _port)
})
useDB(arangodb, _config["db"], _username, _password)

function parseDBArgs(dbfile) {
  //In project read file must uset full path.
  const filepath = path.join(__dirname, dbfile)
  _config = JSON.parse(fs.readFileSync(filepath))
  if (_config) {
    _username = _config.username
    _password = _config.password
    _host = _config.host
    _port = _config.port
  }
}

function generateDBUrl(username, password, host, port) {
  return "http://" + username + ":" + password + "@" + host + ":" + port
}

function useDB(db, dbName, username, password) {
  db.useDatabase(dbName)
  db.useBasicAuth(username, password)
}

module.exports = arangodb

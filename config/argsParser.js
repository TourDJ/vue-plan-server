import fs from 'fs'

const argv = {}

const getValue = (index, val) => {
  var value = val.substring(index + 1)
  return value == '' ? true : value
}

process.argv.forEach((val, index, array) => {
  if (val.substring(0, 2) == '--') {
    var equalIndex = val.indexOf('=')
    if (equalIndex < 0) 
      equalIndex = val.length
    argv[val.substring(2, equalIndex)] = getValue(equalIndex, val)
  }
})

const argsFile = JSON.parse(fs.readFileSync(argv.config 
                  || 'data/config/conf.json'))

module.exports = Object.assign(argsFile, argv)
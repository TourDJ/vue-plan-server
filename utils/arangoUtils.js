/**
* @arangodb
*/
export async function doAction(arangodb, vertex, aql, filter, upsert) {
  let result, params = {}

  if(!aql)
    return result

  params.aql = aql
  
  if(filter)
    params.filter = filter

  if(upsert)
    params.upsert = upsert

  let action = String(function (params) {
    // This code will be executed inside ArangoDB!
    const db = require('@arangodb').db
    let _aql, _filter, _upsert, args = {}

    if(params) {

      _aql = params.aql

      if(params.filter)
        _filter = params.filter

      if(params.upsert)
        _upsert = params.upsert
    }

    if(_filter) {
      for(let f in _filter) {
        args[f] = _filter[f]
      }
    }

    if(_upsert) {
      for(let u in _upsert) {
        args[u] = _upsert[u]
      }
    }

    return db._query(_aql, args)
  })

  result = await arangodb.executeTransaction(
    {write: vertex},
    action,
    {
      params
    }
  )

  return result
}
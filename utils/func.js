const fs = require('fs')
const path = require('path')
var request = require('request');
var Promise = require('promise');
const formidable = require('formidable');
const options = require('./options');

/**
 * 上传文件
 * @param req
 * @param res
 * @param fileName
 * @returns {Promise.<{}>}
 */
export async function uploadFile(req, res, fileName) {
  let fields, files, paths, result = {}, kind, dirPath, subdir;

  let upload = await new Promise(function (resolve, reject) {
    let form = new formidable.IncomingForm();
    form.encoding = 'utf8';
    form.hash = 'md5';
    form.uploadDir = "./tmp";
    form.keepExtensions = true;
    form.multiples = true;

    form.parse(req, function(err, fields, files) {
      if (err) return reject(err);

      if(isEmpty(fields))
        fields = req.query;
      resolve({fields, files});
    });
  });

  if(upload) {
    fields = upload.fields;
    if(!fields)
      fields = req.query

    if(fields){
      kind = fields["kind"];
      if(kind)
        subdir = options["album"][kind]

      if(!subdir) {
        //处理嵌套的上传路径，如a-b-c，则将创建文件夹/a/b/c
        if(kind.indexOf("-") >= 0) {
          paths = kind.split('-');
          subdir = "";
          paths.forEach(function(_path) {
            subdir += "/" + _path;
            dirPath = path.join(uploadPath, subdir);
            if(!fs.existsSync(dirPath)){//不存在就创建一个
              fs.mkdirSync(dirPath)
            }
          });
        } else
          subdir = "cover";
      }

      //处理正常情况的上传
      if(!dirPath) {
        dirPath = path.join(uploadPath, subdir);
        console.log(dirPath)
        if(!fs.existsSync(dirPath)){//不存在就创建一个
          fs.mkdirSync(dirPath)
        }
      }
    }

    if(upload.files) {
      files = upload.files[fileName];
      if(!files) {
        for(let f in upload.files) {
          files = upload.files[f];
        }
      }

      result = await parseFile(files, dirPath, subdir);

      if(!result)
        result = {};
    }
  }

  return result;
}

/**
 * 解析上传后的文件
 * @param files
 * @param dirPath
 * @param subdir
 * @returns {Promise.<*>}
 */
async function parseFile(files, dirPath, subdir) {
  let result, tempPath, fileName, realName,
      filePath;

  if(files) {
    if(files instanceof Array) {
      result = await Promise.all(files.map(async function (file) {
        return await parseFile(file, subdir);
      }));

      return result;
    } else {
      tempPath = files.path;

      if (tempPath) {
        fileName = path.basename(tempPath);
        realName = files.name;

        fs.renameSync(tempPath, path.resolve(dirPath, fileName));

        filePath = "/" + subdir + "/" + fileName;

        result = {
          realName: realName,
          filePath: filePath
        }
      }
    }
  }

  return result;
}

function isEmpty(obj) {
  if(!obj || !obj instanceof Object)
    return true

  for(var o in obj) {
    if (obj.hasOwnProperty(o))
      return false
  }

  return true
}

/**
 * options["imgPath"]["genealogy"]["donate"]["content"]
 * @param str
 * @returns {*}
 */
function resolveSplit(str) {
  let strs, len, obj, result;

  if(typeof str === "string") {
    if(str.indexOf(".") != -1) {
      strs = str.split(".");

      if(strs)
        len = strs.length;

      obj = options;
      for(let i = 0; i < len; i++) {
        obj = obj[strs[i]];
      }

      result = obj;
    } else {
      result = options[str];
    }
  }

  return result;
}

function notEmpty(str) {
  if(!str)
    str = "";

  return str;
}

function pageAQL(limit, count) {
  let aql = ''

  if((limit !== undefined && limit !== null)
    && (count !== undefined && count !== null)) {
    aql += ' LIMIT ' + limit + ', ' + count + ' '
  } else if((limit !== undefined && limit !== null)
    && (count === undefined || count === null)) {
    aql += ' LIMIT ' + limit + ' '
  }

  return aql
}

export function getOffset(page, count) {
  let offset = 0

  try {
    page = !!page ? parseInt(page) : 0
    count = !!count ? parseInt(count) : 20
    count = count < 0 ? 20 : count
  } catch (error) {
    page = 0
    count = 20
  }

  if(typeof page === "number" && typeof count === "number"){
    if(page <= 0)
      page = 1
    offset = (page - 1) * count
  }
  offset = offset < 0 ? 0 : offset

  return offset
}

export function formatMessage(message, args) {
  let len, str, result

  if(!message)
    return "";

  result = message;
  if(args && args instanceof Array) {
    len = args.length;
    for(let i = 0; i < len; i++) {
      str = '{' + (i + 1) + '}';
      if(result.indexOf(str) != -1) {
        result = result.replace(str, args[i]);
      }
    }
  }

  return result;
}

export function thirdRequest(url, method, data) {

  var promise = new Promise(function (resolve, reject) {

    if(method == 'GET') {
      request(
        { method: method
          , uri: url
          , json:true
        }, function (error, response, body) {
          if (error)
            reject(error)
          else {
            resolve(body)
          }
        });
    } else if(method == 'POST') {

      request.post({url: url, form: data}, function(err, httpResponse, body){
        if (err)
          reject(err)
        else {
          resolve(body)
        }
      });
    }

  });

  return promise;
}

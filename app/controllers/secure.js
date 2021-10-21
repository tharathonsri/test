const AES = require("crypto-js/aes");
const Utf8 = require("crypto-js/enc-utf8");
const CryptoJS = require("crypto-js");
const config = require("../../config/config");
const Logger = require('../lib/logger');
const uuid = require('uuid');

const allow_service = config.UTILITY_CONFIG.ALLOW_SERVICE || []
const encryptOptions = config.UTILITY_CONFIG.ENCRYPT || {}
const passphrase = encryptOptions.PASSPHRASE || 'mari-dev' 
const hashOptions = config.UTILITY_CONFIG.HASH || {}
const salt = hashOptions.SALT || 'mari-dev'

exports.generate = async function (req, res, next) {
  let result = {};
  let logger = new Logger(req, 'generate.main');
  logger.log_print.action = 'generate.main';
  logger.log_print.message = 'success';
  logger.log_print.request_id = uuid.v4();
  logger.log_print.level = logger.level.success

  try{
    let data = req.body
    for (const [key, value] of Object.entries(data)) {
      if(allow_service.includes(key)){
        switch(key){
          case "encrypt":
            result[key] = await encrypt(value, logger)
            break;
          case "decrypt":
            result[key] = await decrypt(value, logger)
            break;
          case "hashing":
            result[key] = await hashing(value, logger)
            break;
          case "masking":
            result[key] = await masking(value, logger)
            break;
          default:
            break;
        }
      }
    }
    logger.log();

    return res.json(result);
    
  } catch (e) {
    logger.log_print.level = logger.level.error;
    logger.log_print.message = 'error:' + e.message;
    logger.log_print.errorMessage = e.stack;
    logger.log();
  }

  return res.json(result);
}

async function encrypt(text,parentLogger) {
  let logger = new Logger({}, 'generate.encrypt', parentLogger);
  logger.log_print.action = 'generate.encrypt';
  logger.log_print.message = 'success';
  logger.log_print.request_id = parentLogger.log_print.request_id;
  logger.log_print.level = logger.level.success;

  let retVal = [];
  let allow_service = Array.isArray(text) ? text : [text]
  try{
    for(const key of allow_service){
      let encrtypedKey = AES.encrypt(key.toString(), passphrase).toString()
      retVal.push({text: key, value: encrtypedKey})
    }
    logger.log();
    return retVal;
    
  } catch (e) {
    logger.log_print.level = logger.level.error;
    logger.log_print.message = 'error:' + e.message;
    logger.log_print.errorMessage = e.stack;
    logger.log();
  }
  return retVal;
}

async function decrypt(text, parentLogger) {
  let logger = new Logger({}, 'generate.decrypt', parentLogger);
  logger.log_print.action = 'generate.decrypt';
  logger.log_print.message = 'success';
  logger.log_print.request_id = parentLogger.log_print.request_id;
  logger.log_print.level = logger.level.success;

  let retVal = [];
  let allow_service = Array.isArray(text) ? text : [text]
  try{
    for(const key of allow_service){
      let bytes = AES.decrypt(key, passphrase);
      let decrtypedKey = bytes.toString(Utf8);

      retVal.push({text: key, value: decrtypedKey})
    }
    logger.log();
    return retVal;
    
  } catch (e) {
    logger.log_print.level = logger.level.error;
    logger.log_print.message = 'error:' + e.message;
    logger.log_print.errorMessage = e.stack;
    logger.log();
  }

  return retVal;
}

async function hashing(text, parentLogger) {
  let logger = new Logger({}, 'generate.hashing', parentLogger);
  logger.log_print.action = 'generate.hashing';
  logger.log_print.message = 'success';
  logger.log_print.request_id = parentLogger.log_print.request_id;
  logger.log_print.level = logger.level.success;

  let retVal = [];
  let allow_service = Array.isArray(text) ? text : [text]
  try{
    for(const key of allow_service){
      let hashedKey = CryptoJS.SHA256(key+salt).toString(CryptoJS.enc.Hex);

      retVal.push({text: key, value: hashedKey})
    }
    logger.log();
    return retVal;
    
  } catch (e) {
    logger.log_print.level = logger.level.error;
    logger.log_print.message = 'error:' + e.message;
    logger.log_print.errorMessage = e.stack;
    logger.log();
  }

  return retVal;
}

async function masking(text, parentLogger) {
  let logger = new Logger({}, 'generate.masking', parentLogger);
  logger.log_print.action = 'generate.masking';
  logger.log_print.message = 'success';
  logger.log_print.request_id = parentLogger.log_print.request_id;
  logger.log_print.level = logger.level.success;

  let retVal = [];
  let allow_service = Array.isArray(text) ? text : [text]
  try{
    for(const key of allow_service){
      let maskedValue = "";
      let maskWord = ''
      let value = String(key)
      let maskLength = value.length - 6

      for (let i = 0; i < maskLength; i++) {
        maskWord += "x";
      }

      if (value && (value.length-6) > 0) {
        let last_idx = value.length - 3
        maskedValue =  value.replace(value.substring(3, last_idx), maskWord);
      } else{
        for (let i = 0; i < value.length; i++) {
          maskedValue += "x";
        }
      }

      retVal.push({text: key, value: maskedValue})
    }
    logger.log();
    return retVal;
    
  } catch (e) {
    logger.log_print.level = logger.level.error;
    logger.log_print.message = 'error:' + e.message;
    logger.log_print.errorMessage = e.stack;
    logger.log();
  }

  return retVal;
}
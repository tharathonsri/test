process.env.NODE_ENV = process.env.NODE_ENV || 'development';

let config = require('./env/' + process.env.NODE_ENV + '.js')

try{
    config.UTILITY_CONFIG = require('/usr/src/mari-api-utility/config.json')
}
catch{
    config.UTILITY_CONFIG = {}
}

module.exports = require('./env/' + process.env.NODE_ENV + '.js');

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require("./config");
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const os = require('os');
const basicAuth = require('express-basic-auth')
const authOptions = config.UTILITY_CONFIG.AUTHEN || {users: {'mari-dev':'mari-dev'}}
 

module.exports = function(db) {
  const app = express();

  if (config.debug) {
    app.use(morgan('dev'));
  }

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(cors());
  app.use(compression());

  app.use(basicAuth(authOptions))

  require('../app/routes/secure')(app);

  app.use('/public', express.static(`./public`));

  app.get('/health' , ( req , res , next ) => {
    res.send(`
          <strong>Status:</strong> UP<br>
          <strong>Host:</strong> ${os.hostname()}<br>
          <strong>Timestamp:</strong> ${new Date().toISOString()}
      `);
  });

  return app;
};

const secure = require("../controllers/secure")

module.exports = function(app) {
    app.route('/secure').post(secure.generate);
};  
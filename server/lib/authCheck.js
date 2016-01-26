var jwt = require('jsonwebtoken');
var config = require('./config.js');

module.exports = {
  isAuthenticated : function(req, res, next) {
    //decode and check the token
    jwt.verify(req.headers.authorization, config.jwt.secret, function(err, decoded) {
      if(decoded) {
        req.user = decoded;
        next();
      }else{
        res.json({notAuthenticated : true});
      }
    });
  }
};

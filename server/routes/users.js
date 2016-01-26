var express = require('express');
var router = express.Router();
var config = require('../lib/config.js');
var rdb = require("../lib/db.js");
var authCheck = require("../lib/authCheck.js");

var jwt = require('jsonwebtoken');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/create', function(req, res, next){
  //call the create user method of our db class
  rdb.createUser(req.body, function(err, result){
    if(err){
      //return 500 status code if error
      res.sendStatus(500)
      return;
    }
    //if the user exist send json to inform frontend
    if(result == "User exists") {
      res.json({success : false, reason : result});
    }else{
      res.json({success : true});
    }

  });
})

router.post('/login', function (req, res) {
  rdb.validate(req.body.email, req.body.password, function(err, result){

        //if there were any erros responde with 500 Internal error status code
        if(err) {
          res.sendStatus(500);
          return;
        }

        //if the user can not be found responde with 401 Unauthorized status code
        if(result.length == 0 || result.length > 1) {
          res.sendStatus(401);
          return;
        }

        //if everything is ok, save the user profile in the profile var
        var profile = result[0];

        //sign the token and send it as a response
        var token = jwt.sign(profile, config.jwt.secret, { expiresInMinutes: 60*5 });
        res.json({token: token});
  })
});



router.post('/securedRoute', authCheck.isAuthenticated, function(req, res, next) {
  console.log('send: ', {securedContent : "this is some secret content secured by jwt token on server side. Only authorized users can view this."});
  res.json({securedContent : "this is some secret content secured by jwt token on server side. Only authorized users can view this."});
})

module.exports = router;

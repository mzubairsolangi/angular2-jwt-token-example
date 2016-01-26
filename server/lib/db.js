var r = require('rethinkdb');
var config = require('./config.js');
var async = require('async');

var db = function db(){
    var parent = this;

    //this function will be called when the node.js instance is launced
    this.initDb = function(callback) {
      async.waterfall([
        //this function will connect to the database
        function connect(callback) {
          r.connect(config.rethinkdb, callback);
        },
        //this will create the database if it doesn't exist
        function createDatabase(connection, callback) {
          //Create the database if needed.
          r.dbList().contains(config.rethinkdb.db).do(function(containsDb) {
            return r.branch(
              containsDb,
              {created: 0},
              r.dbCreate(config.rethinkdb.db)
            );
          }).run(connection, function(err) {
            callback(err, connection);
          });
        }
      ], function(err, connection) {
        if(err) {
          console.error(err);
          process.exit(1);
          return;
        }
        //finally we keep a reference of our connection object
        parent.connection = connection;
        //creating the tables specified in the config file
        parent.createTables();
        callback(connection);
      });
    }

    //this function is called after the connection was made to the database and will create the tables specified in the config file
    this.createTables = function() {
      for(var i=0; i<config.rethinkdb.tables.length; i++) {
        parent.createTable(config.rethinkdb.tables[i]);
      }
    }

    this.createTable = function(tableName) {
      async.waterfall([
        //creates the specified table if it does't exist
        function createTable(callback) {
          //Create the table if needed.
          r.tableList().contains(tableName).do(function(containsTable) {
            return r.branch(
              containsTable,
              {created: 0},
              r.tableCreate(tableName)
            );
          }).run(parent.connection, function(err) {
            callback(err);
          });
        }
      ], function(err) {
        if(err) {
          console.error(err);
          process.exit(1);
          return;
        }
      });
    }
    this.createUser = function(userData, callback) {
      //check if user exists in database
      r.table("users").filter({
          "email": userData.email
      }).run(parent.connection, function(err, result) {

        if(err) {
          callback(err, result);
        }else{
          //after we get the response we convert it to array
          result.toArray(function(err, result){
            //if the user does not exist, insert it in db
            if(result.length == 0) {
              r.table("users").insert(userData).run(parent.connection, callback);
            }else{

              callback(null, "User exists");
            }

          });
        }
      });
    }
    
    this.validate = function(username, password, callback) {
      // this is the equivalent of SELECT * from users WHERE email = username AND passwprd = password
      r.table("users").filter({
          "email": username,
          "password": password
      }).run(parent.connection, function(err, result) {

        if(err) {
          callback(err, result);
        }else{
          //after we get the response we convert it to array
          result.toArray(callback);
        }
      });
    }

    if(db.caller != db.getInstance){
        throw new Error("This object cannot be instanciated");
    }
}

/* ************************************************************************
db CLASS DEFINITION
************************************************************************ */
db.instance = null;

/**
 * db getInstance definition
 * @return db class
 */
db.getInstance = function(){
    if(this.instance === null){
        this.instance = new db();
    }
    return this.instance;
}

module.exports = db.getInstance();

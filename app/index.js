var mysql = require("mysql");
var colors = require("colors");
var queries = require("./db_init_queries.json");

var host = 'localhost';
var port = 8889;
var username = 'root';
var password = 'root';
var db_name = 'lazytocook';

var connection = mysql.createConnection({
  host      : host,
  port		: port,
  user      : username,
  password  : password
});

var runQueries = function(connection, index) {
	if (index >= queries.length) {
		console.log("Closing connection.");
		connection.end();
		return;
	}
	console.log("Executing: "+queries[index].bold);
	connection.query(queries[index], function (err, results) {
	  if (err) throw err;
	  console.log("Done.".green);
	  runQueries(connection, index+1);
	});
} 

var createDatabase = function() {
	connection.query("CREATE DATABASE "+db_name+";", function (err, result) {
		if (err) {
			throw err;
		}
		console.log("Database created.".green);
		connection.query("USE "+db_name+";");
		runQueries(connection, 0);
		// connection.end();
	});
}

var dropExistingDatabase = function() {
	connection.query("DROP DATABASE IF EXISTS "+db_name+";", function(err, result) {
		if (err) {
			throw err;
		}
		createDatabase();
	});
}

connection.connect(function(err) {
  if (err) {
  	throw err;
  }
  console.log("Connected to MySQL!".green);
  dropExistingDatabase();
});


 
// connection.end();
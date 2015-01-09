express = require("express");
var app = express();
var router = express.Router();
var mysql = require('mysql')
var bodyparser = require('body-parser')

var constants = require("./constants")

app.use( bodyparser.json() ); 
app.use( bodyparser.urlencoded({ extended: false }) );

var connection = mysql.createConnection({
  host     : constants.host,
  user     : constants.user,
  password : constants.password
});

connection.query("SHOW DATABASES", function(err,rows,fields){
	if (err) throw err;
	console.log("Yo: " + fields[0]);	
});

// Add new user
app.post("/users", function(request, response){
	// If request is just an email address
	if( request.body.email ) {
		// Double-check to make sure user isn't already part of the database
		connection.query('SELECT * FROM sotu.users WHERE email = ?', request.body.email, function(err, rows, fields){
			if( rows.length == 0 ){
				// Looks like they aren't -- insert away!
				connection.query("INSERT IGNORE INTO sotu.users SET email = ?", request.body.email, function(err, result){
					if( err ) throw err;
					response.status(200).json("Added " + request.body.email);
				});
			}
			else {
				response.status(409).json("User already exists!");
			}
		});
	}
	
});

app.get("/users/:userid", function(request, response){
	connection.query("SELECT * FROM sotu.users WHERE userid = ?", request.params.userid, function(err, rows, fields){
		if( err ) throw err; 
		response.status(200).json(rows);
	});
});

app.get("/words", function(request, response){
    response.status(400).json("No word selected!"); 
});

app.get("/words/:word", function(request, response){
    if (request.params.word)
        response.status(200).json("Yay you did it right");
    else   
        response.status(400).json("No word selected!");    
});

app.use(express.static(__dirname + "/public"));


module.exports = app;

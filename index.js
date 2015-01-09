express = require("express");
var app = express();
var router = express.Router();
var mysql = require('mysql')
var constants = require("./constants")

var connection = mysql.createConnection({
  host     : constants.host,
  user     : constants.user,
  password : constants.password
});

connection.query("SHOW DATABASES", function(err,rows,fields){
	 if (err) throw err;
	console.log("Yo: " + fields[0]);	
});

app.put("/users/email/:email", function(request, response){
	connection.query("INSERT INTO sotu.users(email) values (?)", [request.params.email]);
	
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

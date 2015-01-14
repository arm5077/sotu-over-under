express = require("express");
var app = express();
var router = express.Router();
var mysql = require('mysql')
var bodyparser = require('body-parser')

app.use( bodyparser.json() ); 
app.use( bodyparser.urlencoded({ extended: false }) );


var connection = mysql.createConnection({
	host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT
});

console.log(process.env.database_user);

connection.query("SHOW DATABASES", function(err,rows,fields){
	if (err) throw err;
	console.log("Yo: " + fields[0]);	
});

// Add new user
app.post("/users", function(request, response){
	
	// Double-check to make sure user isn't already part of the database
	connection.query('SELECT * FROM sotu.users WHERE ( userid = ? AND userid != "" ) OR ( email = ? AND email != "") OR (facebookid = ? AND facebookid != "")', [request.body.userid, request.body.email, request.body.facebookid], function(err, rows, fields){
		if( err ) throw err;
		if( rows == "" ){
			// Looks like they aren't -- insert away!
			connection.query("INSERT INTO sotu.users SET userid = ?, email = ?, facebookid = ?", [request.body.userid, request.body.email,request.body.facebookid], function(err, result){
				if( err ) throw err;
				response.status(200).json("Added " + request.body.email);
			});
		}
		else {
			response.status(409).json("User already exists!");
		}
	});

	
});

// Get user information by userid (default)
app.get("/users/:userid", function(request, response){
	connection.query("SELECT * FROM sotu.users WHERE userid = ?", [request.params.userid], function(err, rows, fields){
		if( err ) throw err;
		if( !rows ) response.status(200).json("No user found"); 
		response.status(200).json(rows);
	});
});

// Get user information by user email or facebook id (query string)
app.get("/users", function(request, response){
	// email
	if( request.query.email ){
		connection.query("SELECT * FROM sotu.users WHERE email = ?", [request.query.email], function(err, rows, fields){
			if( err ) throw err; 
			response.status(200).json(rows);
		});
	}	
	
	//facebook
	else if( request.query.facebookid ){
		connection.query("SELECT * FROM sotu.users WHERE facebookid = ?", [request.query.facebookid], function(err, rows, fields){
			if( err ) throw err; 
			response.status(200).json(rows);
		});
	}
	
});



// Submit guess
app.post("/guesses", function(request, response){
	// Make sure they've included all the required fields
	if( request.body.userid && request.body.phrase && request.body.guess ) {
		connection.query("INSERT INTO sotu.guesses (userid, phrase, guess, date) values (?,?,?,?) ON DUPLICATE KEY UPDATE guess = ?", [request.body.userid,request.body.phrase,request.body.guess, getTimestamp(),request.body.guess ], function(err, rows, fields){
			if( err ) throw err; 
			response.status(200).json(rows);
		});
	}
	else {
		response.status(422).json("Missing userid, word or guess");
	}
});

// Get average guess for individual question
app.get("/guesses/average/", function(request, response){
	console.log(request.query);
	if( request.query.phrase ) {
		connection.query("SELECT phrase, AVG(guess) as average FROM sotu.guesses WHERE phrase = ?", [request.query.phrase], function(err, rows, fields){
			if( err ) throw err; 
			response.status(200).json(rows);
		});
	} 
	else {
		response.status(422).json("Missing the target phrase, bro!")
	}	
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

function getTimestamp(){
	var currentdate = new Date(); 
	return currentdate.getFullYear() + "-" 
		+ (currentdate.getMonth()+1) + "-" 
		+ currentdate.getDate() + " "  
		+ currentdate.getHours() + ":"  
		+ currentdate.getMinutes() + ":" 
		+ currentdate.getSeconds();
	
}

app.use(express.static(__dirname + "/public"));


module.exports = app;

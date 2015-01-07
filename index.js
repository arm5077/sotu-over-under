express = require("express");
var app = express();

app.get("/", function(request, response){
    response.status(400).json("No command given.");
});


app.get("/words/:word", function(request, response){
    if (!request.params.name)
        response.status(400).json("No name selected!");
});


module.exports = app;

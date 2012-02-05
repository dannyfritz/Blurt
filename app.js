
// Module dependencies.

var express = require("express")
	, routes = require("./routes")
	, io = require("socket.io")
	, mongoose = require("mongoose")

var app = module.exports = express.createServer();


// Mongoose

mongoose.connect("mongodb://localhost/blurt");
require("./models").defineModels(mongoose);


// Socket

io = io.listen(app);

io.configure(function(){
	io.set("log level", 2);
})

io.sockets.on("connection", function (socket) {
	var now = new Date();
	socket.broadcast.emit("userJoin", {date: now});

	socket.on("disconnect", function (data) {
		var now = new Date();
		socket.broadcast.emit("userLeft", {date: now})
	});

	socket.on("postMessage", function(data) {
		var now = new Date();
		console.log(data);
		data.message = data.message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		socket.broadcast.emit("newMessage", {
				message: data.message,
				user: data.user,
				date: now})
		socket.emit("newMessage", {
				message: data.message,
				user: data.user,
				date: now})
	});

});


// Configuration

app.configure(function(){
	app.set("views", __dirname + "/views");
	app.set("view engine", "jade");
	app.set("view options", { layout: false });
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + "/public"));
});

app.configure("development", function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
	app.set("view options", { layout: false, pretty: true });
});

app.configure("production", function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});


// Routes

app.get("/", routes.index);


// Start Server

app.listen(8889);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

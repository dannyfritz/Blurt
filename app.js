var express = require("express")
	, app = express()
	, http = require('http')
	, routes = require("./routes")
	, server = http.createServer(app)
	, mongoose = require("mongoose")
	, port = process.argv[2] ? process.argv[2] : 8892;

// Mongoose
mongoose.connect("mongodb://localhost/blurt");
require("./models").defineModels(mongoose);

// Socket
var io = require("socket.io").listen(server, { resource: '/Blurt/socket.io' });
var userCount = 0

// Start Server
server.listen(port)
//app.listen(port);

io.configure(function(){
	io.set("log level", 2);
})

io.sockets.on("connection", function (socket) {
	userCount += 1;
	var now = new Date();
	socket.broadcast.emit("userJoin", {date: now, count: userCount});
	socket.emit("init", {count: userCount});

	socket.on("disconnect", function (data) {
		userCount -= 1;
		var now = new Date();
		socket.broadcast.emit("userLeft", {date: now, count: userCount})
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

// Express
app.configure(function(){
	app.set("views", __dirname + "/views");
	app.set("view engine", "jade");
	app.set("view options", { layout: false });
	app.use(function(req, res, next) {
		console.log('%s %s', req.method, req.url);
		next();
	});
});

// Routes
app.get("/:base/", routes.index );

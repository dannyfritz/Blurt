var fs = require("fs")
	, formidable = require("formidable")
	, jade = require("jade")
	, fs = require('fs')
	, moment = require('moment')

var path = './template/home.jade';
var str = fs.readFileSync(path, 'utf8');
homeTemplate = jade.compile(str, { filename: path, pretty: false });

var path = './template/messages.jade';
var str = fs.readFileSync(path, 'utf8');
messageTemplate = jade.compile(str, { filename: path, pretty: false });

function home(response, request, mongoose) {
	var Message = mongoose.model('Message');
	var messageQuery = Message.find({});
	messageQuery.limit(15);
	messageQuery.desc('date');
	messageQuery.exec(function (err, messages) {
		var body = homeTemplate();

		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(body);
		response.end();
	})
}

function postMessage(response, request, mongoose) {
	var form = new formidable.IncomingForm();
	form.parse(request, function(error, fields, files) {
		var Message = mongoose.model('Message');
		if (fields.message) {
			var message1 = new Message({
					message: fields.message
							.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')});
		} else {
			var message1 = new Message({});
		}
		message1.save();

		response.writeHead(200, {"Content-Type": "text/html"});
		response.end();
	});
}

function getMessages(response,request, mongoose) {
	var Message = mongoose.model('Message');
	var messageQuery = Message.find({});
	messageQuery.limit(15);
	messageQuery.desc('date');
	messageQuery.exec(function (err, messages) {
		var body = messageTemplate({messages: messages, moment: moment});

		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(body);
		response.end();
	})
}

function clearMessages(response, request, mongoose) {
	var Message = mongoose.model('Message');
	var messageQuery = Message.remove({});
	messageQuery.exec(function (err, messages) {

		response.writeHead(200, {"Content-Type": "text/html"});
		response.end();
	});
}

function favicon(response, request, mongoose) {
	fs.readFile("./favicon.ico", "binary", function(error, file) {
		if(error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "image/ico"});
			response.write(file, "binary");
			response.end();
		}
	});
}

exports.home = home;
exports.postMessage = postMessage;
exports.getMessages = getMessages;
exports.clearMessages = clearMessages;
exports.favicon = favicon;
var server = require("./server");
var router = require("./router.js");
var requestHandlers = require("./requestHandlers");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blurt");
require('./model').defineModels(mongoose);

var handle = {};
handle["/"] = requestHandlers.home;
handle["/postMessage"] = requestHandlers.postMessage;
handle["/getMessages"] = requestHandlers.getMessages;
handle["/clearMessages"] = requestHandlers.clearMessages;
handle["/favicon.ico"] = requestHandlers.favicon;

server.start(router.route, handle, mongoose);

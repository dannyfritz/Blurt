var http = require("http");

function start(route, handle, mongoose) {
	function onRequest(request, response) {
		route(handle, response, request, mongoose);
	}

	http.createServer(onRequest).listen(8888);
	console.log("Server started.");
}

exports.start = start;
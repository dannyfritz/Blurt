var url = require("url");

var staticNode = require('node-static')
var staticServer = new staticNode.Server('./static', { cache: false });

function route(handle, response, request, mongoose) {
	var pathname = url.parse(request.url).pathname;
	console.log(pathname + " requested.");
	if (typeof handle[pathname] === 'function') {
		handle[pathname](response, request, mongoose);
	} else {
		staticServer.serve(request, response, function(err, result) {
			if (err) {
				response.writeHead(err.status, err.headers);
				response.write("404 Not found");
				response.end();
			}
		});
	}
}

exports.route = route
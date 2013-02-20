var socket;

setupSocket();
setInterval(updateTimes, 1000);

function updateHeader(count) {
	if (count <=1) {
		$("#header").html("Blurt!");
	}
	else {
		$("#header").html("Blurt! " + count + " people connected.");
	}
}

function enterMessageBox(event) {
	if(event.which == 13 && !event.shiftKey) {
		event.preventDefault();
		//$("#messageBox").blur();
		postMessage();
	}
};

function clickButton() {
	postMessage();
	$("#messageBox").focus();
}

function clearMessageBox() {
	$("#messageBox").val("");
}

function setupSocket() {
	socket = io.connect('', {
		resource: "Blurt/socket.io"
	});

	socket.on("log", function (data) {
		console.log("Log: ", data);
	});

	socket.on("newMessage", function (data) {
		console.log("New Message: ", data);
		getMessage(data.message, data.user, data.date);
	});

	socket.on("userJoin", function (data) {
		console.log("User Connected: ", data);
		getUserStatus(data.date, 0);
		updateHeader(data.count);
	});

	socket.on("userLeft", function (data) {
		console.log("User Left: ", data);
		getUserStatus(data.date, 1);
		updateHeader(data.count);
	});

	socket.on("init", function(data) {
		updateHeader(data.count);
		//initial messages
	})
}

function getUserDateString(user, date) {
	return user + " posted " + getRelativeTime(date);
}

function getUserJoinString(date) {
	return "A user joined " + getRelativeTime(date)
}

function getUserLeftString(date) {
	return "A user left " + getRelativeTime(date)
}

function getRelativeTime(date) {
	return moment(date).fromNow();
}

//status = 0 for connect, 1 for left
function getUserStatus(date, status) {
	console.log(date);
	var $dateLi = $("<li data-role=\"list-divider\"></li>");
	$dateLi.attr("date", date)

	if (status == 0 ) {
		$dateLi.addClass("userJoin","");
		$dateLi.html(getUserJoinString(date));
	}
	else if (status == 1) {
		$dateLi.addClass("userLeft","");
		$dateLi.html(getUserLeftString(date));
	}

	$("#messages").prepend($dateLi).trigger("create");
	$('#messages').listview("refresh");

	$dateLi.hide(0);
	$dateLi.fadeIn();
}

function getMessage(message, user, date) {
	/*
		<li data-role="list-divider">
			user posted date
		</li>
		<li><pre>
			message
		</pre></li>
	*/
	console.log(message, user, date);
	var $dateLi = $("<li class=\"userdate\" data-role=\"list-divider\"></li>");
	$dateLi.attr("date", date)
	$dateLi.attr("user", user)
	$dateLi.html(getUserDateString(user, date));
	var $messageLi = $("<li></li>");
	var $messageDiv = $("<div class=\"messages\"></div>")

	linkify($messageDiv, message);

	$messageLi.append($messageDiv);

	$("#messages").prepend($messageLi).trigger("create");
	$("#messages").prepend($dateLi).trigger("create");
	$('#messages').listview("refresh");

	$dateLi.hide(0);
	$messageLi.hide(0);
	$dateLi.fadeIn();
	$messageLi.fadeIn();

}

function postMessage() {
	var message = $("#messageBox").val();
	var user = $("#user").val();
	clearMessageBox();
	socket.emit("postMessage", { message: message, user: user });
}

function updateTimes() {
	$("#messages .userdate").attr("date", function(index, date) {
		var user = $(this).attr("user");
		$(this).html(getUserDateString(user, date));
	});
	$("#messages .userJoin").attr("date", function(index, date) {
		var user = $(this).attr("user");
		$(this).html(getUserJoinString(date));
	});
	$("#messages .userLeft").attr("date", function(index, date) {
		var user = $(this).attr("user");
		$(this).html(getUserLeftString(date));
	});
}

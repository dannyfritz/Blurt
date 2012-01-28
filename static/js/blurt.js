function updateMessages() {
	$.ajax( {
    type: "POST", url: "getMessages",
    success: function(data, textStatus) {
    	$('#Messages').empty();
    	$('#Messages').prepend(data).trigger('create');
  		$('#Messages').listview('refresh');
    }
  });
}

updateMessages();
setInterval(updateMessages, 2500);

function postMessage() {
	var message = $('#Form #Blurt').attr("value");
	$("#Form #Send").attr({ disabled:true, value:"Sending..." });
	$("#Form #Send").blur();
	$('#Form #Send').button('refresh');
	$.ajax( {
    type: "POST", url: "postMessage", data: "message=" + message,
    success: function(data, textStatus) {
      updateMessages();
      $("#Send").attr({ disabled:false, value:"Shout it!" });
      $('#Form #Blurt').attr({value: ""});
			$('#Form #Send').button('refresh');
    }
  });
	$("#Send").attr({ disabled:false, value:"Something went wrong. Try Again!" });
	$('#Form #Send').button('refresh');
	return false;
}

function defineModels(mongoose) {
	var Schema = mongoose.Schema;

	var messageSchema = new Schema({
	    message: { type: String, default: "" }
	  , name: {type: String, default: "anonymouse" }
	  , date: { type: Date, default: function() {return new Date()} }
	});

  mongoose.model("Message", messageSchema);

 //  var Message = mongoose.model("Message");

 //  var message1 = new Message({message: "SUCH AN awesom eDAY!"});
	// message1.save();

	// Message.find({}, function(err, doc) {
	// 	if (err)
	// 		console.log("No message found!");
	// 	for (var i in doc) {
	// 		console.log(doc[i].message);
	// 	}
	// });
}

exports.defineModels = defineModels;
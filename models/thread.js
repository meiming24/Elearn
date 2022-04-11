const mongoose = require('mongoose')
const User = require('../models/user')

const ThreadSchema = mongoose.Schema ({
    title: {
        type: String
    },
    username: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String
    },
    comments: [{
        username: {
            type: String
        },
        date: {
            type: Date
        },
        content: {
            type: String
        }
    }]
});

var Thread = module.exports = mongoose.model('Thread', ThreadSchema);

//Get all Threads
module.exports.getThreads = function(callback){
	Thread.find(callback);
}

//Get threads by id
module.exports.getThreadById = function(id, callback){
	Thread.findById(id, callback);
}

//Add comment
module.exports.addComment = function(info, callback){
    
	thread_id = info['thread_id'];
	comment_username = info['comment_username']
	comment_content = info['comment_content'];
    var dateCurrent = new Date();

	Thread.findByIdAndUpdate(
		thread_id,
		{$push:{"comments":{username: comment_username, date: dateCurrent, content: comment_content}}},
		{safe: true, upsert: true},
		callback
	);
}

//Add thread
module.exports.saveThread = function(newThread, callback){
    Thread.create(newThread);
    callback;
}

//Delete thread
module.exports.deleteThread = function(idThread, callback){
    Thread.findByIdAndRemove({_id: idThread}, callback);
}

//Edit thread
module.exports.updateThread = function(info, callback){
    
    thread_id = info['thread_id'];
    title = info['thread_title']
	content = info['thread_content'];
    username = info['username']
    var dateCurrent = new Date();

    Thread.findByIdAndUpdate(
        thread_id,
        {title: title, username: username, date: dateCurrent, content: content },
		callback
    );
}

var express = require('express');
var router = express.Router();
var User = require('../models/user')

const mongoose = require('mongoose')

var Thread = require('../models/thread');

//Fetch all threads
router.get('/', function(req, res, next) {
	Thread.getThreads(function(err, threads){
		if(err) throw err;
		res.render('threads/index' , { threads: threads });
	});
});

//Get one thread details
router.get('/:id/details', function(req, res, next) {
	Thread.getThreadById([req.params.id], function(err, title){
		if(err) throw err;
		res.render('threads/details', { thread: title });
	});
});

//Post Comment
router.post('/:id/details', function(req, res, next){
	
	info = []
	info['thread_id'] = req.body.threadId;
	info['comment_username'] =  req.user.username;
	info['comment_content'] = req.body.comment_content;

	console.log(info)

	Thread.addComment(info, function(err, comment){
		if(err) throw err;
		// console.log(comment);
	})

	req.flash('success_msg','Comment Added');
	res.redirect('/threads/'+ req.body.threadId + '/details');
});

router.get('/add', function(req, res, next) {
	res.render('threads/add');
});

//Add Thread 
router.post('/add', function(req, res, next){

	var title = req.body.title;
	var content = req.body.content;
	var username = req.user.username;
	var dateCurrent = new Date();

	errors = req.validationErrors();

	if(errors){
		res.render('/threads/add', {
			errors: errors
		});
	} else {
		
		var newThread = {
			title: title,
			username: username,
			date : dateCurrent,
			content: content
		}

		console.log(newThread);
		
		Thread.saveThread(newThread, function(err, thread){
			if(err) throw err;
		});

		req.flash('success_msg', 'Thread Added');
		res.redirect('/threads');
	}
});

router.post('/delete', function(req, res, next){
	let thread_Id = req.body.threadId;
	Thread.deleteThread(thread_Id, function(err, thread){
		if(err) throw err;
	});
	req.flash('success_msg', 'Thread Deleted');
	res.redirect('/threads');
});

router.get('/edit', function(req, res, next){
	res.render('threads/edit');
});

//edit post
router.post('/edit', function(req, res, next){
	
	info = []
	info['thread_id'] = req.body.threadId;
	info['username'] =  req.user.username;
	info['thread_title'] = req.body.thread_title;
	info['thread_content'] = req.body.thread_content;

	console.log(info);

	Thread.updateThread(info, function(err, thread){
		if(err) throw err;
	})

	req.flash('success_msg','Thread Edited');
	res.redirect('/threads')
});


module.exports = router;
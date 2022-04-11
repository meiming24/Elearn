var express = require('express');
var router = express.Router();

var Class = require('../models/class');

//Classes Page
router.get('/', function(req, res, next) {
	Class.getClasses(function(err, classes){
		if(err) throw err;
		res.render('classes/index', { classes: classes });
	}, 3);
});

// Class Details
router.get('/:id/details', function(req, res, next) {
	Class.getClassById([req.params.id],function(err, classname){
		if(err) throw err;
		res.render('classes/details', { class: classname });
	});
});

// Get Lessons
router.get('/:id/lessons', function(req, res, next) {
	Class.getClassById([req.params.id],function(err, classname){
		if(err) throw err;
		res.render('classes/lessons', { class: classname });
	});
});

// Get Lesson
router.get('/:id/lessons/:lesson_id', function(req, res, next) {
	Class.getClassById([req.params.id],function(err, classname){
		var lesson;
		if(err) throw err;
		for(i=0;i<classname.lessons.length;i++){
			if(classname.lessons[i].lesson_number == req.params.lesson_id){
				lesson = classname.lessons[i];
			}
		}
		res.render('classes/lesson', { class: classname,lesson: lesson });
	});
});

router.get('/add', function(req, res, next){
	res.render('classes/add');
});
//Create Classes
router.post('/add', function(req, res, next){
	var title = req.body.title;
	var description = req.body.description;
	var instructor = req.user.username;

	errors = req.validationErrors();

	if(errors){
		res.render('/classes/add', {
			errors: errors
		});
	} else {
		
		var newClass = {
			title: title,
			description: description,
			instructor: instructor
		}

		console.log(newClass);
		
		Class.saveClass(newClass, function(err, Class){
			if(err) throw err;
		});

		req.flash('success_msg', 'Class Added');
		res.redirect('/classes');
	}
});

module.exports = router;

"use strict";

const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const {BlogPosts} = require("./models");


BlogPosts.create("Hello World", "This is a test", "Freddy", "May 27, 2018");
BlogPosts.create("Cats", "The greatest pets ever", "Sir Paws-a-lot", "August 18, 2017");
BlogPosts.create("Summer Daze", "Living that lizard life", "Sunny Dee", "June 5, 2016");


router.get("/", (req, res) => {
	res.json(BlogPosts.get());
});



router.post("/", jsonParser, (req, res) => {
	const requiredContent = ["title", "content", "author", "publishDate"];

	requiredContent.forEach(field => {
		if (!(field in req.body)) {
			const errorMessage = `Missing ${field} in request body`;
			console.error(errorMessage);
			return res.status(400).send(errorMessage);
		}
	});

	const blogPost = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(blogPost);
});



router.delete("/:id", (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post ${req.params.id}`);
	res.status(204).end();
});



router.put("/:id", jsonParser, (req, res) => {
	const requiredContent = ["id", "title", "content", "author", "publishDate"];

	requiredContent.forEach(field => {
		if (!(field in req.body)) {
			const errorMessage = `Missing ${field} in request body`;
			console.error(errorMessage);
			return res.status(400).send(errorMessage);
		}
	});

	if (req.params.id !== req.body.id) {
		const errorMessage = `Request path id ${req.params.id} and request body id`
												`${req.body.id} must match`;
		console.error(errorMessage);
		return res.status(400).send(errorMessage);
	}

	console.log(`Updating shooping list item ${req.params.id}`);
	const updatedPost = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	});
	res.status(204).end();
});


module.exports = router;






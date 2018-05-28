"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const {app, runServer, closeServer} = require("../server");
const expect = chai.expect;

chai.use(chaiHttp);


describe("Blog posts", function() {

	before(function() {
		return runServer();
	});
	after(function() {
		return closeServer();
	});

	it("should list blog posts on GET", function() {
		return chai.request(app)
			.get("/blog-posts")
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a("array");

				expect(res.body.length).to.be.at.least(1);
				const expectedKeys = ["id", "title", "content", "author", "publishDate"];
				res.body.forEach(function(item) {
					expect(item).to.be.a("object");
					expect(item).to.include.keys(expectedKeys);
				});
			});
	});

	it("should create a blog post on POST", function() {
		const newPost = {
			title: "Squirrels",
			content: "Who runs the world? Squirrels",
			author: "Bushytail McGee",
			publishDate: "May 5"
		};
		return chai.request(app)
			.post("/blog-posts")
			.send(newPost)
			.then(function(res) {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.a("object");
				expect(res.body).to.include.keys("id", "title", "content", "author", "publishDate");
				expect(res.body.id).to.not.equal(null);
				expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.id}));
			});
	});

	it("should update blog post on PUT", function() {
		const sampleUpdateData = {
			title: "Squirrels",
			content: "Who runs the world? Squirrels",
			author: "Bushytail McGee",
			publishDate: "May 5"
		};
		return chai.request(app)
			.get("/blog-posts")
			.then(function(res) {
				sampleUpdateData.id = res.body[0].id;
				return chai.request(app)
					.put(`/blog-posts/${sampleUpdateData.id}`)
					.send(sampleUpdateData)
			})
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a("object");
				expect(res.body).to.deep.equal(sampleUpdateData);
			});
	});

	it("should delete post on DELETE", function() {
		return chai.request(app)
			.get("/blog-posts")
			.then(function(res) {
				return chai.request(app)
					.delete(`/blog-posts/${res.body[0].id}`);
			})
			.then(function(res) {
				expect(res).to.have.status(204);
			});
	});

});












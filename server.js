"use strict";

const express 	 = require("express");
const morgan 	 = require("morgan");
const blogRouter = require("./router");


const app = express();

app.use(morgan("common"));
app.use(express.static("public"));

app.use(express.json());


app.use("/blog-posts", blogRouter);



app.listen(8080, () => {
	console.log("Your app is listening on port 8080");
});
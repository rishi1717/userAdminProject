const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/userAdmin", (err) => {
	if (err) {
		console.log("error")
	} else console.log("connected")
})

const users = require("./user.model")

const blogs = require("./blog.model")

const admins = require("./admin.model")

const express = require("express")
const router = require("./router")
const path = require("path")
const session = require("express-session")
const connection = require("./model")
const { v4: uuidv4 } = require("uuid")

const app = express()

const port = process.env.port || 3001

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(
	session({
		secret: uuidv4(),
		resave: false,
		saveUninitialized: true,
	})
)

app.use((req, res, next) => {
	if (!req.user) {
		res.header(
			"Cache-Control",
			"private, no-cache, no-store, must-revalidate"
		)
		res.header("Expires", "-1")
		res.header("Pragma", "no-cache")
	}
	next()
})

app.use("/assets", express.static(path.join(__dirname, "assets")))

app.set("view engine", "ejs")

app.get("/admin/:err?", (req, res) => {
	res.render("admin", { error: req.params.err })
})

app.get("/:err?", (req, res) => {
	res.render("login", {error: req.params.err})
})

app.use("/route", router)

app.listen(port, (err) => {
	if (err) console.log(err.message)
	else console.log(`Listening on http://localhost:${port}`)
})

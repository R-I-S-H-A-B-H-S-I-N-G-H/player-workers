const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

dotenv.config({
	path: "./.env",
});

// connect to db
const database = process.env.DATABASE.replace(
	"<password>",
	process.env.DATABASE_PASSWORD,
).replace("<username>", process.env.DATABASE_USERNAME);

mongoose
	.connect(database)
	.then((res) => console.log("DB connection successfull"))
	.catch((err) => console.error("DB connection fail : ", err));

// start server
const port = process.env.PORT;

app.listen(port, () => {
	console.log(`Application live at port ${port}`);
});

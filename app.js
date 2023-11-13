const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const tagRoutes = require("./routes/TagRoute");

const app = express();

app.use(cors());
app.use(helmet());
app.use(
	express.json({
		limit: "15kb",
	}),
);

// Routes
app.use("/tag", tagRoutes);

// handle 404 routes
app.use("*", (req, res, next) => {});

module.exports = app;

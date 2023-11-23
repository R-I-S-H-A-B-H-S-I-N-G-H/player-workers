const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const tagRoutes = require("./routes/TagRoute");
const healthroute = require("./routes/HealthRoute");

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

// healthroute
app.use("/health", healthroute);

// handle 404 routes
app.use("*", (req, res, next) => {
	res.status(404).json("THIS API PATH IS NOT DEFINED");
});

module.exports = app;

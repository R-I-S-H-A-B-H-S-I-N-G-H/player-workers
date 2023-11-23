const express = require("express");
const router = express.Router();

router.get("", (req, res, next) => {
	res.status(200).json("SERVICE IS HEALTHY AS A HORSE");
});

module.exports = router;

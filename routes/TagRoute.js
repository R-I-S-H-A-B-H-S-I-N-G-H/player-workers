const express = require("express");
const { createTag, getTagByShortId } = require("../service/TagService");
const router = express.Router();

router.get("/:shortId", async (req, res, next) => {
	const { error, data } = await getTagByShortId(req.params.shortId);
	if (error) return res.status(500).json("ERROR GETTING TAG");
	res.status(200).json(data);
});

router.post("", async (req, res, next) => {
	const { error, data } = await createTag(req.body);
	if (error) return res.status(500).json("ERROR CREATING TAG");
	res.status(200).json(data);
});

module.exports = router;

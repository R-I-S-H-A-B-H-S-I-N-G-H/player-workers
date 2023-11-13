const express = require("express");
const {
	createTag,
	getTagByShortId,
	getTagList,
} = require("../service/TagService");
const router = express.Router();

router.get("/list", async (req, res, next) => {
	const size = req.query.size || 10;
	const page = req.query.page || 0;
	const { error, data } = await getTagList(size, page);
	if (error) return res.status(500).json("ERROR GETTING TAG");
	res.status(200).json(data);
});

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

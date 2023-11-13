const express = require("express");
const { createTag, getTagById } = require("../service/TagService");
const router = express.Router();

router.get("/:id", async (req, res, next) => {
	const { error, data } = await getTagById(req.params.id);
	if (error) return res.status(500).json("ERROR GETTING TAG");
	res.status(200).json(data);
});

router.post("", async (req, res, next) => {
	const { error, data } = await createTag(req.body);
	if (error) return res.status(500).json("ERROR CREATING TAG");
	res.status(200).json(data);
});

module.exports = router;

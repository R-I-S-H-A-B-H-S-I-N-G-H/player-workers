const express = require("express");
const { createTag, getTagById } = require("../service/TagService");
const router = express.Router();

router.get("/:id", getTagById);
router.post("", createTag);

module.exports = router;

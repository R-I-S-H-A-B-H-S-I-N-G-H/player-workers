const mongoose = require("mongoose");
const { generateShortId } = require("../utils/shortIdGenerator");

const TagSchema = new mongoose.Schema(
	{
		shortId: {
			type: String,
			unique: true,
			default: generateShortId(7),
		},
		tagConfig: {
			type: String,
			require: true,
		},
		playerConfig: {
			type: mongoose.Schema.Types.Mixed,
			require: true,
		},
	},
	{ timestamps: true },
);
const TAG = mongoose.model("TAG", TagSchema);
module.exports = TAG;

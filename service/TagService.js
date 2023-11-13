const { minify } = require("terser");
const TAG = require("../models/Tag");

exports.getTagById = async (id) => {
	try {
		const tag = await TAG.findById(id);
		return { data: tag };
	} catch (error) {
		console.error("TAG WITH ID DOES NOT EXIST", error);
		return { error: error };
	}
};

exports.getTagByShortId = async (shortId) => {
	try {
		const tag = await TAG.findOne({ shortId: shortId });
		return { data: tag };
	} catch (error) {
		console.error("TAG WITH ID DOES NOT EXIST", error);
		return { error: error };
	}
};

exports.createTag = async (props) => {
	try {
		const { id, config, name } = props;

		if (id) {
			// If an ID is provided, update the existing entry
			const tagConfig = await generateTagFromPlayerConfig(config);
			const updatedTag = await TAG.findByIdAndUpdate(
				id,
				{
					name: name,
					playerConfig: config,
					tagConfig: tagConfig,
				},
				{ new: true },
			); // { new: true } returns the updated document

			if (!updatedTag) {
				return { error: "Tag not found for the given ID" };
			}

			return { data: updatedTag };
		} else {
			// If no ID is provided, create a new entry
			const tagConfig = await generateTagFromPlayerConfig(config);
			const newTag = await TAG.create({
				name: name,
				playerConfig: config,
				tagConfig: tagConfig,
			});

			return { data: newTag };
		}
	} catch (error) {
		console.log(error);
		return {
			error: error.message || "An error occurred while processing the request",
		};
	}
};

exports.getTagsFromLastMins = async (_mins = 10) => {
	const curTime = new Date();
	const prevTime = curTime.setMinutes(curTime.getMinutes() - _mins);
	const tagList = await TAG.find({
		updatedAt: {
			$gte: prevTime,
		},
	}).select("_id");
	return tagList;
};

exports.getTagList = async (perPage, page) => {
	const tagList = await TAG.find()
		.select("name")
		.select("createdAt")
		.select("updatedAt")
		.select("shortId")
		.limit(perPage)
		.skip(perPage * page)
		.sort({ updatedAt: "desc" })
		.exec();
	return { data: tagList };
};

async function generateTagFromPlayerConfig(props) {
	const tagData = `(
        function TagData() {
        const Selector = "${props?.selector || ""}";
        const scriptTag = document.createElement("script");
        scriptTag.onload = loadPlayer;
        scriptTag.src = "${props.playerBuildUrl}/main.js";
        const adSlot = document.createElement("div");
        adSlot.id = "ADSLOT-" + Date.now();
        adSlot.className = "Adslot";
        if (!Selector || Selector === "") {
            document.body.appendChild(adSlot);
        } else {
            document.querySelectorAll(Selector)[0].parentNode.appendChild(adSlot);
        }

        adSlot.appendChild(scriptTag);
        function loadPlayer(params) {
            window.PLAYER_INFO.init(${JSON.stringify({
							...props.playerConfig,
						})}, adSlot.id, );
        }
})();`;
	const tagDataUglified = await minify(tagData, { module: true });
	return tagDataUglified.code;
}

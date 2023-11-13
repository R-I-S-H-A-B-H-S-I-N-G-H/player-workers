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

exports.createTag = async (props) => {
	try {
		const { config } = props;
		const tagConfig = await generateTagFromPlayerConfig(config);
		const tag = await TAG.create({
			playerConfig: config,
			tagConfig: tagConfig,
		});

		return { data: tag };
	} catch (error) {
		return { error: error };
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

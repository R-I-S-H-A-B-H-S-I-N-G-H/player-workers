const { minify } = require("terser");
const TAG = require("../models/Tag");

exports.getTagById = async (req, res, next) => {
	console.log("HERE");
	try {
		const { id } = req.params;
		const tag = await TAG.findById(id);
		res.status(200).json(tag);
	} catch (error) {
		console.error("TAG WITH ID DOES NOT EXIST", error);
		return res.status(500).json({ error: "TAG WITH ID DOES NOT EXIST" });
	}
};

exports.createTag = async (req, res, next) => {
	try {
		const { config } = req.body;
		const tagConfig = await generateTagFromPlayerConfig(config);
		const tag = await TAG.create({
			playerConfig: config,
			tagConfig: tagConfig,
		});

		console.log(tagConfig);
		res.status(200).json({ ...tag });
	} catch (error) {
		console.error("#ERROR CREATING TAG", error);
		return res.status(500).json({ error: "#ERROR CREATING TAG" });
	}
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

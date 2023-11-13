const schedule = require("node-schedule");
const { getTagsFromLastMins, getTagById } = require("../service/TagService");
const { uploadToS3 } = require("../Api/S3Api");

exports.pushTagToS3 = () =>
	schedule.scheduleJob("* */5 * * * *", async () => {
		const tagIdList = await getTagsFromLastMins(6);
		for (const _tagId of tagIdList) {
			const { id } = _tagId;
			const tag = await getTagById(id);
			const { shortId, tagConfig } = tag.data;
			const fileName = shortId + "/tag.js";
			const fileBody = tagConfig;
			const s3URL = await uploadToS3({ fileName, fileBody });
		}
	});

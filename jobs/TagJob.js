const schedule = require("node-schedule");
const { getTagsFromLastMins, getTagById } = require("../service/TagService");
const { uploadToS3 } = require("../Api/S3Api");

exports.pushTagToS3 = () =>
	schedule.scheduleJob("*/10 * * * * *", async () => {
		console.log("----TAG PUSH JOB----");
		const tagIdList = await getTagsFromLastMins(10);
		console.log(tagIdList);
		for (const _tagId of tagIdList) {
			const { id } = _tagId;
			const tag = await getTagById(id);
			const { shortId, tagConfig } = tag.data;
			const fileName = shortId + "/tag.js";
			const fileBody = tagConfig;
			const s3URL = await uploadToS3({ fileName, fileBody });
		}
	});

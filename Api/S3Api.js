const axios = require("axios");

exports.uploadToS3 = async (props) => {
	const BASE_URL = process.env.S3BASE_URL;
	console.log("S3 URL :: ", BASE_URL);
	const { fileBody, fileName } = props;
	try {
		const resp = await axios.post(BASE_URL + "/upload", {
			fileName: fileName,
			fileBody: fileBody,
		});
		const jsonResp = await resp.data;
		return jsonResp;
	} catch (error) {
		console.error(error);
		return;
	}
};

const axios = require("axios");
const schedule = require("node-schedule");

exports.keepServiceAlive = () =>
	schedule.scheduleJob("*/2 * * * * *", async () => {
		console.log("----PING JOB-----");
		const pingURL = process.env.PING_URL;
		const res = await axios.get(pingURL);
		console.log(res.data);
	});

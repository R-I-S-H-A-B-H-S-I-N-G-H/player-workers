const ShortUniqueId = require("short-unique-id");
exports.generateShortId = (length = 10) => {
	const uid = new ShortUniqueId({ length: length });
	return uid.rnd(); // p0ZoB1FwH6
};

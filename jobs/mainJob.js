const { keepServiceAlive } = require("./KeepingServiceAliveJob");
const { pushTagToS3 } = require("./TagJob");

pushTagToS3();
keepServiceAlive();

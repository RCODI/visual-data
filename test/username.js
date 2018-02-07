const util = require("../util");

const urls = require("../lists/GoldIronHack-Phase1");

console.log(urls.map(c => util.getUsernameLink(c, true)));

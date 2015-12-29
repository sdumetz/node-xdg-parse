//TEST FRAMEWORKS
var chai = require('chai');
chai.config.includeStack = true;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
//server.start(server.app);
global.expect = chai.expect;

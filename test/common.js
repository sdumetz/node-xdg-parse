'use strict';
//TEST FRAMEWORKS
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const chaiJestSnapshot = require("chai-jest-snapshot");

chai.config.includeStack = true;

chai.use(chaiAsPromised);
chai.use(chaiJestSnapshot);

global.expect = chai.expect;

before(function() {
  chaiJestSnapshot.resetSnapshotRegistry();
});
 
beforeEach(function() {
  chaiJestSnapshot.configureUsingMochaContext(this);
});

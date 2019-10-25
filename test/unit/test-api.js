/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

process.env["LDAP_URI"] = "ldaps://mockuser@mockdomain.com@mockldapdomain.com";
process.env["LDAP_PASSWORD"] = "mockldappassword";
const expect = require("chai").expect;
const nock = require("nock");
const mockery = require("mockery");
const httpMocks = require("node-mocks-http");

const mockLogger = {};
mockLogger.debug = mockLogger.info = mockLogger.error = mockLogger.warn =
  console.log;
mockLogger.init = () => {};

mockery.registerMock("kth-node-log", mockLogger);
mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false
});

const paths = require("../mocks/apipaths.json");
const api = nock("http://localhost:3001/api/pipeline/")
  .get("/_paths")
  .reply(200, paths)
  .get("/_checkAPIkey")
  .reply(200, {});

describe("Index page", function() {
  before(done => {
    require("../../server/api");
    setTimeout(() => {
      done();
    }, 500);
  });
});

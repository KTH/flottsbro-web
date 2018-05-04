"use strict";

const api = require("../api");
const co = require("co");
const log = require("kth-node-log");
const {
  safeGet
} = require("safe-utils");

module.exports = {
  getIndex: co.wrap(getIndex)
};

function* getIndex(req, res, next) {
  try {
    console.log(`--------> ${api}`)
    const paths = api.pipelineApi.paths;
    console.log(`Paths: ${paths}`);

    const client = api.pipelinapieApi.client;

    const resp = yield client.getAsync(
      client.resolve(paths.getLatestByClusterName.uri, {
        clusterName: "stage"
      }), {
        useCache: true
      }
    );

    res.render("sample/index", {
      debug: "debug" in req.query,
      data: resp.statusCode === 200 ?
        safeGet(() => {
          return resp.body.name;
        }) : "",
      error: resp.statusCode !== 200 ?
        safeGet(() => {
          return resp.body.message;
        }) : ""
    });
  } catch (err) {
    console.log("---------------------------------------------------------");
    log.error("Error in getIndex", {
      error: err
    });
    next(err);
    console.log("---------------------------------------------------------");
  }
}
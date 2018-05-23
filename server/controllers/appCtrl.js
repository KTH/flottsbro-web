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
    const client = api.pipelineApi.client;
    const paths = api.pipelineApi.paths;
    const deployments = yield client.getAsync(
      client.resolve(paths.getLatestByClusterName.uri, {
        clusterName: "active"
      }), {
        useCache: true
      }
    );

    console.log(deployments.body)
    res.render("index/index", {
      debug: "debug" in req.query,
      data: deployments.body,
      error: res.statusCode !== 200 ? "We are currently not able to show information about applications :(" : null
    });
  } catch (err) {
    log.error("Error in getIndex", {
      error: err
    });
    next(err);
  }
}
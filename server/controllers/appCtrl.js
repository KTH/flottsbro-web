"use strict";

const api = require("../api");
const co = require("co");
const log = require("kth-node-log");
const moment = require("moment");
const {
  safeGet
} = require("safe-utils");

module.exports = {
  getIndex: co.wrap(getIndex)
};

function getClusterName()  {
  if (process.env.DISPLAY_APPS_IN_CLUSTER) {
    return process.env.DISPLAY_APPS_IN_CLUSTER;
  }

  return "active";
}

function* getIndex(req, res, next) {
  try {
    const client = api.pipelineApi.client;
    const paths = api.pipelineApi.paths;
    const deployments = yield client.getAsync(
      client.resolve(paths.getLatestByClusterName.uri, {
        clusterName: getClusterName()
      }), {
        useCache: true
      }
    );

    console.log(deployments)
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
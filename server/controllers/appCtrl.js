"use strict";

const api = require("../api");
const co = require("co");
const log = require("kth-node-log");

function getClusterName() {
  if (process.env.DISPLAY_APPS_IN_CLUSTER) {
    return process.env.DISPLAY_APPS_IN_CLUSTER;
  }

  return "active";
}

function* getIndex(req, res, next) {
  try {
    const client = api.pipelineApi.client;
    const paths = api.pipelineApi.paths;
    const uri = client.resolve(paths.getLatestByClusterName.uri, {
      clusterName: getClusterName()
    });

    client.getAsync(uri).then(response => {
      if (response.statusCode == 200) {
        res.render("index/index", {
          debug: "debug" in req.query,
          data: response.body
        });
      } else {
        res.render("index/index", {
          debug: "debug" in req.query,
          error:
            "We are currently not able to show information about applications :("
        });
      }
    });
  } catch (err) {
    log.error("Unable to render deployments from the API.", {
      error: err
    });
    res.render("index/index", {
      debug: "debug" in req.query,
      error:
        "We are currently not able to show information about applications :("
    });
  }
}

module.exports = {
  getIndex: co.wrap(getIndex)
};

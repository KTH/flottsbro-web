"use strict";

const api = require("../api");
const co = require("co");
const log = require("kth-node-log");
const cache = require("@kth/in-memory-cache");

function getClusterName() {
  if (process.env.DISPLAY_APPS_IN_CLUSTER) {
    return process.env.DISPLAY_APPS_IN_CLUSTER;
  }

  return "reference";
}

function* getIndex(req, res, next) {
  try {
    const client = api.pipelineApi.client;
    const paths = api.pipelineApi.paths;
    const uri = client.resolve(paths.getLatestByClusterName.uri, {
      clusterName: getClusterName()
    });

    console.log(uri);

    client.getAsync(uri).then(response => {
      if (response.statusCode == 200) {
        res.render("index/index", {
          debug: "debug" in req.query,
          data: addImportanceAsLevel(response.body)
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

const addImportanceAsLevel = applications => {
  const apps = applications.map(function(application) {
    if (application.importance === "low") {
      application.importanceLevel = 3;
    } else if (application.importance === "high") {
      application.importanceLevel = 1;
    } else {
      application.importanceLevel = 2;
    }

    return application;
  });
  cache.add("index", apps, 10000);
  return apps;
};
module.exports = {
  getIndex: co.wrap(getIndex)
};

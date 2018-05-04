"use strict";
const BasicAPI = require("kth-node-api-call").BasicAPI;
const config = require("../configuration").server;
const redisClient = require("kth-node-redis");

module.exports.pipeline = new BasicAPI({
  hostname: config.pipelineApi,
  https: true,
  json: true,
  defaultTimeout: 5000,
  redis: {
    client: redisClient,
    prefix: "pipeline",
    expire: 3600
  }
});

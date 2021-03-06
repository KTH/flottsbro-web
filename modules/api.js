"use strict";

const cache = require("@kth/in-memory-cache");
const axios = require("axios");
const logger = require("./logger");

const CACHE_TTL = 30 * 1000; // 30 seconds

const getApplications = async () => {
  let result = [];
  let cachedResult = cache.get(getUri());
  if (cachedResult) {
    result = cachedResult;
    logger.log.debug(`Using cached json resonse for '${getUri()}'.`);
    return result;
  }

  try {
    logger.log.debug(`Calling api endpoint '${getUri()}'.`);
    const response = await axios.get(getUri(), {
      headers: {
        api_key: process.env.API_KEY,
      },
    });
    result = await response.data;
    cache.add(getUri(), result, CACHE_TTL);
  } catch (error) {
    logger.log.error(error);
  }

  return result;
};

/**
 * Gets the path to the api endpoint we are calling.
 */
const getUri = () => {
  const result = `${process.env.API_HOST}/api/pipeline/v1/latest/${process.env.DISPLAY_APPS_IN_CLUSTER}/`;
  logger.log.debug(`Path '${result}'.`);
  return result;
};

/**
 * Module exports
 */
module.exports = {
  getApplications: getApplications,
};

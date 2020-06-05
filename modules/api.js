"use strict";

const axios = require("axios");
const logger = require("./logger");

const getApplications = async () => {
  let result = "";

  try {
    logger.log.debug(`Calling ${getUri()}`);
    const response = await axios.get(getUri());
    result = await response.data;
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
  logger.log.debug(`Path  '${result}'.`);
  return result;
};

/**
 * Module exports
 */
module.exports = {
  getApplications: getApplications,
};

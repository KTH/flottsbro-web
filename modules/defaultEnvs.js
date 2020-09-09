const { log } = require("./logger");

/**
 * All process.env:s that if not set already will be used.
 * Example:
 * if (!PORTILLO_CLUSTER) {
 *   process.env.PORTILLO_CLUSTER = "active"
 * }
 *)
 */
const DEFAULTS = {
  LOG_LEVEL: "info",
  PORT: 3000,
  PREFIX_PATH: "/pipeline",
  API_HOST: "https://api.kth.se",
  APPINSIGHTS_INSTRUMENTATIONKEY: "",
  DISPLAY_APPS_IN_CLUSTER: "production",
};

/**
 * Set all of the DEFAULTS env:s that does not already have a value.
 *
 * @param {*} log Pass true to get information logged for missing envs that get a default value.
 */
const set = (logDefault = false) => {
  Object.keys(DEFAULTS).forEach(function (key) {
    if (!process.env[key]) {
      if (logDefault) {
        logUsingDefault(key, DEFAULTS[key]);
      }
      process.env[key] = DEFAULTS[key];
    }
  });
};

/**
 * Remove all process.envs that are found in DEFAULTS.
 */
const unset = () => {
  Object.keys(DEFAULTS).forEach(function (key) {
    delete process.env[key];
  });
};

/**

 * @param {*} env 
 * @param {*} defaultValue 
 */
const logUsingDefault = (env, defaultValue) => {
  log.info(` - '${env}' is not set, defaulting to '${defaultValue}'.`);
};

/**
 * Module exports
 */
module.exports = {
  set: set,
  unset: unset,
  DEFAULTS: DEFAULTS,
};

/**
 *
 *            Server specific settings
 *
 * *************************************************
 * * WARNING! Secrets should be read from env-vars *
 * *************************************************
 *
 */
const {
  getEnv,
  devDefaults,
  unpackRedisConfig,
  unpackNodeApiConfig
} = require("kth-node-configuration");
const {
  safeGet
} = require("safe-utils");

// DEFAULT SETTINGS used for dev, if you want to override these for you local environment, use env-vars in .env
const devPort = devDefaults(3000);
const devSsl = devDefaults(false);
const devUrl = devDefaults("http://localhost:" + devPort);
const devSessionKey = devDefaults("flottsbro-web.sid");
const devSessionUseRedis = devDefaults(true);
const devRedis = devDefaults("redis://localhost:6379/");
const devSsoBaseURL = devDefaults("https://login-r.referens.sys.kth.se");
// END DEFAULT SETTINGS

module.exports = {
  hostUrl: getEnv("SERVER_HOST_URL", devUrl),
  useSsl: safeGet(
    () => getEnv("SERVER_SSL", devSsl + "").toLowerCase() === "true"
  ),
  port: getEnv("SERVER_PORT", devPort),
  ssl: {
    // In development we don't have SSL feature enabled
    pfx: getEnv("SERVER_CERT_FILE", ""),
    passphrase: getEnv("SERVER_CERT_PASSPHRASE", "")
  },

  // API keys
  apiKey: {
    pipelineApi: getEnv("API_KEY", devDefaults("1234"))
  },

  // Authentication
  auth: {
    adminGroup: "app.pipeline.admin"
  },
  cas: {
    ssoBaseURL: getEnv("CAS_SSO_URI", devSsoBaseURL)
  },

  nodeApi: {
    pipelineApi: unpackNodeApiConfig(
      "API_URI",
      "http://localhost:3001/api/pipeline?defaultTimeout=10000",
    )
  },


  // Cortina
  blockApi: {
    blockUrl: getEnv('CM_HOST_URL', devDefaults('https://www-r.referens.sys.kth.se/cm/')), // Block API base URL
    headers: {
      'User-Agent': getEnv('CM_USER_AGENT', devDefaults('kth')) // Set User-Agent as an access token when fetching Cortina Blocks
    }
  },

  // Logging
  logging: {
    log: {
      level: getEnv("LOGGING_LEVEL", "debug")
    },
    accessLog: {
      useAccessLog: getEnv("LOGGING_ACCESS_LOG", false)
    }
  },
  clientLogging: {
    level: "warn"
  },

  cache: {
    cortinaBlock: {
      redis: unpackRedisConfig('REDIS_URI', devRedis)
    },
    pipelineApi: {
      redis: unpackRedisConfig('REDIS_URI', devRedis),
      expireTime: 60000
    }
  },

  // Session
  sessionSecret: getEnv("SESSION_SECRET", devDefaults("1234567890")),
  session: {
    key: getEnv("SESSION_KEY", devSessionKey),
    useRedis: safeGet(
      () => getEnv("SESSION_USE_REDIS", devSessionUseRedis) === "true"
    ),
    sessionOptions: {
      // do not set session secret here!!
      cookie: {
        secure: safeGet(() => getEnv("SESSION_SECURE_COOKIE", false) === "true")
      }
    },
    redisOptions: unpackRedisConfig("REDIS_URI", devRedis)
  }
};
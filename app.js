const express = require("express");
const os = require("os");
const { templates } = require("@kth/basic-html-templates");
const httpResponse = require("@kth/http-responses");
const about = require("./config/version");
const logger = require("./modules/logger");
const api = require("./modules/api");
const { page, table, description } = require("./modules/templates/");
const defaultEnvs = require("./modules/defaultEnvs");
const applicationInsights = require("./modules/applicationInsights");
const app = express();
const started = new Date();

/**
 * Set  default process.env:s that are not set on startu up.
 */
defaultEnvs.set(true);

/**
 * Start the server on configured port.
 */
app.listen(process.env.PORT, function () {
  logger.log.info(
    `Started '${about.dockerName}:${
      about.dockerVersion
    }' on '${os.hostname()}:${process.env.PORT}'`
  );
  applicationInsights.init();
});

/********************* routes **************************/

/**
 * Index page.
 */
app.get(`${process.env.PREFIX_PATH}/`, async function (request, response) {
  const apps = await api.getApplications();
  httpResponse.ok(
    request,
    response,
    templates.index(
      (title = "Incident response priorities"),
      (body = page.html(apps))
    )
  );
});

/**
 * Data page.
 */
app.get(`${process.env.PREFIX_PATH}/table`, async function (request, response) {
  const applications = await api.getApplications();
  httpResponse.ok(request, response, table.html(applications));
});

/**
 * Data page.
 */
app.get(`${process.env.PREFIX_PATH}/description`, async function (
  request,
  response
) {
  const applications = await api.getApplications();
  httpResponse.ok(request, response, description.html(applications));
});

/**
 * About page. Versions and such.
 */
app.get(`${process.env.PREFIX_PATH}/_about`, function (request, response) {
  httpResponse.ok(request, response, templates._about(about, started));
});

/**
 * Health check route.
 */
app.get(`${process.env.PREFIX_PATH}/_monitor`, function (request, response) {
  httpResponse.ok(
    request,
    response,
    templates._monitor((status = "OK")),
    httpResponse.contentTypes.PLAIN_TEXT
  );
});

/**
 * Crawler access definitions.
 */
app.get(`${process.env.PREFIX_PATH}/robots.txt`, function (request, response) {
  httpResponse.ok(
    request,
    response,
    templates.robotstxt(),
    httpResponse.contentTypes.PLAIN_TEXT
  );
});

/**
 * Ignore favicons.
 */
app.get(`${process.env.PREFIX_PATH}/favicon.ico`, function (request, response) {
  httpResponse.noContent(request, response);
});

app.use(express.static("public"));

/**
 * Default route, if no other route is matched (404 Not Found).
 */
app.use(function (request, response) {
  httpResponse.notFound(request, response, templates.error404());
});

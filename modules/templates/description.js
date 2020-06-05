const logger = require("../logger");
const api = require("../api");

const getTitle = (application) => {
  if (application.publicNameEnglish) {
    return `<h3>${application.publicNameEnglish} <span class="applicationName"> - ${application.applicationName}</span></h3>`;
  }
  return `<h3>${application.applicationName}</h3>`;
};

const getUrl = (application) => {
  if (application.applicationUrl) {
    return `<div class="applicationUrl"><a href="${application.applicationUrl}">${application.applicationUrl}</a></div>`;
  }
  return ``;
};

const getDescriptionEnglish = (application) => {
  if (application.descriptionEnglish) {
    return `
        <img src="https://app.kth.se/style/kth-style/img/kth-style/icons/en_UK.svg" />
        ${application.descriptionEnglish}
        `;
  }
  return ``;
};

const getDescriptionSwedish = (application) => {
  if (application.descriptionEnglish) {
    return `
        <img src="https://app.kth.se/style/kth-style/img/kth-style/icons/sv_SE.svg" />
        ${application.descriptionSwedish}
        `;
  }
  return ``;
};

const getLiDocumentationUrl = (application) => {
  if (application.publicApiDocumentationUrl) {
    return `
        <div class="publicApiDocumentationUrl"><a href="${application.publicApiDocumentationUrl}">API documentation</a></div>
        `;
  }
  if (application.publicUserDocumentationUrl) {
    return `
        <div class="publicApiDocumentationUrl"><a href="${application.publicApiDocumentationUrl}">API documentation</a></div>
        `;
  }
  return `<div class="publicUserDocumentationUrl"><a href="${application.publicUserDocumentationUrl}">User documentation</a></div>`;
};

const getLiImportance = (application) => {
  if (application.importance) {
    return `<li><strong>Incident response priority:</strong> <span title="Application importance: ${application.importance}" class="importance ${application.importance}"></span>
        ${application.importance}</li>`;
  }
  return "";
};

const getLiMonitor = (application) => {
  if (application.monitorUrl) {
    return `<li><strong>Monitor page:</strong> <a href="${application.monitorUrl}">${application.monitorUrl}</a> that should contain <strong>${application.monitorPattern}</strong> to be marked as up.`;
  }
  return "";
};

const getLi = (value, label) => {
  if (value) {
    return `<li><strong>${label}</strong> ${value}</li>`;
  }
  return "";
};

/**
 * Gets a full description of one application
 * @param {*} applications
 */

const getDescriptionBlock = (application) => {
  if (application) {
    return `
    
    <a name="${application.applicationName}"></a>

    <div class="application">
      
        ${getTitle(application)}
        ${getUrl(application)}
      
        <div class="row">
            <div class="col-sm">
                ${getDescriptionEnglish(application)}
            </div>
            <div class="col-sm">
                ${getDescriptionSwedish(application)}
            </div>
        </div>
    
        ${getLiDocumentationUrl(application)}
  
      <ul>
      
        <li><strong class="updated">Last updated:</strong> <span id="updated${
          application.applicationName
        }">${application.created}</span>
        <script>
          document.getElementById("updated${
            application.applicationName
          }").innerHTML = moment.unix(${application.created}).fromNow()
        </script></li>
        
        ${getLi(application.getPublicNameEnglish, "English name")}
        ${getLi(application.getPublicNameSwedish, "Svenskt namn")}
        ${getLi(application.aboutUrl, "About page")}
        ${getLiMonitor(application)}
        ${getLi(application.version, "Version")}
        ${getLiImportance(application)}
        ${getLi(application.team, "Responsible team")}
        ${getLi(application.cluster, "Running in")}
  
      </ul>
      <hr />
    </div>
    
    `;
  }
};

/**
 * Gets a full description of all applications.
 * @param {*} applications
 */
const html = (applications) => {
  let result = "";
  applications.forEach((application) => {
    result += getDescriptionBlock(application);
  });
  return result;
};

/**
 * Module exports
 */
module.exports = {
  html: html,
};

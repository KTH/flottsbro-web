const logger = require("../logger");
const api = require("../api");

const getImportanceAsInteger = (application) => {
  if (application.importance === "low") {
    return 3;
  } else if (application.importance === "high") {
    return 1;
  }
  return 2;
};

const getLink = (application) => {
  if (application.applicationUrl) {
    return `<a href="${application.applicationUrl}">${application.applicationUrl}</a>`;
  }
  return ``;
};

const getRows = (applications) => {
  let index = 0;
  let result = "";
  applications.forEach((application) => {
    index++;
    result += `
        <tr>
            <td><span title="Incident Response Priority: ${
              application.importance
            }" class="importance ${
      application.importance
    }"><span class="text">${getImportanceAsInteger(
      application
    )}</span></span></td>
            <td class="applicationName"><a href="#importance"></a>
                <a href="#${application.applicationName}">${
      application.friendlyName
    }</a>
            </td>
            <td class="path">${getLink(application)}</td>
            <td class="created"><span style="display: none">${
              application.created
            }</span><span id="created${index}">${
      application.created
    }</span></td>
            <td class="team">${application.team}</td>
        </tr>
        <script>document.getElementById("created${index}").innerHTML = moment.unix(${
      application.created
    }).fromNow()</script>
    `;
  });
  return result;
};

const html = (applications) => {
  return `
    <div id="tableWrapper">

    <div id="reload"></div>

    <table id="deployments">
        <thead>
            <tr>
                <th>Prio</th>
                <th>Application</th>
                <th>Url</th>
                <th>Deployed</th>
                <th>Responsible team: </th>
            </tr>
        </thead>
        <tbody>
            ${getRows(applications)}
        </tbody>
    </table>
    <script>
      const IMPORTANCE_COLUMN = 0;
      const CREATED_COLUM = 3;
      let sortOnColumn = CREATED_COLUM;
      let sortType = 'desc'

      const params = (new URL(document.location)).searchParams;
      const importance = params.get("importance");

      if (importance && importance === "high") {
        sortOnColumn = IMPORTANCE_COLUMN;
        sortType = 'asc'
      }

      $('#deployments').DataTable({
        paging: false,
        info: false,
        searching: false,
        order: [[sortOnColumn, sortType]],
      })

    </script>
    </div>
    `;
};

/**
 * Module exports
 */
module.exports = {
  html: html,
};

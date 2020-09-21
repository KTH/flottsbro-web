const logger = require("../logger");
const table = require("./table");
const description = require("./description");

const getLove = () => {
  return "";
  // if (process.env.DISPLAY_APPS_IN_CLUSTER != "production") {
  //   return "";
  // }

  // return `<div id="love">
  // <div id="tagline">Utveckling <span class="heart">❤️</span> Operations</div>

  // <p>Glad sommar vänner!</p>

  // </div>`;
};

const html = (applications) => {
  logger.log.debug(
    `Get index page showing ${applications.length} applications.`
  );
  return `

    <link href="/pipeline/css/kth-bootstrap.min.css" media="screen" rel="stylesheet">
    <script src="//code.jquery.com/jquery-1.11.3.js"></script>
    <script src="//momentjs.com/downloads/moment.min.js"></script>
    <script src="//cdn.datatables.net/1.10.21/js/jquery.dataTables.min.js"></script>
    <link rel="stylesheet" href="//cdn.datatables.net/1.10.21/css/jquery.dataTables.min.css">

    ${getLove()}

    <div class="row">
        <div class="col-4">
          <a href="https://www.kth.se/"><img width=76 height=76 src="/pipeline/img/kth-logotype.svg" alt="KTH Logotype"></a>
        </div>
        <div class="col-8">
          <h1>Incident response priorities</h1>
        </div>
    </div>


    <a name="importance"></a>
    <p id="lead">
        The coloured circles indicates how fast the Operations or Support team start working on the service incase of an outage.
        You can see each service classification bellow.

    <div class="row">
        <div class="col-sm">
            <span class="importance high"></span><strong>High</strong> <span class="alert-info-text">- Actively monitored by operations
            personal during office hours. Operations are on call until midnight. Action to bring back the service is
            normally taken <strong>within 15 minutes during office hours</strong>, and within one hour during On call hours.</span><br /><br />
        </div>
    <div class="col-sm">
          <span class="importance medium"></span><strong>Medium</strong> <span class="alert-info-text">- Actively monitored by operations
        personal during office hours. Action to bring back the service is normally <strong>within 2 hours</strong>. Outages outside
        office hours are handled the following workday morning.</span><br /><br />
    </div>
    <div class="col-sm">
      <span class="importance low"></span><strong>Low</strong> <span class="alert-info-text">- The service is normally back <strong>within a
        day</strong>.</span><br /><br />
    </div>
    
    </div>

      <div id="table">
        ${table.html(applications)}
      </div>

      <p class="applications-deployed">Applications deployed: <i>${
        applications.length
      }</i></p>

    ${description.html(applications)}


    <script>
    let ONE_MINUTE = 60 * 1000;
    let ONE_HOUR = ONE_MINUTE * 60;

    setInterval(function() {
      window.location.reload(true);
    }, ONE_HOUR);

   
    $(function () {

      if (!params.get("importance")) {
        setInterval(function() {
          
          fetch('/pipeline/table')
            .then(
              function(response) {
                if (response.status !== 200) {
                  console.log('Could not read url, got status code: ' +
                    response.status);
                  return;
                }

                response.text().then(function(data) {
                  console.log('Replacing table with new html ...')
                  $("#tableWrapper").remove();
                  $("#table").append(data);
                });
              }
            )
            .catch(function(err) {
              console.log('Error reading from url', err);
            });


        }, ONE_MINUTE);
      }
    })

  </script>

  <p>Read more about <a href="https://www.kth.se/it/tjansteutbud/beredskap-1.681065"> KTH´s on call policy (In
        Swedish)</a>.</p>



  `;
};

/**
 * Module exports
 */
module.exports = {
  html: html,
};

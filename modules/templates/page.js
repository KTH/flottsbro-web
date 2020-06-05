const logger = require("../logger");
const table = require("./table");
const description = require("./description");

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

    <h1>Incident response priorities for IT services</h1>

    <div class="lead">
        <p>These are the services, web and apis developed by IT-department at KTH.</p>
    </div>

    <a name="importance"></a>
    <p>
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
    <div aria-live="polite" role="alert" class="alert alert-info">
        <h2>Is something not working?</h2>

        <p>Have a look at our list of our <a href="https://www.kthstatus.se/">services status
        here</a> to see if they are working as intended. For more information about larger outages, please see the
        <a href="https://www.kth.se/en/gemensamt/driftsinformation-webbtjanster/ug-rss">IT-Support pages</a>.
        </p>
    </div>

    ${description.html(applications)}

    <p>Applications deployed: <i>${applications.length}</i></p>

    <script>
    $(function () {

      if (!params.get("importance")) {
        setInterval(function() {
          
          fetch('/table')
            .then(
              function(response) {
                if (response.status !== 200) {
                  console.log('Could not read url, got status code: ' +
                    response.status);
                  return;
                }

                response.text().then(function(data) {
                  console.log('Replacing table with new html ...')
                  $("#table").replaceWith(data + "<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr>");
                });
              }
            )
            .catch(function(err) {
              console.log('Error reading from url', err);
            });


        }, 15000);
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

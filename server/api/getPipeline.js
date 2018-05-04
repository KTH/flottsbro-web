const client = require("./client").pipeline;

module.exports = function(cluster) {
  let uri = "latest";

  if (cluster) {
    uri = `${uri}/${cluster}`;
  }

  return client.getAsync({ uri: cluster, useCache: false }).then(res => {
    if (!res.statusCode === 200 || res.body.error) {
      throw new Error(res.body.error);
    } else {
      const entries = res.body.entries || [];
      for (let i = 0; i < entries.length; i++) {
        if (entries[i]) {
          return {
            start: res.body.entries[i].start.split(" ")[0],
            type: res.body.entries[i].type_name.sv,
            url: res.body.entries[i].url,
            location: res.body.entries[i].locations[0]
          };
        }
      }
    }
  });
};

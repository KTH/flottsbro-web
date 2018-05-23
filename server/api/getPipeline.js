const client = require("./client").pipeline;

module.exports = function (cluster) {
  let uri = "latest";

  if (cluster) {
    uri = `${uri}/${cluster}`;
  }

  return client.getAsync({
    uri: uri,
    useCache: false
  }).then(res => {
    if (!res.statusCode === 200 || res.body.error) {
      throw new Error(res.body.error);
    } else {
      return res.body
    }
  });
};
import http from "http";

const port = process.env.PORT || 4000;

http
  .createServer(function (req, res) {
    res.write("I'm alive");
    res.end();
  })
  .listen(port);

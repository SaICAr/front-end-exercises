// index.js http://127.0.0.1:8000
const http = require("http");
const urllib = require("url");

const port = 8000;

http
  .createServer(function (req, res) {
    const { query } = urllib.parse(req.url, true);
    if (query && query.callback) {
      const { name, age, callback } = query;
      const person = `${name}今年${age}岁了!!!`;
      const str = `${callback}(${JSON.stringify(person)})`; //拼成callback(data)
      res.end(str);
    } else {
      res.end(JSON.stringify("没东西啊你"));
    }
  })
  .listen(port, function () {
    console.log("server is listening on port " + port);
  });

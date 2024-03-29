var express = require("express");
var app = express();

// enable CORS so that API is remotely testable by FCC (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// load static assets (./public/style.css) http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// Page routes http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});
app.get("/timestamp", (req, res) => {
  res.sendFile(__dirname + "/views/timestamp.html");
});
app.get("/parser", (req, res) => {
  res.sendFile(__dirname + "/views/parser.html");
});

// API endpoints
app.get("/timestamp/api/:date_string?", (req, res) => {
  let reqDate;
  if (typeof req.params.date_string == "undefined") {
    // if date_string is empty, return current datetime
    reqDate = new Date();
  } else if (/^\d+$/.test(req.params.date_string)) {
    // if date_string contains only numbers, then assume its a unix timestamp
    // new Date() needs an parsed integer, not a string number
    reqDate = new Date(parseInt(req.params.date_string));
  } else {
    // else just try parsing date_string as a valid new Date() argument
    reqDate = new Date(req.params.date_string);
  }

  let resMsg;
  if (reqDate.toString() !== "Invalid Date") {
    resMsg = {
      unix: reqDate.getTime(),
      utc: reqDate.toUTCString(),
    };
  } else { resMsg = { error: "Invalid Date" }; }

  res.json({ ...resMsg });
});

app.get("/header/api/whoami", (req, res) => {
  const resMsg = {
    'ipaddress': req.ip,
    'language': req.header('accept-language'),
    'software': req.header('user-agent')
  };
  // console.log(resm)
  res.json(resMsg);
})


// listen for requests :)
const port = process.env.PORT || 3000;
var listener = app.listen(port, function () {
  console.log("App listening on port " + listener.address().port);
});

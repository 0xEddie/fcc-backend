var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// load static assets (./public/style.css)
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// Page routes
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
app.get("/timestamp", (req, res) => {
  res.sendFile(__dirname + "/views/timestamp.html")
})

// API endpoints
app.get("/api/timestamp/:date", (req, res) => {
  const date = new Date(req.params.date);
  if (!isNaN(date)) {
    const msg = {
      "unix": date.valueOf(),
      "utc": date.toUTCString()
    }
    res.json({ ...msg });
  } else {
    res.json({ error: "Invalid Date" })
  }
});


// listen for requests :)
const port = process.env.PORT || 3000;
var listener = app.listen(port, function () {
  console.log('App listening on port ' + listener.address().port);
});

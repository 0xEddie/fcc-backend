var express = require('express');
var app = express();

console.log('Environment PORT:', process.env.PORT);

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// load static assets (./public/style.css)
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// app level router for root route (loads ./views/index.html)
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


app.get("/api/:date", (req, res) => {
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

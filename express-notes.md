# freeCodeCamp Back End Development and APIs Notes

- I had trouble getting the tests to pass using GitHub pages or Replit or Netlify for static hosting. glitch.com seems to work though
- Apparently these can be worked on [locally](https://www.freecodecamp.org/news/how-to-run-the-freecodecamp-backend-challenges-locally/), then you just submit a `localhost` URL to the fCC certificate verifier thingy

## 2 - Start a Working Express Server

In the first two lines of the file myApp.js, you can see how easy it is to create an Express app object. 

```js
let express = require('express');
let app = express();
```

This object has several methods. One fundamental method is app.listen(port). It tells your server to listen on a given port, putting it in running state. For testing reasons, we need the app to be running in the background so we added this method in the server.js file for you.

In Express, routes takes the following structure: `app.METHOD(PATH, HANDLER)`
- METHOD is an http method in lowercase
- PATH is a relative path on the server (string or regex)
- HANDLER is a function that Express calls when the route is matched `function(req, res) {...}`

### Use the app.get() method to serve the string "Hello Express" to GET requests matching the / (root) path

```js
...
app.get('/', (req, res) => {
    res.send("Hello Express");
});
```

## 3 - Serve an HTML File

You can respond to requests with a file using the `res.sendFile(path)` method. You can put it inside the app.get('/', ...) route handler
- Behind the scenes, this method will set the appropriate headers to instruct your browser on how to handle the file you want to send, according to its type. Then it will read and send the file.
- This method needs an absolute file path, such using the Node global variable `__dirname`

```js
const absolute path = __dirname + '/relative/path/file.txt'
```

### Send the `/views/index.html` file as a response to `GET` requests to the `/` path.

```js
app.get('/', (req, res) => {
  const absolutePath = __dirname + '/views/index.html';
  res.sendFile(absolutePath)
})
```

## 4 - Serve Static Assets
An HTML server usually has one or more directories that are accessible by the user. You can place there the static assets needed by your application (stylesheets, scripts, images).

In Express, you can put in place this functionality using the middleware express.static(path), where the path parameter is the absolute path of the folder containing the assets.

Middleware are functions that intercept route handlers, adding some kind of information. A middleware needs to be mounted using the method `app.use(path, middlewareFunction)`
- The first `path` argument is optional. If you don’t pass it, the middleware will be executed for all requests

### Mount the `express.static()` middleware to the path `/public` with `app.use()`

The absolute path to the assets folder is `__dirname + /public`

```js
const absPath = __dirname + '/public';
app.use('/public', express.static(absPath))
```

## 5 - Serve JSON on a Specific Route

While an HTML server serves HTML, an API serves data.

The client only needs to know where the resource is (the URL), and the action it wants to perform on it (the verb)

### Serve the object {"message": "Hello json"} as a response, in JSON format, to GET requests to the /json route

Inside the route handler, use the method res.json()

```js
app.get('/json', (req, res) => {
  res.json({"message": "Hello json"})
})
```

## 7 - Implement a Root-Level Request Logger Middleware

### Build a simple logger. For every request, it should log to the console a string taking the following format: `method path - ip`

The request method (http verb), relative route path, and the caller's ip can be accessed from the request object
- `req.method`
- `req.path`
- `req.ip`

```js
// at top of code, so that this applies to all routes
app.use(function middleware(req, res, next) {
  const logMsg = `${req.method} ${req.path} - ${req.ip}`;
  console.log(logMsg);
  next();
})
```

## 8 - Chain Middleware to Create a Time Server

Middleware can be mounted at a specific route using app.METHOD(path, middlewareFunction). Middleware can also be chained within a route definition.

```js
app.get('/user', function(req, res, next) {
  req.user = getTheUserSync();  // Hypothetical synchronous operation
  next();
}, function(req, res) {
  res.send(req.user);
});
```

This approach
- is useful to split the server operations into smaller units
- can be sued to perform some validation on the data

### In the `/now` route, chain a `get` request's middleware function and final handler

- In the middleware function add the current time to the request object in the `req.time` key
    - Use `new Date().toString()`
- In the handler respond with a JSON object with structure `{time: req.time}`
- Test will not pass if you don't chain the middleware

```js
app.get(
  '/now',
  (req, res, next) => {
    req.time = new Date().toString();
    next();
  }, (req, res) => {
    console.log(`Request timestamp: ${req.time}`);
    res.send({time: req.time});
})
```

## 9 - Get Route Parameter Input from the Client

One way to get input from a client is by using route parameters. Route parameters are named segments of the URL, delimited by slashes (/)
- each segment captures the value of the part of the URL
- values can be found in the req.params object

```js
route_path:         '/user/:userId/book/:bookId'
actual_request_URL: '/user/546/book/6754'
req.params:         {userId: '546', bookId: '6754'}
```

### Build an echo server, mounted at the route `GET /:word/echo`
- Respond with a JSON object, taking the structure `{echo: word}`
- find the word to be repeated at req.params.word
- You can test your route from your browser's address bar e.g. `your-app-rootpath/freecodecamp/echo`

## 10 - Get Query Parameter Input from the Client

Another way to get client input is by using query strings. A query string
- is delimted by a question mark `?`
- includes `field=value` couples
    - each couple is separated by an ampersand `&`
```js
route_path: '/library'
actual_request_URL: '/library?userId=546&bookId=6754'
req.query: {userId: '546', bookId: '6754'}
```

Express.js can parse teh data from the query string, and populates the object `req.query`
- Some characters (like a percent `%`, space ` `) cannot be in URLs and have to be encoded in different formats before you can send them
- JavaScript has standard methods for encoding and decoding these characters

### Build an API endpoint, mounted at `GET /name`
- Respond with a JSON document, taking the structure `{ name: 'firstname lastname'}`
- The first and last name parameters should be encoded in a query string `?first=firstname&last=lastname`

Optional clean coding practice: `app.route(path).get(handler).post(handler)` allows you to chain different verb handlers on the same path route

```js
app.get("/name", (req, res) => {
  // console.log(req.query);
  res.send({name: req.query.first + ' ' + req.query.last})
})
```

## 11 - Use `body-parser` to Parse POST Requests

Another common HTTP verb (other than GET) is POST, which is used to send client data with HTML forms. When following the REST convention, POST is used to send data to create new database items (like a new user or new blog post).

These requests don't appear in the URL, the data are hidden in the request body. The request body is part of the HTTP request, also called the payload.

The raw content of an HTTP POST request can be parsed using the `body-parser` package, which has a bunch of middleware which can be used to decode data in different formats.

```
POST /path/subpath HTTP/1.0
From: john@example.com
User-Agent: someBrowser/1.0
Content-Type: application/x-www-form-urlencoded
Content-Length: 20

name=John+Doe&age=25
```

### Mount the `body-parser` middleware

```js
let bodyParser = require('body-parser');
...

// place middleware above other routes that use it
app.use(bodyParser.urlencoded({extended: false}))
```

**Note:** `extended` is a configuration option that tells `body-parser` which parsing needs to be used. When `extended=false` it uses the classic encoding `querystring` library. When `extended=true` it uses `qs` library for parsing.

When using `extended=false`, values can be only strings or arrays. The object returned when using `querystring` does not prototypically inherit from the default JavaScript `Object`, which means functions like `hasOwnProperty`, `toString` will not be available. The extended version allows more data flexibility, but it is outmatched by JSON.

## 12 - Get Data from POST Requests

### Mount a POST handler at the `/name` path

Respond with the same JSON object as before: `{name: 'firstname lastname')`


# MongoDB and Mongoose Challenges

## 1 - Install and Set Up Mongoose

Add `mongoose` with node module

```sh
npm i mongoose
```

Use [this guide](https://www.freecodecamp.org/news/get-started-with-mongodb-atlas/) to set up a free MongoDB Atlas account and toy MongoDB instance.

Add the database URI to an environment variable

```
// .env
MONGO_URI='mongodb+srv://<username>:<password>@<clustername>-vlas9.mongodb.net/test?retryWrites=true`
```

Make sure `.env` is in the `.gitignore`

Add the database connection to node app

```js
// server.js
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopoly: true,
// });
```

## 2 - Create a Model

- First of all we need a Schema
    - Each schema maps to a MongoDB Collection
    - A Mongoose schema is a document data structure (aka shape of the document) that is enforced at the application layer
- Schemas define the overall shape of a document, but **SchemaTypes** define the expected data type for individual fields (`String`, `Number`, `Boolean` etc)
    - Can also pass in useful options like `required` or `default`
- Schemas are building blocks for Models
    - A model allows you to create instances of your objects, called documents

```js
const puppySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: Number
});

const Puppy = mongoose.model('Puppy', puppySchema);
```

Interactions with a database typically happne in handler functions
- Handler functions are executed when some event happens (eg someone hits an endpoint on your API)
- The `done()` function is a callback that tells us we can procedd afte completing an asynchronous operation
    - Asynchronous db operations:
        - insertion
        - searching
        - updating
        - deleting
- It follows the Node convention and should be called as
    - `done(null, data)` on success
    - `done(err)` on failure

```js
const exampleFunc = function(done) {
  //... do something (risky) ...
  if (error) return done(error);
  done(null, result);
};
```

### Create a person schema called `personSchema`

with these properties:

- A required name field of type String
- An age field of type Number
- A favoriteFoods field of type [String]

Then create a model from the `personSchema` and assign it to the existing variable `Person`

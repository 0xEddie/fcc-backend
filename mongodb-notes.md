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

### Create a person schema called `personSchema`

with these properties:

- A required name field of type String
- An age field of type Number
- A favoriteFoods field of type [String]

Then create a model from the `personSchema` and assign it to the existing variable `Person`

```js
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: Number,
  favoriteFoods: [String]
})

const Person = mongoose.model('Person', personSchema);
```

## 3 - Create and Save a Record of a Model

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

### Within the `createAndSavePerson` function, create a document instance using the `Person` model constructor

To the constructutor, pass an object with properties
- `name`
- `age`
- `favoriteFoods`
with their types conforming to the one in the `personSchema`

Then call `<document>.save()` on the returned document instance, passing in the callback using the Node convention

```js
const createAndSavePerson = (done) => {
  const jimbo = new Person({
    name: "Jim Bo",
    age: 29,
    favoriteFoods: ["burger", "fry"],
  });

  jimbo.save((err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};
```

**QUERY** I don't really understand what `done` or `data` are
- apparently `done(null, data)` like the return message of saving something to the database
    - `null` just means no errors occured
    - `data` contains the new database entry, ie `jimbo` plus any transformations by MongoDB (like adding an `_id` field)

## 4 - Create Many Records with model.create()

### Modify the `createManyPeople` function to create many people using `Model.create()` with the argument `arrayOfPeople`

`<Model>.create` requires a callback, similar to the `person.save` function used in the previous section

```js
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  })
};
```

`arrayOfPeople` is an array of objects that match the schema
```js
const arrayOfPeople = [
  {
    name: "Alice Johnson",
    age: 35,
    favoriteFoods: ["pizza", "pasta"],
  },
  {
    name: "Bob Smith",
    age: 28,
    favoriteFoods: ["sushi", "steak"],
  }
];
```

## 5 - Use model.find() to Search Your Database

- `Model.find()` accepts a query document (a JSON object) as the first argument, then a callback
    - It returns an array of matches

### Modify the `findPeopleByName` function to find all the people having a given name, using `<Model>.find() -> [Person]`

Use the function argument `personName` as the search key

```js
const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  })
};
```



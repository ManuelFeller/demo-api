# Code Challenge - A Demo API

...

## notes to formulate properly

...

## Time used

I used about 9 to 10 hours for this code challenge.

Note: I could have been a bit faster if I would not have misguided myself by having the filtering function in a restful GET request where I was first thinking to manually parse the filter-string. This "wrong path" where I was not considering complex filtering (but only allow one field that is equal or like) has cost about one hour extra. In the end having a proper JSON object in a POST body turned out to reduce complexity while providing way higher flexibility for the API user

## ToDo's in case of more time

- make sure that we can use proper foreign keys, until that works have a cleanup job for notes
- add proper authentication
- add more checks to have more detailed errors returned to the client
- advanced error handling
- rate limiting
- define limit of filter complexity with customer, also define if any nesting of and / or is required
- abstract names of objects to not match the data store objects directly (do avoid guesses how the database fields are named, making any SQL injection attack harder)


## Design Thoughts

### UUID vs. incrementing integer as ID

I decided to use full UUID's (even if they take up more space in the data store then an int or long int)
as simple incrementing integers can lead to enumeration attacks.

### REST vs. graphQL

I decided for a simple RESTful API because of it's closeness to the HTTP protocol.
While I consider graphQL as a nice way during an MVP (client apps can define what they need without any changes in the API) I prefer a more explicit API when it comes to a productive application (as one more layer of "magic" is removed).



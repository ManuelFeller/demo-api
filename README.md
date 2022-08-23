# Code Challenge - A Demo API

This repository is my solution to a code challenge / coding test for a job application.

The requirements are known by the company that has sent this to me, so I will not include them in here.

The filtering and sorting requirements were not defined in detail, so I assumed that the filtering of the customers does not need complex nested combinations of `and` or `or` and went ahead with that for now.

- [Code Challenge - A Demo API](#code-challenge---a-demo-api)
	- [Setup](#setup)
		- [Prerequisites](#prerequisites)
		- [Local installation](#local-installation)
	- [Run the solution](#run-the-solution)
	- [Time used](#time-used)
	- [ToDo's I would consider in case of more time](#todos-i-would-consider-in-case-of-more-time)
	- [Design thoughts](#design-thoughts)
		- [nodeJS/express vs. other solutions](#nodejsexpress-vs-other-solutions)
		- [UUID vs. incrementing integer as ID](#uuid-vs-incrementing-integer-as-id)
		- [REST vs. graphQL](#rest-vs-graphql)

## Setup

### Prerequisites

You need the following things installed on the machine you want to run this:

- [nodeJS](https://nodejs.org/en/) in the latest LTS (>= 16.16.0)
- [Postman](https://www.postman.com/) (or any compatible application that can read the file format - like the VS Code plugin [Thunder Client](https://www.thunderclient.com/)) to utilize the collection of demo api calls
- have at least 200 MB of free disk space after the installations above are done
- make sure there is nothing using port `3210` - as the API server will use that

### Local installation

Follow these steps to prepare the API server for local execution

- open a terminal
- navigate to a directory where you want to create the project-folder in
- run `git clone https://github.com/ManuelFeller/demo-api.git` to clone the solution into a sub-directory called `demo-api`
- change into the `demo-api` directory
- execute `npm run setup` to initialize the data store (create file, tables and seed data)
- copy the file `.env.template` to `.env` (you can to changes in there - but at your own risk)

## Run the solution

- Open a terminal and change into the directory that you cloned / installed the application into
- execute `npm run serve` to transpile and run the api server
- open [http://localhost:3210/](http://localhost:3210/) to see that the server answers (a link to the OpenAPI / Swagger documentation is included there)
- open the file in `postman/demo.postman_collection.json` in Postman (or your alternative) to play around with the API and send some requests

The API uses a hardcodes `Bearer` token - it is already set in the Postman collection. If you want to try with your own client please use `01234567890`. You can change that token in the file `src/utils/authenticator.ts`.

Once you are done you can shut down the server by pressing `Control+C`.  
Also, if you have run `npm run serve` once the application is transpiled and a simple `npm run start` can be used to run the app the `n`th time.

## Time used

I used about 9 to 10 hours for this code challenge.

**Note**: I could have been a bit faster if I would not have misguided myself by having the filtering function in a restful GET request where I was first thinking to manually parse the filter-string. This "wrong path" where I was not considering complex filtering (but only allow one field that is equal or like) has cost about one hour extra. In the end having a proper JSON object in a POST body turned out to reduce complexity while providing way higher flexibility for the API user.

Another time-eater was the fact that data seeding did not work any more when adding a constraint in the SQLite database.

## ToDo's I would consider in case of more time

- make sure that we can use proper foreign keys, until that works have a cleanup job for notes
- add proper unit / end-to-end testing
- add some proper authentication (and not just a hardcoded token)
- add more checks to have more detailed errors returned to the client & more advanced error handling
- have some rate limiting (needed for sure in case of a public API but also recommended for intranet API's)
- define limit of filter complexity with customer, also define if any nesting of and / or is required and implement if needed
- abstract names of objects to not match the data store objects directly (do avoid guesses how the database fields are named, making any SQL injection attack harder)
- use a better data store then SQLite when this is not just a demo any more
- use a proper `docker compose` setup to have one container running the server and another running the database
- make the status endpoint not just a static reply but check if the DB is up (if the above point is implemented)

## Design thoughts

### nodeJS/express vs. other solutions

My first decision was that the API should be able to run on all common platforms (Linux, Windows, MacOS) without having any lock in for IDE's or platforms for the operating server or the developer.

I decided to use nodeJS/express as this is my most common used framework in the last few years. I was thinking about using [Deno](https://deno.land/) (because of native Typescript support as well as the integrated security model) but discarded that for time reasons (I was not sure if all my commonly used modules would work).

I considered python/FastAPI but decided against that as I my knowledge there is only very basic, even if that is a quite common setup for backend API's.

I also considered .net core, but I would again need to gain some knowledge there.

### UUID vs. incrementing integer as ID

I decided to use full UUID's (even if they take up more space in the data store then an int or long int) as simple incrementing integers can lead to enumeration attacks.

### REST vs. graphQL

I decided for a simple RESTful API because of it's closeness to the HTTP protocol.  
While I consider graphQL as a nice way during an MVP (client apps can define what they need without any changes in the API) I prefer a more explicit API when it comes to a productive application (as one more layer of "magic" is removed).


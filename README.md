## Feature Flag Service

This API allows other services to know which customer is able or not to use a certain feature of a platform.

### Installation

To setup the server clone the repository and run one of the following commands on the root project folder:

```bash
yarn # if using Yarn
npm install # if using NPM
```

Then create an `.env` file setting up the enviroment variables. Here's an example:

```bash
MONGO_URL=mongodb://localhost:27017/
MONGO_DB=ffservice
CACHE_TIME=86400000
```
Then just run
```bash
npm start
```
Server is going to listen at port 3000 by default. For development use `npm run dev` instead so the project watch the files and have some more debug logging.

### Usage

The API has only a single endpoint at / and receives as a path variable an ID with an optional query with the requested features. Here are a few examples (with a Mongo database loaded with `database-example.js` file):

`https://localhost:3000/2` -> Return all features set versions

```JSON
{
    "mfa": "1.7.1",
    "logging": "1.0.0"
}
```

`https://localhost:3000/1?query=logging,roles,mfa` -> Return state of specific flags (version number if set or false if latest version)

```JSON
{
  "logging": "2.1.0",
  "roles": "1.7.0",
  "mfa": false
}
```

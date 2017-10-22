# Redash to Salesforce

Simple NodeJS utility that fetches Redash query results via API and upserts the data to desired Salesforce objects using the [Salesforce REST Bulk API](https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/asynch_api_intro.htm), leveraging the lightweight [node-salesforce-connection](https://www.npmjs.com/package/node-salesforce-connection) package for session authentication and REST request abstraction.

Robust logging with [winston](https://github.com/winstonjs/winston).

## Install

```sh
$ git clone git@github.com:codygordon/redash-to-salesforce.git
$ cd redash-to-salesforce
$ npm i
```

## Config

First, copy `.env.example` to a new `.env` (make sure to leave `.env.example` intact) and enter environmental variables (all are required for script to run).

```sh
$ cp .env.example .env
```

Env Variable      | Value
----------------- | --------------------------------------------------------
`SALESFORCE_HOSTNAME` | `test.salesforce.com` or `login.salesforce.com` or `yourdomain.salesforce.com`
`SALESFORCE_API_VERSION` | *tested with `41`*
`SALESFORCE_USERNAME` | `example@example.com`
`SALESFORCE_PASSWORD` | *(make sure to update if changed)*
`SALESFORCE_SECURITY_TOKEN` | [Reset Salesforce Security Token](https://help.salesforce.com/articleView?id=user_security_token.htm&type=0)
`REDASH_BASE_URL` | `https://redash.yourdomain.com`
`REDASH_API_KEY` | *(find ReDash API key @ {redash_url}/users/{your_user_id}#apiKey)*
`LOGS_PATH` | *(log files in production will be saved in specified folder path)*

Second, edit `lib\config.js` and enter objects into the `config` constant (array) for each ReDash query / Salesforce object being processed, for example:

```js
const config = [
  {
    redashQueryId: 55,
    salesforceObject: 'contact',
    salesforceExtId: 'your_user_id__c',
  },
  {
    redashQueryId: 56,
    salesforceObject: 'opportunity',
    salesforceExtId: 'your_opportunity_id__c',
    salesforceLookups: [{
      relationship: 'contact__r',
      extId: 'your_user_id__c',
    }],
  },
]
```

Each upsert process will be handled synchronously in the `config` array's indexed order allowing for lookups to be handled properly (i.e., a Contact must exist before a related Opportunity can reference it), so make sure the objects are in the order you want them to run.

### Salesforce

You should set up a [dedicated API User](https://help.salesforce.com/articleView?id=000176281&type=1) to use with this script.

### ReDash

For each Salesforce object with data being upserted into there must be a separate ReDash query with appropriate columns and data formatting.

***The script will fail if the following conditions aren't met:***

- All columns in query must exist as fields in Salesforce object
- ReDash query column must match existing Salesforce field names exactly
  - **Exception**: Luckily, Salesforce field names are **case insensitive** when using the API, as the ReDash query API only exports field names in lowercase
  - Custom fields must end with `__c` (this will not display in the #table query results, but it will still export correctly when using the API)
- Date columns in query must be in the format of `YYYY-MM-DD`
  - See ["Date" and "Date Time" format in Data Loader and API](https://help.salesforce.com/articleView?id=Data-Loader-Import-data-for-Date-or-Date-Time-field-1327108684799&language=en_US&type=1)
- For lookups the script will convert the query column into the required nested JSON format
  - The column name and the config's `salesforceLookups.relationship` value must both exactly match the relationship name (i.e., `Contact__r`)
  - The column values must contain the related object's external ID that matches the config's `salesforceLookups.extId`

## Build

Webpack is used to build into single production dist file:

```sh
$ npm run build
```

## Execute

### Development

You may start the script in `development` mode (which uses [nodemon](https://github.com/remy/nodemon) and will log to the console) by running:

```sh
$ npm start
```

### Production

You can either have an external service such as `crontab` run the built script at `redash-to-salesforce\dist\index.js`, or run:

```sh
$ npm run prod
```

In `production` mode a log file will be created in the specified directory each time the script is run and no logs will be sent to the console.

## TODOs

1. Write test suites in Mocha

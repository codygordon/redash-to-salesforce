# Redash to Salesforce

Simple NodeJS utility that fetches Redash query results via API and uploads the data to desired Salesforce objects using the [Salesforce REST Bulk API](https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/asynch_api_intro.htm), leveraging the lightweight [node-salesforce-connection](https://www.npmjs.com/package/node-salesforce-connection) package to help with session authentication.

Can be run with crontab as it uses Webpack to build into single production-ready dist file.

# Using AWS' Lambda & API Gateway to Send SMS Tracking Updates with Shippo & Twilio

To get started and provide a little context, we’re going to go through how to create an AWS Lambda function that will trigger whenever Shippo posts to our AWS API Gateway Endpoint. Inside of the Lambda function, we’re going to call out to Twilio to send an SMS update with our tracking info provided by Shippo’s webhook.

Now, I know what you’re thinking, this sounds pretty complicated and requires a lot of manual set up and repeated uploading of JavaScript files to AWS, but you’d be wrong. We’re going to use ClaudiaJS to do a lot of the heavy lifting on this for us, because I’m all about writing less code to do more.

Things you'll want before getting started with this tutorial:
* [Twilio Account](https://www.twilio.com/try-twilio)
> You'll need your Account SID and Auth Token from this (you can find these both in your dash after signing up)
* [Shippo Account](https://goshippo.com/register)
> You just need to plug in your API endpoint URL to the [webhooks](https://goshippo.com/docs/webhooks) area to have it work.

You can get ClaudiaJS by just installing it globally on your machine using:

`npm install -g claudia`

Claudia is going to need access to your AWS account, so there is a detailed guide [here](https://claudiajs.com/tutorials/installing.html) that goes into how to setup access credentials for ClaudiaJS on your machine to create Lamda functions and API endpoints. You need to make sure to give access for [`AWSLambdaFullAccess`](https://console.aws.amazon.com/iam/home?region=us-east-1#policies/arn:aws:iam::aws:policy/AWSLambdaFullAccess), [`IAMFullAccess`](https://console.aws.amazon.com/iam/home?region=us-east-1#policies/arn:aws:iam::aws:policy/IAMFullAccess), and [`AmazonAPIGatewayAdministrator`](https://console.aws.amazon.com/iam/home?region=us-east-1#policies/arn:aws:iam::aws:policy/AmazonAPIGatewayAdministrator).

We can create our project folder using (you can skip this if you simply cloned the repo):

`mkdir twilio-shippo && cd twilio-shippo`

You can speed up initializing your project using the following command, which generates a `package.json` for you:

`npm init --yes`

Now that we have our `package.json` created, we can start installing some dependencies we'll need for our function to work. We'll be needing ClaudiaJS' API Builder and Twilio's node library to get up and running here.

`npm install -S twilio claudia-api-builder`

Our end goal here is to get something like what we have at [app.js](/app.js) in the repo. Feel free to just copy and modify from there or work through this with us. Just don't forget to use the correct commands when deploying with ClaudiaJS.

You'll want to create an app file `app.js` where you'll be building out your lambda function along with specifying how your API endpoint will work.

We'll start by adding our function dependencies at the top of our file:
```javascript
var ApiBuilder = require('claudia-api-builder'),
    api = new ApiBuilder(),
    twilio = require('twilio')('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');
```

From here, we want to create the endpoint that we'll be putting into [Shippo's webhook](https://goshippo.com/docs/webhooks) interface for capturing all of our tracking updates. Every time Shippo detects a new update to the status of a tracking number that we have POSTed to them, Shippo will send out updates to our API endpoint that we give to them.

We'll want to be sure that we export our function so that Claudia can package everything up to be deployed to AWS for us. We can do this by adding the following to our `app.js` file:
```javascript
// Reminder: This should be appended below the code found above
module.exports = api;

api.post('sms-updates', function(req){
    // Our Lambda logic will go here
});
```

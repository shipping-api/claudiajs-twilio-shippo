var ApiBuilder = require('claudia-api-builder'), api = new ApiBuilder(),
    twilio = require('twilio')('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');

module.exports = api;

api.post('/sms-updates', function(req) {
  // This logic is just here to handle if a location was not included with your
  // tracking number that you are requesting.
  var trackingLocation = '';
  if (req.body.tracking_status.location) {
    if (req.body.tracking_status.location.city) {
      trackingLocation = req.body.tracking_status.location.city + ', ' |
          req.body.tracking_status.location.state
    }
  } else {
    trackingLocation = 'UNKNOWN';
  }

  return twilio
      .sendMessage({
        to: '+1-TEST_NUMBER',      // This should be your destination number
        from: '+1-TWILIO_NUMBER',  // This is your Twilio number in your account
        body: 'Tracking #: ' + req.body.tracking_number + '\nStatus: ' +
            req.body.tracking_status.status + '\nLocation: ' + trackingLocation
      })
      .then(function(
          success) {  // We are using a promise here to help Claudiajs
                      //  make sure the request is executed, otherwise
                      //  our function will exit before it executes
        console.log(success);
      })
      .catch(function(error) {
        console.log(error);
      });
});

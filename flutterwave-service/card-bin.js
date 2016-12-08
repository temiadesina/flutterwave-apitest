var encrypt = require('./encrypt');
var unirest = require('unirest');
var dotenv = require('dotenv');
var ApiKey = process.env.API_KEY;
var merchantid = process.env.MERCHANT_ID;
var baseurl = process.env.API_URL;


dotenv.load({path: '.env'});

exports.checkcard = function (req, res, next) {
  console.log(req.body.cardbin);
  var card_bin = {
    'card6': req.body.cardbin
  };
  console.log(card_bin);
  unirest.post(baseurl + 'fw/check/')
  .headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
  .send(card_bin)
  .end(function (response) {
    if (response.responseCode == 00 && response.body.status == 'success') {
      res.render('card-bin', {error: false, message: response.body, status: response.status});
      console.log(response.body);
    }
    else {
      res.render('card-bin', {error: true, message: response.body, status: response.status});
      console.log(response.body);
    }
  })
};

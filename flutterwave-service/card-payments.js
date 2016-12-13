var express = require('express');
var session = require('express-session');
var encrypt = require('./encrypt');
var unirest = require('unirest');
var dotenv = require('dotenv');
// var ApiKey = process.env.API_KEY;
// var merchantid = process.env.MERCHANT_ID;
// var baseurl = process.env.API_URL;
//var flutterwaveurl = 'http://staging1flutterwave.co:8080/pwc/rest/card/mvva/pay';

var app = express();
// dotenv.load({path:".env.json"});
var config = require('../env.json');
var ApiKey = config.API_KEY;
var merchantid = config.MERCHANT_ID;
var baseurl = config.API_URL;

app.use(session({
  secret: "njwer123dert60hg",
  resave: false,
  saveUninitialized: false,
  cookies: {maxAge: 7 * 2 * 100000}
}));


exports.charge = function(req, res, next){
    //req.body.merchantid = process.env.MERCHANT_ID;
  //console.log(ApiKey);
    var cardDetails = {
      'amount': encrypt(ApiKey, req.body.amount),
      'authmodel': encrypt(ApiKey, "NOAUTH"),
      'cardno': encrypt(ApiKey, req.body.cnumber),
      'custid': encrypt(ApiKey, "1234"),
      'cvv': encrypt(ApiKey, req.body.cvv),
      'currency': encrypt(ApiKey, "NGN"),
      //'pin': encrypt(ApiKey, req.body.pin),
      'expirymonth': encrypt(ApiKey, req.body.cdatemonth),
      'expiryyear': encrypt(ApiKey, req.body.cdateyear),
      'merchantid': merchantid,
      'narration': encrypt(ApiKey, req.body.transactiondesc)
    };
    //console.log(req.body.this);
    //var encryptedDetails = encryptCardDetails(cardDetails);

    unirest.post(baseurl + 'card/mvva/pay')
      .headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
      .send(cardDetails)
      .end(function(response){
        console.log(response);
        if(response.body.data.responsecode == '00' && response.body.data.status == 'success'){
            //everything is fine

            res.render('card-payments');
            console.log(response);
        }
        else if (response.body.data.responsecode == '02' && response.body.data.status == 'success') {
          res.render('cardpayment-otp')
          req.session.otpRef = response.body.data.otptransactionidentifier;
        }
        else{
            res.render('card-payments');

        }
      })


};



exports.cardotp = function(req,res,next){

  var cardotpDetails = {
    "merchantid": merchantid,
    "otp": encrypt(ApiKey, req.body.cardotp),
    "otptransactionidentifier": encrypt(ApiKey, req.session.otpRef)
  }

  unirest.post(baseurl + 'card/mvva/pay/validate')
  .headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
  .send(cardotpDetails)
  .end(function(response){
    if(response.body.data.responsecode == '200' && response.body.data.status == 'success'){

    }
  })






}










/**
var encryptCardDetails = function(cardDetails){
    var encryptedCardDetails = [];
    for (var key in cardDetails) {
      console.log(cardDetails[key]);
        if (cardDetails.hasOwnProperty(key)) {
            encryptedCardDetails[key] = encrypt(ApiKey,cardDetails[key]);
        }
    }
    return encryptedCardDetails;
};
**/

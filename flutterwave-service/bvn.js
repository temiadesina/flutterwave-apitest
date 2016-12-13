var express = require('express');
var encrypt = require('./encrypt');
var unirest = require('unirest');
var config = require('../env.json');
var session = require('express-session');
 var ApiKey = config.API_KEY;
 var merchantid = config.MERCHANT_ID;
var baseurl = config.API_URL;

var app = express();
//var storedbvn, storedtransref = '';

app.use(session({
  secret: "nhfritjsl",
  resave: false,
  saveUninitialized: true,
  cookies: {maxAge: 180 * 60 * 1000},
}));

// dotenv.load({path: '.env'});

exports.validatebvn = function(req, res, next){
// body.merchantid = process.env.MERCHANT_ID;
  var bvnDetails = {
    "merchantid": merchantid,
    "bvn": encrypt(ApiKey, req.body.bvn),
    "otpoption": encrypt(ApiKey, req.body.vmethod)
  };

  //var storedbvn = req.body.bvn;
  //req.session.storedbvn = storedbvn;
  const sess = req.session;
  console.log('session is', typeof req.session);
  //console.log(storedbvn);
  //var encryptedDetails = encryptCardDetails(bvnDetails);
  //console.log(encryptedDetails);
  unirest.post(baseurl + 'bvn/verify/')
  .headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
  .send(bvnDetails)
  .end(function(response){
    if (response.body.data.responseCode == '00' && response.body.data.status == 'success') {
      //everything is fine and OTP was sent to phone
      res.render('bvn-otpvalidation')

      //req.session.storedtransref = response.data.transactionReference

    }
    else {
      res.render('bvn-otpvalidation');
      console.log(response.body);
      console.log(response.body.data.transactionReference);
    }
    //storedbvn = req.session.storedbvn;
    //req.session.storedbvn = req.body.bvn;
    //storedbvn = req.session.storedbvn;
    //storedtransref = req.session.storedtransref;
    //req.session.storedtransref = response.body.data.transactionReference;
  // console.log(storedtransref);
  })


   //function(error, response, body){

  //.json(encryptedDetails);
  //req.session.storedbvn = req.body.bvn;

};


exports.bvnotp = function (req, res, next) {
  //console.log(req.session.storedbvn + '64');
  //console.log(req.session.storedtransref + '65');
  var otpdetails = {
    'merchantid': merchantid,
    'bvn':  encrypt(ApiKey, req.session.stbvn),
    //'transactionReference': encrypt(ApiKey, req.session.storedtransref),
    'otp': encrypt(ApiKey, req.body.bvnotp)
  };
console.log(otpdetails);
  unirest.post(baseurl + 'bvn/validate/')
  .headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
  .send(otpdetails)
  .end(function(response){
    if (response.body.data.responseCode == '00' && response.body.data.status == 'success') {
      //everything is fine and OTP was sent to phone
      res.render('bvn-success', {error: false, message: response.body, status: response.status, respmsg: response.responseMessage});
    }
    else {
      res.render('bvn-success', {error: true, message: response.body, status: response.status, respmsg: response.responseMessage});
      console.log(response.body);
    }
  })
};
/**
var encryptCardDetails = function(bvnDetails){
    var encryptedCardDetails = [];
    for (var key in bvnDetails) {
      console.log(bvnDetails[key]);
        if (bvnDetails.hasOwnProperty(key)) {
            encryptedCardDetails[key] = encrypt(ApiKey,bvnDetails[key]);
        }
    }
  return encryptedCardDetails;

};
**/

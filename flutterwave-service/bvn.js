var encrypt = require('./encrypt');
var unirest = require('unirest');
var dotenv = require('dotenv');
var ApiKey = process.env.API_KEY;
var merchantid = process.env.MERCHANT_ID;
var baseurl = process.env.API_URL;

var storedbvn, storedtransref;

dotenv.load({path: '.env'});

exports.validatebvn = function(req, res, next){
// body.merchantid = process.env.MERCHANT_ID;
  var bvnDetails = {
    "merchantid": merchantid,
    "bvn": encrypt(ApiKey, req.body.bvn),
    "otpoption": encrypt(ApiKey, req.body.vmethod)
  };
  storedbvn = req.body.bvn;
  console.log(storedbvn);
  //var encryptedDetails = encryptCardDetails(bvnDetails);
  //console.log(encryptedDetails);
  unirest.post(baseurl + 'bvn/verify/')
  .headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
  .send(bvnDetails)
  .end(function(response){
    if (response.responseCode == 00 && response.status == 'success') {
      //everything is fine and OTP was sent to phone
      res.render('bvn-otpvalidation', {error: false, message: response.body, status: response.body.status, respmsg: response.body.responseMessage});
    }
    else {
      res.render('bvn-otpvalidation', {error: true, message: response.body, status: response.body.status, respmsg: response.body.responseMessage});
      console.log(response.body);
    }
    storedtransref = response.transactionReference;
    console.log(storedtransref);
  })


   //function(error, response, body){

  //.json(encryptedDetails);

};

exports.bvnotp = function (req, res, next) {
  var otpdetails = {
    'merchantid': merchantid,
    'bvn': encrypt(ApiKey, storedbvn),
    'transactionReference': encrypt(ApiKey, storedtransref),
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
    if (response.responseCode == 00 && response.status == 'success') {
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

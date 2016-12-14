var encrypt = require('./encrypt');
var unirest = require('unirest');
var config = require('../env.json');

 var ApiKey = config.API_KEY;
 var merchantid = config.MERCHANT_ID;
var baseurl = config.API_URL;






var sess = null;
var Response = null;
exports.validatebvn = function(req, res, next){
 sess= req.session;
  var bvnDetails = {
    "merchantid": merchantid,
    "bvn": encrypt(ApiKey, req.body.bvn),
    "otpoption": encrypt(ApiKey, req.body.vmethod)
  };

 sess.stbvn = req.body.bvn; // store bvn inside session to be used in function bvnotp
console.log('session is', typeof req.session);

  unirest.post(baseurl + 'bvn/verify/')
  .headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
  .send(bvnDetails)
  .end(function(response){
    Response = response.body;
    if (Response.data.responseCode == '00' && Response.data.status == 'success') {
      //everything is fine and OTP was sent to phone
      res.render('bvn-otpvalidation.ejs', {message: Response.data.responseMessage});

      sess.storedtransref = response.data.transactionReference; // store transactionReference from response to be used with function bvnotp
      console.log(sess.storedtransref);
    }
    else {
      res.render('bvn-otpvalidation.ejs', {message: Response.data.responseMessage});
      console.log(response.body);
      //console.log(response.body.data.transactionReference);
    }

  })




};


exports.bvnotp = function (req, res, next) {
console.log(sess, 'inside bvn otp');

var otpdetails = {
  "merchantid": merchantid,
  "otp": encrypt(ApiKey, req.body.bvnotp),
  "bvn": encrypt(ApiKey, sess.stbvn),
  "transactionreference": encrypt(ApiKey, sess.storedtransref)
}
  unirest.post(baseurl + 'bvn/validate/')
  .headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
  .send(otpdetails)
  .end(function(response){
    console.log(Response.data.responseCode);
    if (Response.data.responseCode == '00' && Response.data.status == 'success') {
      //everything is fine and OTP was sent to phone
      res.render('bvn-success.ejs', {message: Response.data, rscode: Response.data.responseCode});

    }
    else {
      res.render('bvn-success.ejs', {message: Response.data.responseMessage, rscode: Response.data.responseCode});
      console.log(response.body);
    }
  })
};

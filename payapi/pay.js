var express = require('express');
var encrypt = require('./encrypt');
var unirest = require('unirest');
var config = require('../env.json');
var session = require('express-session');
var ApiKey = config.API_KEY;
var merchantid = config.MERCHANT_ID;
var baseurl = config.API_URL;

var app = express();

app.use(session({
  secret: '234hfgrtei987js',
  resave: false,
  saveUninitialized: false,
  cookies: {maxAge: 180 * 60 * 1000}
}));

exports.linkAccount = function(req, res, next){

  var accDetails = {
    "merchantid": merchantid,
    "accountnumber": encrypt(ApiKey, req.body.accnum),
    "country": encrypt(ApiKey, req.body.acccountry)
  }

  var sess = req.session;
  unirest.post(baseurl + 'pay/linkaccount')
  .headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
  .send(accDetails)
  .end(function(response){
    if (response.body.data.responsecode == '02' && response.body.data.status == 'success') {
      var Response = "Validate with otp sent to you";
      res.render('pay-validate1', function(){
        var completion = document.querySelector('.completion');
        completion.innerHTML = "Pending Validation";
      });
    } else {
      var Response = response.body.data.responsemessage;
      res.render('pay-view', function(){
        var error = document.querySelector('.error');
        error.innerHTML = 'An Error occured: ' + Response;
      });
    }

    sess = response.body.data.uniquereference;
  })
};


exports.accountOtp = function (req, res, next) {
    var accotpDetails = {
      "merchantid": merchantid,
      "otp": encrypt(ApiKey, req.body.payotp1),
      "otptype": encrypt(ApiKey, 'PHONE_OTP'),
      "currency": encrypt(ApiKey, 'NG'),
      "relatedreference": encrypt(ApiKey, sess)
    }

    unirest.post(baseurl + 'pay/linkaccount/validate')
    .headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    })
    .send(accotpDetails)
    .end(function(response){
      if (response.body.data.responsecode == '02' && response.body.data.status == 'success') {

      } else {

      }
    })
}

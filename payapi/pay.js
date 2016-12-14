var encrypt = require('../flutterwave-service/encrypt');
var unirest = require('unirest');
var config = require('../env.json');
var session = require('express-session');
var ApiKey = config.API_KEY;
var merchantid = config.MERCHANT_ID;
var baseurl = config.API_URL;


var sess = null;
exports.linkAccount = function(req, res, next){

  var accDetails = {
    "merchantid": merchantid,
    "accountnumber": encrypt(ApiKey, req.body.accnum),
    "country": encrypt(ApiKey, req.body.acccountry)
  }

  sess = req.session;
  unirest.post(baseurl + 'pay/linkaccount/')
  .headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
  .send(accDetails)
  .end(function(response){
    var Response = response.body;
    console.log(response);
    if (Response.data.responsecode == '02' && Response.data.status == 'success') {
      var responsemsg = "Validate with otp sent to you";
      res.render('pay-validate1.ejs', {message: responsemsg, rscode: Response.data.responsecode});
      console.log(response.body.data);
    }else if (response.body.data.responsecode != '02' || response.body.data.responsecode != '00') {
      res.render('pay-view.ejs', {message: Response.data.responsemessage, rscode: Response.data.responsecode});
    }//else {
      //res.render('pay-view.ejs', {message: Response.data.responsemessage, r})
    //}

    sess.relatedreference = Response.data.uniquereference;
  })
};


exports.accountOtp1 = function (req, res, next) {
    var accotpDetails = {
      "merchantid": merchantid,
      "otp": encrypt(ApiKey, req.body.payotp1),
      "otptype": encrypt(ApiKey, 'PHONE_OTP'),
      "currency": encrypt(ApiKey, 'NG'),
      "relatedreference": encrypt(ApiKey, sess.relatedreference)
    }

    unirest.post(baseurl + 'pay/linkaccount/validate')
    .headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    })
    .send(accotpDetails)
    .end(function(response){
      var Response = response.body;
      if (Response.data.responsecode == '02' && Response.data.status == 'success') {
        res.render('pay-validate2.ejs', {message: Response.data.responsemessage, rscode: Response.data.responsecode});
      } else if (Response.data.responsecode != '02') {
        res.render('pay-validate1.ejs', {message: Response.data.responsemessage, rscode: Response.data.responsecode});
      }
      sess.relatedreference = Response.data.uniquereference;
    })
};

exports.accountOtp2 = function (req, res, next) {
  var otpDetails2 = {
    "merchantid": merchantid,
    "otp": encrypt(ApiKey, req.body.payotp2),
    "relatedreference": encrypt(ApiKey, sess.relatedreference),
    "otptype": encrypt(ApiKey, "PHONE_OTP")
  }

  unirest.post(baseurl + 'pay/linkaccount/validate')
  .headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
  .send(otpDetails2)
  .end(function(response){
    var Response = response.body;
    if (Response.data.responsecode == '00' && Response.data.status == 'success') {
      res.render('pay-validate2.ejs', {message: Response.data.responsemessage, rscode: Response.data.responsecode});

    } else if (Response.data.responsecode != '00') {
      res.render('pay-validate2.ejs', {message: Response.data.responsemessage, rscode: Response.data.responsecode});
    }
  })
}

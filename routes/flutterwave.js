var express = require('express');
var router = express.Router();
var card_payments = require('../flutterwave-service/card-payments');
var bvn_verification = require('../flutterwave-service/bvn');
var cardbin_verify = require('../flutterwave-service/card-bin');
var pay_api = require('../payapi/pay');


router.get('/card-payment', function(req, res){
    res.render('card-payments');
});

router.post('/card-payment', card_payments.charge);


router.get('/card-validate', function(req, res){
  res.render('cardpayment-otp');
})

router.post('/card-validate', card_payments.cardotp);


router.get('/bvn-verify', function(req, res){
    res.render('bvn-verification');
});

router.post('/bvn-verify', bvn_verification.validatebvn);


router.get('/bvn_validate', function(req, res, next){
  res.render('bvn-otpvalidation');
});

router.post('/bvn_validate', bvn_verification.bvnotp);

router.get('/bvn_success', function(req, res){
    res.render('bvn-success');
});

router.get('/card-bin', function(req, res){
    res.render('card-bin');
});

router.post('/card-bin', cardbin_verify.checkcard);

router.get('/pay-view', function(req, res, next){
  res.render('pay-view');
});

router.post('/pay-view', pay_api.linkAccount);

// router.get('/pay-validate1', function(req, res, next){
//   res.render('pay-validate1');
// });

router.post('/pay-validate1', pay_api.accountOtp1);

router.get('/pay-validate2', function(req, res, next){
  res.render('pay-validate2');
});

router.post('/pay-validate2', pay_api.accountOtp2);


module.exports = router;

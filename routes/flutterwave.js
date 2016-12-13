var express = require('express');
var router = express.Router();
var card_payments = require('../flutterwave-service/card-payments');
var bvn_verification = require('../flutterwave-service/bvn');
var cardbin_verify = require('../flutterwave-service/card-bin');

router.get('/card-payment', function(req, res){
    res.render('card-payments');
});

router.post('/card-payment', function(req, res, next){
    card_payments.charge(req, res, next);
});

router.post('/card-validate', function(req, res, next){
  card_payments.cardotp(req, res, next);
})

router.get('/bvn-verify', function(req, res){
    res.render('bvn-verification');
});

router.post('/bvn-verify', function(req, res, next){
   bvn_verification.validatebvn(req, res, next);
});

router.post('/bvn_validate', function(req, res, next){
    bvn_verification.bvnotp(req, res, next);
});

router.get('/card-bin', function(req, res){
    res.render('card-bin');
});

router.post('/card-bin', function(req, res, next){
  cardbin_verify.checkcard(req, res, next);
});

router.get('/link-account', function(req, res, next){
  res.render('pay-view');
});

router.get('/pay-validate1', function(req, res, next){
  res.render('pay-validate1');
});

module.exports = router;

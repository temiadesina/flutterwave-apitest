var express = require('express');
var router = express.Router();
var card_payments = require('../flutterwave-service/card-payments');

router.get('/card-payment', function(req, res){
    res.render('card-payments');
});

router.post('/card-payment', function(req, res, next){
    card_payments.charge(req, res, next);
});

router.get('/bvn-verify', function(req, res){
    res.render('bvn-verification');
});

router.get('/card-bin', function(req, res){
    res.render('card-bin');
});

module.exports = router;

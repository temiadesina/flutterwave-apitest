var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'flutterwave-apitest' });
});

router.get('/card-payment', function(req, res){
  res.render('card-payments');
});

router.get('/bvn-verify', function(req, res){
  res.render('bvn-verification');
});

router.get('/card-bin', function(req, res){
  res.render('card-bin');
});




module.exports = router;

var encrypt = require('./encrypt');
var request = require('request');
var dotenv = require('dotenv');
var ApiKey = process.env.API_KEY;
var merchantid = process.env.MERCHANT_ID;
var baseurl = process.env.API_URL;
//var flutterwaveurl = 'http://staging1flutterwave.co:8080/pwc/rest/card/mvva/pay';

dotenv.load({path:".env"});


exports.charge = function(req, res, next){
    req.body.merchantid = process.env.MERCHANT_ID;
    var cardDetails = req.body.this;
    console.log(req.body.this);
    var encryptedDetails = encryptCardDetails(cardDetails);

    request.post(baseurl + 'card/mvva/pay', function(error, response, body){
        if(!error && response.statusCode == 200){
            //everything is fine
            res.render('card-payments', {error: false, message: body});
            console.log(response);
        }
        else{
            res.render('card-payments', {error: true});
            console.log(error);
        }
    }).json(encryptedDetails);
};

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

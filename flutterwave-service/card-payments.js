var encrypt = require('./encrypt');
var request = require('request');
var merchantKey = 'ajibigad';
var flutterwaveApi = 'http://staging1flutterwave.co:8080/pwc/rest/card/mvva/pay';

exports.charge = function(req, res, next){
    var cardDetails = req.body;
    var encryptedDetails = encryptCardDetails(cardDetails);

    request.post(flutterwaveApi, function(error, response, body){
        if(!error && response.statusCode == 200){
            //everything is fine
            res.render('card-payments', {error: false, message: body});
        }
        else{
            res.render('card-payments', {error: true});
        }
    }).json(encryptedDetails);
};

var encryptCardDetails = function(cardDetails){
    var encryptedCardDetails = [];
    for (var key in cardDetails) {
        if (cardDetails.hasOwnProperty(key)) {
            encryptedCardDetails[key] = encrypt(merchantKey, cardDetails[key]);
        }
    }
    return encryptedCardDetails;
};

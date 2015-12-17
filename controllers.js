var express = require('express');
var router = express.Router();

var request = require('request'),
    mongoose = require('mongoose');

var App = mongoose.model('App', {
    tliId: {
        type: String,
        required: true
    },
    teacherId: {
        type: String,
        required: true
    }
});

router.get('/init', function(req, resp, next) {
    request((process.env.API_URL || 'http://localhost:5000/api') + '/auth', function(err, response, body) {
        if(err) {
            return next(err);
        }

        var userData = JSON.parse(body);

        req.session.userData = userData;

        resp.send(userData);
    });
});

router.get('/app/:tliId', function(req, resp, next) {
    App.findOne({tliId: req.params.tliId}, function(err, result) {
        if(err) {
            return next(err);
        }

        if(!result) {
            return resp.send({
                tliId: req.params.tliId,
                teacherId: req.session.userData.userId
            });
        }

        resp.send({
            tliId: result.tliId,
            teacherId: result.teacherId
        });
    });
});

router.put('/app/:tliId', function(req, resp, next) {
    if(req.session.userData.userType === 'teacher') {
        var data = {};

        App.findOneAndUpdate({tliId: req.params.tliId}, data, {upsert: true}, function(err, updated) {
            if(err) {
                return next(err);
            }

            resp.send(updated);
        });
    } else {
        resp.send('Not allowed');
    }
});

module.exports = router;

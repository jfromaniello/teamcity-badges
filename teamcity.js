var request = require('request');
var Convert = require('ansi-to-html');
var async = require('async');

var auth = {
  user: process.env.AUTH.split(':')[0],
  pass: process.env.AUTH.split(':')[1],
};

module.exports.getLastbuild = function (bt, callback) {
  async.parallel([
    function (done) {
      request.get({
        url: process.env.TEAMCITY + '/httpAuth/app/rest/buildTypes/id:bt21/builds/running:true',
        auth: auth,
        headers: {
          'Accept': 'application/json'
        }
      }, function (err, resp, body) {
        if (err) return done(err);
        if (resp.statusCode === 404) return done();
        var build = JSON.parse(body);
        done(null, build);
      });
    },
    function (done) {
      request.get({
        url: process.env.TEAMCITY + '/httpAuth/app/rest/buildTypes/id:bt21/builds/running:false',
        auth: auth,
        headers: {
          'Accept': 'application/json'
        }
      }, function (err, resp, body) {
        if (err) return done(err);
        if (resp.statusCode === 404) return done();
        var build = JSON.parse(body);
        done(null, build);
      });
    }
  ], function (err, results) {
    callback(err, results[0] || results[1]);
  });
};

module.exports.getLog = function (buildNumber, callback) {
  request.get({
    url: process.env.TEAMCITY + '/httpAuth/downloadBuildLog.html?buildId=' + buildNumber,
    auth: auth,
    headers: {
      'Accept': 'application/json'
    }
  }, function (err, resp, body) {
    if (err) return callback(err);
    var convert = new Convert();
    callback(null, convert.toHtml(body.replace(/\n/ig, '<br />')));
  });
};
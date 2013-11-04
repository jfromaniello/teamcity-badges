var http     = require('http');
var fs       = require('fs');

var ejs       = require('ejs');
var indexTmpl = ejs.compile(fs.readFileSync(__dirname + '/index.html.ejs').toString());

var express  = require('express');
var app      = express();

var badges   = require('./badges');
var teamcity = require('./teamcity');

var enable_bt = process.env.BUILDTYPES.split(',');

app.get('/', function (req, res) {
  res.send(indexTmpl({
    builds: enable_bt
  }));
});

app.get('/:bt', function (req, res) {
  if(!~enable_bt.indexOf(req.params.bt)) return res.send(404);

  res.set({
    'Content-Type': 'text/html; charset=utf-8',
    'Transfer-Encoding': 'chunked'
  });

  teamcity.getLastbuild(req.params.bt, function (err, lastbuild) {
    if (err) return res.send(500);
    if (!lastbuild) return res.send(404);
    res.write('<html><head><title>' + lastbuild.buildType.name + '</title></head><body><pre>');
    var stream = teamcity.sendLog(lastbuild.id, res);
    stream.once('end', function () {
      res.end('</pre></body></html>');
    });
  });
});

app.get('/:bt/status.png', function (req, res) {
  if(!~enable_bt.indexOf(req.params.bt)) return res.send(404);
  teamcity.getLastbuild(req.params.bt, function (err, lastbuild) {
    if (err) return res.send(500);
    if (!lastbuild) return res.send(404);
    if (lastbuild.running) {
      return res.status(200).sendfile(badges['PENDING']);
    }
    res.status(200).sendfile(badges[lastbuild.status]);
  });
});

var port = process.env.PORT || 9001;
http.createServer(app).listen(port, function () {
  console.log('listening on http://localhost:' + port);
});
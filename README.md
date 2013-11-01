Teamcity Badge Frontend

Get the badges you diserve (customizable):

![](http://img.shields.io/build/success.png?color=green)]
![](http://img.shields.io/build/pending.png?color=yellow)]
![](http://img.shields.io/build/failed.png?color=red)]

This is a 50 LoC proxy to your teamcity with two endpoints:

1.  Badge
2.  Plain Build Log


Teamcity already has something like this but you usually put authentication in front of TC. We have private projects in TC as well as opensource things, so we wanted to have an easy way to publish the status of our projects to the README files pretty much like travis.


## Usage

Clone this repon and run:

~~~bash
$ npm install					   # install deps
$
$ BUILDTYPES=bt1,bt2,bt3 \ 	       # these are the ids of the build types you want to publish
   AUTH=someuser:somepass \        # credentials to authenticate to your teamcity
   TEAMCITY=http://url-to-tc.com \ # url to your teamcity server
   node server.js
~~~

Then in your readme add this:

~~~
[![Build Status](https://my-tc-proxy.com/bt1)](https://my-tc-proxy.com/bt1/status.png)
~~~


## Badges

This already come with badges but you can replace with your own badges.

The ones in the repo where generated with [http://shields.io](http://shields.io);

## Deploy to heroku

This come ready to deploy to heroku. After you clone the repo you can deploy as follow:

~~~bash
$ heroku create
$ heroku config:set BUILDTYPES=bt1,bt2,bt3
$ heroku config:set AUTH=someuser:somepass
$ heroku config:set TEAMCITY=http://url-to-tc.com
$ git push heroku master
~~~

## License

MIT - 2013 - Auth0 LLC
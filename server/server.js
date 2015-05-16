/*jslint
	browser: true, 	continue: true, devel: true,
	indent: 2, 		maxerr: 50, 	newcap: true,
	newcap: true,	nomen: true,	plusplus: true,
	regexp: true,	sloppy: true,	vars: false,
	white: true
*/

'use strict';

var http = require('http');
var path = require('path');
var express = require('express');
var sassMiddleware = require('node-sass-middleware');
var handlebarsPrecompiler = require('handlebars-precompiler');

var routes = require('./routes');

var app = express();
var server = http.createServer(app);

////////////////////////////////////////////////////////////////
//////////////////////// CONFIGURATION /////////////////////////

handlebarsPrecompiler.watchDir(
  path.resolve(__dirname, "../client/templates"),
  path.resolve(__dirname, "../client/javascript/templates.js"),
  ['handlebars', 'hbs']
);

app.configure('development', function() {
  app.use(sassMiddleware({
    src: path.resolve(__dirname, '../client/stylesheets'),
    dest: path.resolve(__dirname, '../client/stylesheets/compiled'),
    debug: true,
    prefix: '/stylesheets/compiled'
  }));
  app.use(express.logger());
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.resolve(__dirname, '../client')));
  app.use(app.router);
});

routes.configRoutes(app, server);

////////////////////////////////////////////////////////////////
///////////////////////// START SERVER /////////////////////////

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0");
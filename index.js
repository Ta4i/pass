var mongoose = require('mongoose');
var fs       = require('fs');
var chance   = new (require('chance'))();
var express  = require('express')
  , passport = require('passport')
  , ws       = require('ws').Server;

// Setup all

var app = express();

// Prepare Schemas
var models_path = __dirname + '/app/schemas'
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file);
});

// Prepare All using configs
var config_path = __dirname + '/app/config'
fs.readdirSync(config_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(config_path + '/' + file)(app, mongoose, passport, ws);
})

app.listen(3000);

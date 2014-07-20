var express = require('express');
var path    = require('path');

module.exports = function (app, config, passport) {
    app.engine('html', require('ejs').renderFile);
    app.set('views', path.resolve(__dirname, '../views'));
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    
    app.use(express.static(path.resolve(__dirname, '../../public')));
};

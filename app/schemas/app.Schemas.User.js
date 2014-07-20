/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , passportLocalMongoose = require('passport-local-mongoose');

/**
 * User Schema
 */

var UserSchema = new Schema({
    username : { type: String, default: '' },
    password : { type: String, default: '' },
    kittens  : { type: Array, default: []}
});

UserSchema.plugin(passportLocalMongoose);

mongoose.model('User', UserSchema)

var LocalStrategy = require('passport-local').Strategy;

module.exports = function (app, db, passport) {
  // serialize sessions
  var Account = db.model('User');
  passport.use(new LocalStrategy(Account.authenticate()));
  passport.serializeUser(Account.serializeUser());
  passport.deserializeUser(Account.deserializeUser());
}
  
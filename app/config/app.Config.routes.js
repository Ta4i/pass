module.exports = function(app, db, passport, ws){
    var Account = db.model('User');
    var fs = require('fs');
    var path = require('path');
    app.get('/', function (req, res) {
        if(req.user && req.user._id){
            res.redirect('/kittens/'+req.user._id);
            return;
        }
        res.render('app.Views.index.html');
    });

    app.get('/create', function(req, res) {
        res.render('app.Views.create.html');
    });

    app.post('/register', function(req, res) {
        Account.register(
            new Account({ username : req.body.username }),
            req.body.password,
            function(err, account) {
                if (err) {
                    res.redirect('/login');
                    return;
                }

                passport.authenticate('local')(req, res, function () {
                    res.redirect('/kittens/'+req.user._id);
                });
            }
        );
    });

    app.get('/login', function(req, res) {
        res.render('app.Views.login.html');
    });
    
    app.get('/kittens/:id', function(req, res) {
        var uid = req.params.id;
        if(req.user && req.user._id){
            res.render('app.Views.kittens.html', {
                name: req.user.username
            });
        }else{
            res.redirect('/');
        }
    });

    app.get('/kitty_type/png/:id', function(req, res) {
        var iid = req.params.id;
        var img = fs.readFileSync(path.resolve(__dirname, '../../public/img/kitty_' + iid + '.png'));
        res.writeHead(200, {'Content-Type': 'image/png' });
        res.end(img, 'binary');
    });

    app.post('/login', passport.authenticate('local'), function(req, res) {
        var user = JSON.stringify(req.user);
        res.redirect('/kittens/'+req.user._id);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/ping', function(req, res){
        res.send("pong!", 200);
    });
}
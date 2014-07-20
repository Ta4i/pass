var chance = require('chance')();

module.exports = function(app, db, passport, WebSocket){
    var Kitty = db.model('Kitty');
    var wss = new WebSocket({port: 8081});
    wss.on('connection', function(ws) {
        var id = '',
            user = null,
            intervals = {};
        ws.on('close', function(){
            Kitty.find({owner: id}, function(error, kittens){
                kittens.forEach(function(kitty){
                    clearInterval(intervals[kitty._id]);
                    intervals[kitty._id] = null;
                });
            });
        });
        ws.on('message', function(message) {
            var m = JSON.parse(message);
            switch(m.type){
                case 'start':
                    id = m.id;
                    var User = db.model('User');
                    user = User.findOne({_id : id},function(error, user){
                        Kitty.find({owner: id}, function(err, _kittens){
                            var response = {
                                type: 'start_done',
                                kittens : _kittens
                            };
                            ws.send(JSON.stringify(response));
                        });
                    });

                    Kitty.find({owner: id}, function(error, kittens){
                        kittens.forEach(function(kitty){
                            var time = Math.random() * 5 + 3;
                            intervals[kitty._id] = setInterval(function(){
                                kitty.mew(ws);
                            }, time * 1000);
                        });
                    });
                    break;
                case 'add_kitty':
                    var response = {
                        type  : 'added',
                        kitty : {
                            name : ''
                        }
                    };
                    var newKitty = new Kitty();
                    
                    newKitty.name  = chance.name({ prefix: true });
                    newKitty.birth = new Date();
                    newKitty.owner = id;
                    
                    var config = {};
                    
                    config.left = Math.random() * 100;
                    config.top  = Math.random() * 100;
                    
                    (function(){
                        config.hsl = get_random_color();
                        function rand(min, max) {
                            return min + Math.random() * (max - min);
                        }

                        function get_random_color() {
                            var h = rand(1, 360);
                            var s = rand(0, 100);
                            var l = rand(0, 100);
                            return 'hsl(' + h + ',' + s + '%,' + l + '%)';
                        }
                    })();
                    
                    config.type = Math.floor(Math.random()*3);
                    
                    newKitty.config = JSON.stringify(config);
                    
                    newKitty.save(function(error, kitty){
                        response.kitty = kitty;
                        ws.send(JSON.stringify(response));
                        var time = Math.random() * 5 + 3;
                        intervals[kitty._id] = setInterval(function(){
                            console.log('New kitty mew');
                            kitty.mew(ws);
                        }, time * 1000);
                    });
                    
                    break;
            }
        });
        
        function initMews(){
        }
        function stopMews(){
            Kitty.find({owner: id}, function(error, kittens){
                kittens.forEach(function(kitty){
                    kitty.stopMewing();
                });
            });
        }
        
        function mew(id){
            Kitty.findOne({_id: id}, function(kitty){
                var response = {
                    type : 'mew',
                    id   : kitty._id
                };
                ws.send(JSON.stringify(response));
            });
        };
    });
};
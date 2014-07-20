$(function(){
    // Classes
    function WSRouter(kittyManager, id){
        this.id = '';
        this.kittyManager = kittyManager;
    };

    WSRouter.prototype.onMessage = function(msg){
        var data    = JSON.parse(msg.data);
        var status  = data.type;
        switch(status){
            case 'start_done':
                console.log('START', data);
                var kittens = data.kittens;
                this.kittyManager.set(kittens);
                break;
            case 'added':
                var kitty = data.kitty;
                this.kittyManager.add(kitty);
                console.log('Kitty added', kitty);
                break;
            case 'mew':
                console.log('Kitty say mew', data.id);
                
                var $kitty = $('#' + data.id + ' .mew');

                $kitty.addClass('now');
                setTimeout(function(){
                    $kitty.addClass('anim');
                },1);
                
                setTimeout(function(){
                    $kitty.removeClass('now');
                    setTimeout(function(){
                        $kitty.removeClass('anim');
                    },1000);
                },1000);
                
                break;
        }
    };
    
    function Kitty(options){
        _.extend(this, options);
        this.config = JSON.parse(options.config);
        this.options = options;
    }
    Kitty.prototype.render = function(){
        this.$name = $('<div class="name"></div>');
        this.$mew  = $('<div class="mew">Mew</div>');
        
        this.$el = $('<div id="'+this._id+'" class="kitty type_' + this.config.type + '"></div>');
        
        this.$name.html(this.name);
        
        this.$el.append(this.$mew);
        this.$el.append(this.$name);
        this.$el.css({
            'border-color' : this.config.hsl
        });
        this.$name.css({
            'background-color' : this.config.hsl
        });
        this.$mew.css({
            'background-color' : this.config.hsl
        });
        
        return this;
    };

    function KittyManager(){
        this.kittens = [];
        this.$kittens = [];
        this.$room = $('<div id="room"></div>');
        $body.append(this.$room);
    };
    KittyManager.prototype.set = function(kittens){
        var self = this;
        this.kittens = [];
        kittens.forEach(function(kitty){
            var kitty = new Kitty(kitty);
            self.kittens.push(kitty);
        });
        this.render();
    };
    KittyManager.prototype.add = function(kitty){
        this.kittens.push(new Kitty(kitty));
        this.render();
    };
    KittyManager.prototype.render = function(){
        var self = this;
        this.$room.empty();
        this.$kittens = [];
        this.kittens.forEach(function(kitty, i){
            var $kitty = kitty.render().$el;
            var config = kitty.config;
            var left = config.left + '%';
            var top = config.top + '%';
            
            $kitty.css({
                left: left,
                top : top
            });
            
            self.$kittens.push($kitty);
            self.$room.append($kitty);

            console.log(kitty);
        });
    };

    function AppController(id, socket, kittyManager, wsRouter){
        this.id      = id;
        this.socket  = socket;
        this.manager = kittyManager;
        this.router  = wsRouter;

        this.render();
        this.applyEvents();
    };
    AppController.prototype.addKitty = function(){
        var message = {
            id   : this.id,
            type : 'add_kitty'
        };

        this.socket.send(JSON.stringify(message));
    };
    AppController.prototype.render = function(){
        if(!this.$addButton || this.$addButton.length === 0){
            this.$addButton = $('<button id="add">+</button>');
            $body.append(this.$addButton);
        }
    };
    AppController.prototype.applyEvents = function(){
        var self = this;
        if(this.$addButton && this.$addButton.length !== 0){
            console.log('Add clicked');
            this.$addButton.click(function(){
                self.addKitty();
            });
        }
    };
    
    
    
    var $body = $('body').eq(0);
    
    var location = window.location.href;
    var levels = location.split('/');
    var id = levels[levels.length - 1];
    var socket = new WebSocket("ws://localhost:8081");
    var kittyManager = new KittyManager();
    var wsRouter = new WSRouter(kittyManager, id);
    var controller = new AppController(id, socket, kittyManager, wsRouter);
    
    _.bindAll(wsRouter, 'onMessage');
    _.bindAll(controller, 'addKitty');
    
    socket.onopen = function(){
        initWS();
        console.log("Socket has been opened");
    };
    
    function initWS(){
        socket.onmessage = wsRouter.onMessage;
        var initData = {
            id: id,
            type: 'start'
        };
        socket.send(JSON.stringify(initData));
    };

});


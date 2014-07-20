module.exports = function(app, db, passport){
    db.connect('mongodb://localhost/kitt');

    db.connection.on('error', console.error.bind(console, 'connection error:'));

    db.connection.once('open', function callback () {
        console.log('Connected to "kitt" db');
    });

    return db;
}
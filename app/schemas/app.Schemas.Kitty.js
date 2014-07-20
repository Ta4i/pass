/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/**
 * Kitty Schema
 */

var interval = null;

var KittySchema = new Schema({
    name   : { type: String, default: '' },
    birth  : { type: Date,   default: Date.now },
    mews   : { type: Number, default: 0 },
    config : { type: String, default: '' },
    owner  : { type: String, default: '' }
});

KittySchema.methods.mew = function(ws){
    this.mews++;
    var response = {
        type: 'mew',
        id : this._id,
        mews : this.mews
    };
    this.save();
    console.log(this.name + ' say mew');
    ws.send(JSON.stringify(response));
};


mongoose.model('Kitty', KittySchema);

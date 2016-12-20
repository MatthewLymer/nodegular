'use strict';

var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1000
  }
});

var productSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
    maxlength: 250
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  created: {
    type: Date,
    required: true, 
    default: Date.now
  },
  comments: [commentSchema],
  _prices: [{
    amount: {
        type: Number,
        required: true,
        min: 0.0
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
  }]
});

productSchema
    .virtual('price')
    .get(function () {
        var price = this._prices[this._prices.length - 1];
        return price !== undefined ? price.amount : undefined;
    });
    
productSchema.methods.setPrice = function (amount) {
  this._prices.push({amount: amount});  
};

module.exports = mongoose.model('Product', productSchema);

'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  photoId: String,
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

schema.index({photoId: 1, owner: 1}, {unique:true});

module.exports = mongoose.model('LikedPhoto', schema);
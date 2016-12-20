/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /likedPhotos              ->  index
 * POST    /likedPhotos              ->  create
 * DELETE  /likedPhotos/:id          ->  destroy
 */

'use strict';

var LikedPhoto = require('./likedPhoto.model');
var mongoose = require('mongoose');

exports.index = function(req, res) {
  var query = {
    owner: mongoose.Types.ObjectId(req.user._id)
  };

  LikedPhoto.find(query, function (err, photos) {
    if(err) { return handleError(res, err); }
    return res.json(200, photos);
  });
};

exports.create = function(req, res) {
  var likedPhoto = {
    photoId: req.body.photoId, 
    owner: mongoose.Types.ObjectId(req.user._id)
  };

  LikedPhoto.create(likedPhoto, function(err, photo) {
    if(err) { return handleError(res, err); }
    return res.json(201, photo);
  });
};

exports.destroy = function(req, res) {
  var query = {
    owner: mongoose.Types.ObjectId(req.user._id),
    photoId: req.params.id
  };
  
  LikedPhoto.findOne(query, function (err, photo){
    if (err) { return handleError(res, err); }
    
    photo.remove(function(err){
      if(err) { return handleError(res, err); }
      return res.send(204);
    });    
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Try and attach auth user to request
 */
function attachAuthUser() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      
      if (req.headers.authorization) {
        validateJwt(req, res, next)
        return;
      }
      
      next();
    })
    // Attach user to request
    .use(function(req, res, next) {
      if (!req.user) return next();
      
      var userId = req.user._id;
      delete req.user;
      
      User.findById(userId, function (err, user) {
        if (err) return next(err);
        if (user) req.user = user;
        next();
      });
    });
};

/**
 * Validates that request contains auth user
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    .use(attachAuthUser())
    .use(function(req, res, next) {
      if (!req.user) return res.send(401);
      next();
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.send(403);
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) return res.json(404, { message: 'Something went wrong, please try again.'});
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.attachAuthUser = attachAuthUser;
exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
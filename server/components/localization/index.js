'use strict';

var assert = require('assert');
var messages = require('./messages');

module.exports = {
  get: function (key) {
    var message = messages[key];
    assert(message !== undefined, 'Localization key not found: ' + key);
    return message;
  }
};
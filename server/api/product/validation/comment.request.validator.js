'use strict';

var validate = require('validate.js');
validate.Promise = require('promise');
var strings = require('../../../components/localization');

var getMessageFunc = function (key) {
  return function () {
    return '^' + strings.get(key);
  };
};

var constraints = {
  name: {
    presence: {message: getMessageFunc('nameIsRequired') },
    length: {
      minimum: 2,
      maximum: 100,
      tooLong: getMessageFunc('nameMustNotExceed100Characters'),
      tooShort: getMessageFunc('nameMustBe2Characters')
    }
  },
  message: {
    presence: {message: getMessageFunc('messageIsRequired') },
    length: {
      minimum: 6,
      maximum: 1000,
      tooLong: getMessageFunc('messageMustNotExceed1000Characters'),
      tooShort: getMessageFunc('messageMustBe6Characters')
    }    
  }
}

exports.validate = function (value) {  
  return validate.async(value, constraints)
};
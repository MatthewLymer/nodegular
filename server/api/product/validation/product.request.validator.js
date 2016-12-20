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
    presence: {message: getMessageFunc('nameIsRequired') }
  },
  description: {
    presence: {message: getMessageFunc('descriptionIsRequired') }
  },
  price: {
    presence: {message: getMessageFunc('priceIsRequired') },
    numericality: {
      // notValid: getMessageFunc('priceMustBeNumeric'),
      greaterThan: 0,
      notGreaterThan: getMessageFunc('priceMustBeGreaterThanZero')
    }
  }
}

exports.validate = function (value) {  
  return validate.async(value, constraints)
};
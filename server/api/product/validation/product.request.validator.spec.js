'use strict';

var should = require('should');
var validator = require('./product.request.validator');
var strings = require('../../../components/localization');

describe('Product Request Validator', function() {
  it('should require name', function (){
    return validateAndAssertError(
      {}, 
      'name', 
      strings.get('nameIsRequired'));
  });
  
  it('should require description', function (){
    return validateAndAssertError(
      {}, 
      'description', 
      strings.get('descriptionIsRequired'));
  });  
  
  it('should require price', function (){
    return validateAndAssertError(
      {}, 
      'price', 
      strings.get('priceIsRequired'));
  });
  
  it('should have price greater than zero', function (){
    return validateAndAssertError(
      {price:-1}, 
      'price', 
      strings.get('priceMustBeGreaterThanZero'));
  });
  
  it('should be valid', function (){
    var model = {
      name: 'Widget',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      price: 5.99
    };
    
    return validator.validate(model);
  });
});

function validateAndAssertError(value, field, message) {
  return validator.validate(value)
    .then(function(){should.fail('expected an error');})
    .catch(function(errors){
      Object.keys(errors).should.containEql(field);
      errors[field].should.containEql(message);
    });
}
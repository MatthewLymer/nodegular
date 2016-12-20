'use strict';

var should = require('should');
var validator = require('./comment.request.validator');
var strings = require('../../../components/localization');

describe('Comment Request Validator', function() {
  
  it('should require name', function (){
    return validateAndAssertError(
      {}, 
      'name', 
      strings.get('nameIsRequired'));
  });
  
  it('should have name of at least 2 characters', function (){
    return validateAndAssertError(
      {name:'A'}, 
      'name', 
      strings.get('nameMustBe2Characters'));    
  });
  
  it('should have name of at most 100 characters', function (){
    return validateAndAssertError(
      {name: Array(101 + 1).join('A')}, 
      'name', 
      strings.get('nameMustNotExceed100Characters'));    
  });  
  
  it('should require message', function (){
    return validateAndAssertError(
      {}, 
      'message', 
      strings.get('messageIsRequired'));
  });  
  
  it('should have message of at least 6 characters', function (){
    return validateAndAssertError(
      {message: 'AAAAA'}, 
      'message', 
      strings.get('messageMustBe6Characters'));    
  });
  
  it('should have message of at most 1000 characters', function (){
    return validateAndAssertError(
      {message: Array(1001 + 1).join('A')}, 
      'message', 
      strings.get('messageMustNotExceed1000Characters'));    
  });    
  
  it('should be valid', function (){
    var model = {
      name: 'Po',
      message: 'Great!'
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
'use strict';

var should = require('should');
var app = require('../../app');
var Product = require('./product.model');
var mochaHelpers = require('../../components/mochaHelpers');

describe('Product Model', function() {  
  beforeEach(function (done) {
    Product.remove().exec().then(function(){
      done();
    });    
  });

  it('should start with empty collection', function (done) {
    Product.find({}, function (errors, products) {
      should.not.exist(errors);
      products.should.be.empty;
      done();
    });
  });
  
  mochaHelpers.cases('should not save if required field is missing', ['name', 'description'], function (field, done) {
    var product = new Product();
    
    product.save(function (error){
      var fieldError = error.errors[field];
      should.exist(fieldError);
      fieldError.type.should.be.equal('required');
      done();
    });
  });
  
  it('should save product with required fields provided', function (done){
    var product = new Product({
      name: 'Fizz',
      description: "It's fizzy"
    });
            
    product.save(function (error) {
      should.not.exist(error);
      done();
    });
  });
  
  it('should initialize to an undefined price', function (){
    var product = new Product();
    should.not.exist(product.price);
  });
  
  it('should set price to last set price', function (){
    var amounts = [10, 25, 50];
    var product = new Product();
    
    amounts.forEach(function (amount){
      product.setPrice(amount);
      product.price.should.equal(amount);
    });
  });
  
  it('should record price history', function (){
    var amounts = [10, 25, 50];
    var product = new Product();
    
    amounts.forEach(function (amount, index) {
      product.setPrice(amount);
      var price = product._prices[index];
      
      price.amount.should.equal(amount);
      price.date.should.be.approximately(new Date(), 100);
    });
    
    product._prices.length.should.equal(amounts.length);
  });
  
  it('should initialize with empty comments collection', function (){
    var product = new Product();
    
    product.comments.should.be.empty;
  });
  
  mochaHelpers.cases('should not save if require comment field is missing', ['name', 'message'], function (field, done) {
    var product = new Product();
    
    product.comments.push({});
        
    product.save(function (error){      
      var fieldError = error.errors['comments.0.' + field];
      should.exist(fieldError);
      fieldError.type.should.be.equal('required');
      done();
    });
  });  
});

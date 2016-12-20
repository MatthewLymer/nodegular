'use strict';

var should = require('should');
var Product = require('./product.model');
var projector = require('./product.projector');
var mochaHelpers = require('../../components/mochaHelpers');

describe('Product Projector', function() {
  
  describe('projectForAnonymous', function(){
    
    it('should map given fields', function (done){
      var name = 'Widget';
      var description = 'Lorem Ipsum';
      var price = 5.99;
      
      var myProduct = new Product({name:name, description: description});
      myProduct.setPrice(price);
      
      myProduct.save(function (err, product){
        var projection = projector.projectForAnonymous(product);
        
        projection.id.should.equal(product.id);
        projection.name.should.equal(name);
        projection.description.should.equal(description);
        projection.price.should.equal(price);
        
        done();                
      });            
    });
    
    it('should not expose extra fields', function (done) {
      var validFields = ['id', 'price', 'description', 'name'];      
     
      var myProduct = new Product({name:'a', description:'b'});
      myProduct.setPrice(1);
      
      myProduct.save(function (err, product){
        var projection = projector.projectForAnonymous(product);
        assertOnlyContainsFields(projection, validFields);
        done();
      });
    });
        
  });
  
  describe('projectForAdmin', function(){
    
    it('should map given fields', function (done){
      var name = 'Widget';
      var description = 'Lorem Ipsum';
      var price1 = 5.99;
      var price2 = 10.99;
      
      var myProduct = new Product({name:name, description: description});
      myProduct.setPrice(price1);
      myProduct.setPrice(price2);
      
      myProduct.save(function (err, product){
        var projection = projector.projectForAdmin(product);
        
        projection.id.should.equal(product.id);
        projection.name.should.equal(name);
        projection.description.should.equal(description);
        projection.price.should.equal(price2);
        
        projection.priceHistory[0].amount.should.equal(price1);
        projection.priceHistory[0].date.should.be.approximately(new Date(), 100);
        projection.priceHistory[1].amount.should.equal(price2);
        projection.priceHistory[1].date.should.be.approximately(new Date(), 100);
        
        done();                
      });            
    });
    
    it('should not expose extra fields', function (done) {
      var validFields = ['id', 'price', 'description', 'name', 'priceHistory'];      
     
      var myProduct = new Product({name:'a', description:'b'});
      myProduct.setPrice(1);
      
      myProduct.save(function (err, product){
        var projection = projector.projectForAdmin(product);
        assertOnlyContainsFields(projection, validFields);
        done();
      });
    });    
        
  });
  
  describe ('projectComment', function (){
    
    it('should map given fields', function (){
      var id = 'abc123';
      var name = 'Steve McQueen';
      var message = 'Lorem Ipsum';
      
      var comment = {
        id: id,
        name: name,
        message: message
      };
            
      var projection = projector.projectComment(comment);
      
      projection.id.should.equal(id);
      projection.name.should.equal(name);
      projection.message.should.equal(message);
    });
    
    it('should not expose extra fields', function () {
      var validFields = ['id', 'name', 'message'];      
      
      var comment = {
        foo: 'bar',
        wizz: 'bang'
      };
      
      var projection = projector.projectComment(comment);
      assertOnlyContainsFields(projection, validFields);
    });
    
  });
    
});

function assertOnlyContainsFields(projection, fields) {
  Object.keys(projection).forEach(function (key){
    fields.should.containEql(key)
  });  
}
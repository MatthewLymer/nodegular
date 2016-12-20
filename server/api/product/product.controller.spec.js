'use strict';

var should = require('should');
var mockery = require('mockery');

describe('Product Controller', function() {
  var Product, productConstructor, projector, controller;

  beforeEach(function() {
    Product = function () {
      productConstructor.apply(this, arguments);
    };
    
    productConstructor = function (){};    
    projector = {};
    
    mockery.enable({ useCleanCache: true });    
    mockery.registerMock('./product.model', Product);
    mockery.registerMock('./product.projector', projector);
    mockery.registerAllowable('./product.controller');
    controller = require('./product.controller');
    mockery.deregisterAll();
    mockery.disable();        
  });
  
  describe('index', function(){
    
    it('should return empty array if no products exist', function(done){
      Product.find = function (query, callback) {
        query.should.be.empty;
        setTimeout(function(){
          callback(null, []);  
        });
      };
      
      projector.projectForAnonymous = function () {
        should.fail();
      };
      
      var response = AssertingResponseBuilder.forJson(
        200, 
        function (data) { 
          data.should.be.array;
          data.should.be.empty;
        }, 
        done);
      
      controller.index({}, response);
    });
    
    it('should return all products projected for anonymous', function (done){
      Product.find = function (query, callback) {
        query.should.be.empty;
        setTimeout(function(){
          callback(null, ['a', 'b', 'c']);  
        });
      };
      
      projector.projectForAnonymous = function (product) {
        if (product == 'a') return 1;
        if (product == 'b') return 2;
        if (product == 'c') return 3;
      };
      
      var response = AssertingResponseBuilder.forJson(
        200, 
        function (data) { 
          data.should.be.array;
          data.length.should.equal(3);
          data[0].should.equal(1);
          data[1].should.equal(2);
          data[2].should.equal(3);
        }, 
        done);
      
      controller.index({}, response);      
    });
    
  });
  
  
  describe('show', function(){
    
    it ('should give 404 if no product found', function (done){
      var productId = 'abc123';
      
      Product.findOne = function (query, callback) {
        query._id.should.equal(productId);
        setTimeout(function(){ callback(null, null); });
      };
      
      var request = { params: { id: productId } };
      
      var response = AssertingResponseBuilder.forStatus(404, 'Not Found', done);
      
      controller.show(request, response);        
    });
    
    it ('should project product for anonymous', function (done){
      var productId = 'abc123';
      
      Product.findOne = function (query, callback) {
        query._id.should.equal(productId);
        setTimeout(function(){ callback(null, 'a'); });
      };
      
      projector.projectForAnonymous = function (product) {
        product.should.equal('a');
        return 1;
      }
      
      var request = { 
        params: { 
          id: productId 
        } 
      };
      
      var response = AssertingResponseBuilder.forJson(
        200, 
        function (data) { data.should.equal(1); }, 
        done);
      
      controller.show(request, response);        
    });
    
    it ('should project product for administrator', function (done){
      var productId = 'abc123';
      
      Product.findOne = function (query, callback) {
        query._id.should.equal(productId);
        setTimeout(function(){ callback(null, 'b'); });
      };
      
      projector.projectForAdmin = function (product) {
        product.should.equal('b');
        return 2;
      }
      
      var request = { 
        params: { 
          id: productId 
        },
        user: {
          role: 'admin'
        }
      };
      
      var response = AssertingResponseBuilder.forJson(
        200, 
        function (data) { data.should.equal(2); }, 
        done);       
      
      controller.show(request, response);        
    });    
        
          
  });
  
  describe('create', function(){
    
    it('should try and save body', function (done){
      var body = {
        name: 'foo',
        price: 5.99
      };
      
      var wasPriceSet = false;      
      
      productConstructor = function (data) {
        data.should.equal(body);
        
        this.setPrice = function (price) {
          price.should.equal(body.price);
          wasPriceSet = true;
        };
        
        this.save = function (){
          wasPriceSet.should.equal(true);
          done();
        }
      };
            
      var request = { 
        body: body
      };     
     
      controller.create(request, null);      
    });
    
    it('should respond with mongoose errors', function (done){
      var body = {};
      var errors = {};
      
      productConstructor = function (data) {
        this.setPrice = function (price) {};
        this.save = function (callback){
          callback(errors, null);
        }
      };
            
      var request = { 
        body: body
      };     
      
      var response = AssertingResponseBuilder.forJson(
        422, 
        function (data) { data.should.equal(errors); }, 
        done);
     
      controller.create(request, response);      
    });
    
    it('should respond new product id', function (done){
      var body = {};
      var newProductId = 'abc123';
      
      productConstructor = function (data) {
        this.setPrice = function (price) {};
        this.save = function (callback){
          callback(null, {id:newProductId});
        }
      };
            
      var request = { 
        body: body
      };     
      
      var response = AssertingResponseBuilder.forJson(
        201, 
        function (data) { data.id.should.equal(newProductId); }, 
        done);     
     
      controller.create(request, response);      
    });
    
  });
  
  
  describe('update', function (){
    
    it ('should give 404 if no product found', function (done){
      var productId = 'abc123';
      
      Product.findOne = function (query, callback) {
        query._id.should.equal(productId);
        setTimeout(function(){ callback(null, null); });
      };
      
      var request = { params: { id: productId } };
      
      var response = AssertingResponseBuilder.forStatus(404, 'Not Found', done);
      
      controller.update(request, response);        
    });    
    
    it ('should update product and save', function (done){
      var wasPriceSet = false;
      
      var body = {
        name: 'fizz',
        description: 'buzz',
        price: 99.99
      };
      
      var product = {
        setPrice: function (price) {
          price.should.equal(body.price);
          wasPriceSet = true; 
        },
        save: function () {
          this.name.should.equal(body.name);
          this.description.should.equal(body.description);
          wasPriceSet.should.equal(true);
          done();
        }
      };
      
      Product.findOne = function (query, callback) {
        setTimeout(function(){ callback(null, product); });
      };      
      
      var request = {
        params: {id:'abc123'},
        body: body
      };
            
      controller.update(request, null);  
    });
    
    it('should not update price if price has not changed', function (done){
      var body = {
        price: 49.99
      };
      
      var product = {
        price: body.price,
        setPrice: function (price) {
          should.fail();
        },
        save: function () {
          done();
        }
      };
      
      Product.findOne = function (query, callback) {
        setTimeout(function(){ callback(null, product); });
      };      
      
      var request = {
        params: {id:'abc123'},
        body: body
      };
            
      controller.update(request, null);        
    });
    
    it('should respond with mongoose errors', function (done){
      var errors = {};      
      var body = {};
      
      var product = {
        setPrice: function (price) {},
        save: function (callback) {
          setTimeout(function(){callback(errors, null);});
        }
      };
      
      Product.findOne = function (query, callback) {
        setTimeout(function(){ callback(null, product); });
      };
      
      var request = {
        params: {id:'abc123'},
        body: body
      };
      
      var response = AssertingResponseBuilder.forJson(
        422, 
        function (data) { data.should.equal(errors); }, 
        done);     
            
      controller.update(request, response);        
    });
    
    it('should respond with 200 if update successful', function (done){
      var body = {};
      
      var product = {
        setPrice: function (price) {},
        save: function (callback) {
          setTimeout(function(){callback(null, null);});
        }
      };
      
      Product.findOne = function (query, callback) {
        setTimeout(function(){ callback(null, product); });
      };
      
      var request = {
        params: {id:'abc123'},
        body: body
      };
      
      var response = AssertingResponseBuilder.forStatus(204, 'No Content', done);
            
      controller.update(request, response);       
    });
    
  });
    
  describe('destroy', function (){
  
    it('should respond with 404 if no product found', function (done){
      var productId = 'def456';
      
      Product.findOne = function (query, callback) {
        query._id.should.equal(productId);
        setTimeout(function(){ callback(null, null); });
      };
      
      var request = { params: { id: productId } };
      
      var response = AssertingResponseBuilder.forStatus(404, 'Not Found', done);
            
      controller.destroy(request, response);         
    });
    
    it('should respond with 204 product was removed', function (done){
      var product = {
        remove: function (callback) {
          setTimeout(function(){callback(null, null);});
        }
      };      
      
      Product.findOne = function (query, callback) {
        setTimeout(function(){ callback(null, product); });
      };
      
      var request = { params: { id: 'abc123' } };
      
      var response = AssertingResponseBuilder.forStatus(204, 'No Content', done);
            
      controller.destroy(request, response);         
    });
    
  });
  
  describe('indexComment', function(){
    
    it('should give 404 if no product is found', function (done){
      assertCommentMethodGives404('indexComment', done);       
    });
    
    it('should give empty array if no comments exist', function (done){
      var productId = 'kik123';
      
      Product.findOne = function (query, callback) {
        query._id.should.equal(productId);
        setTimeout(function(){ callback(null, {comments:[]}); });
      };
      
      projector.projectComment = function () {
        should.fail();
      };      
      
      var request = { params: { productId: productId } };
      
      var response = AssertingResponseBuilder.forJson(
        200, 
        function (comments){ comments.should.be.empty; }, 
        done);
      
      controller.indexComment(request, response);         
    });
    
    it('should project all comments', function (done){
      var productId = '20je16b';
      
      Product.findOne = function (query, callback) {
        query._id.should.equal(productId);
        setTimeout(function(){ callback(null, {comments:['a','b','c']}); });
      };
      
      projector.projectComment = function (comment) {
        if (comment == 'a') return 1;
        if (comment == 'b') return 2;
        if (comment == 'c') return 3;
      };      
      
      var request = { params: { productId: productId } };
      
      var response = AssertingResponseBuilder.forJson(
        200, 
        function (comments){ 
          comments.length.should.equal(3);
          comments[0].should.equal(1);
          comments[1].should.equal(2);
          comments[2].should.equal(3); 
        }, 
        done);
      
      controller.indexComment(request, response);        
    });
    
  });
  
  describe('createComment', function (){
    
    it('should give 404 if no product found', function (done){
      assertCommentMethodGives404('createComment', done);       
    });
    
    it('should try and save comment', function (done){
      var body = {};
      
      var product = {
        comments: [{},{}],
        save: function () {
          this.comments.length.should.equal(3);
          this.comments[2].should.equal(body);
          done();
        }
      };
      
      Product.findOne = function (query, callback) {
        setTimeout(function(){ callback(null, product); });
      };
      
      var request = { params: { productId: 'abc123' }, body: body };
      
      controller.createComment(request, null);      
    });
    
    it('should respond back with saving failures', function (done){
      var errors = {};
      
      var product = {
        comments: [],
        save: function (callback) {
          setTimeout(function(){callback(errors, null);});
        }
      };
      
      Product.findOne = function (query, callback) {
        setTimeout(function(){ callback(null, product); });
      };
      
      var request = { params: { productId: 'abc123' }, body: {} };
      
      var response = AssertingResponseBuilder.forJson(
        422, 
        function (data) {data.should.equal(errors)}, 
        done);      
      
      controller.createComment(request, response);       
    });
    
    it ('should respond back with newest comment id', function (done){
      var newCommentId = 25415;
      
      var product = {
        comments: [{}, {}, {}],
        save: function (callback) {
          this.comments[3].id = newCommentId;
          setTimeout(function(){callback(null, product);});
        }
      };
      
      Product.findOne = function (query, callback) {
        setTimeout(function(){ callback(null, product); });
      };
      
      var request = { params: { productId: '45682' }, body: {} };
      
      var response = AssertingResponseBuilder.forJson(
        201, 
        function (data) {data.id.should.equal(newCommentId)}, 
        done);      
      
      controller.createComment(request, response);         
    });
    
  });
  
  describe('destroyComment', function (){
    
    it('should give 404 if no product found', function (done){
      assertCommentMethodGives404('destroyComment', done);
    });
    
    it('should remove comment and save', function (done){
      var productId = '8675309';
      var commentId = '384814';
      
      var product = {
        comments: [{id:'abc'},{id:commentId},{id:'def'}],
        save: function (callback) {
          this.comments.length.should.equal(2);
          this.comments[0].id.should.equal('abc');
          this.comments[1].id.should.equal('def');
          setTimeout(function(){
            callback();
          });
        }
      }
      
      Product.findOne = function (query, callback) {
        query._id.should.equal(productId);
        setTimeout(function(){ callback(null, product); });
      };
      
      var request = { params: { productId: productId, id: commentId } };
      
      var response = AssertingResponseBuilder.forStatus(204, 'No Content', done);
      
      controller.destroyComment(request, response);         
    });
    
  });
  
  function assertCommentMethodGives404(method, done) {
    var productId = 'def456';
    
    Product.findOne = function (query, callback) {
      query._id.should.equal(productId);
      setTimeout(function(){ callback(null, null); });
    };
    
    var request = { params: { productId: productId } };
    
    var response = AssertingResponseBuilder.forStatus(404, 'Not Found', done);
    
    controller[method](request, response);       
  };
  
});

var AssertingResponseBuilder = {
  forJson: function (status, comparer, done) {
    should.exist(status);
    should.exist(comparer);
    should.exist(done);
    
    return {
      json: function (inStatus, inObject) {
        inStatus.should.equal(status);
        comparer(inObject);
        done();
      }
    };
  },
  forStatus: function (status, content, done) {
    should.exist(status);
    should.exist(content);
    should.exist(done);
        
    return {
      status: function (inStatus) {
        inStatus.should.equal(status);
        return {
          send: function (inContent) {
            inContent.should.equal(content);
            done();
          }
        };       
      }
    }
  }
};
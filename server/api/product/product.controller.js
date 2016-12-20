'use strict';

var Product = require('./product.model');
var projector = require('./product.projector');

exports.index = function (request, response) {
  Product.find({}, function (err, products) {
    var data = products.map(projector.projectForAnonymous);
    response.json(200, data);
  }); 
};

exports.show = function (request, response) {
  Product.findOne({_id: request.params.id}, function (err, product) {
    if (!product) {
      response.status(404).send('Not Found');  
      return;
    }
    
    var isAdmin = request.user && request.user.role === 'admin';
    var project = projector[isAdmin ? 'projectForAdmin' : 'projectForAnonymous'].bind(projector);
    
    response.json(200, project(product));
  });
};

exports.create = function (request, response) {
  var newProduct = new Product(request.body);

  newProduct.setPrice(request.body.price);
  
  newProduct.save(function (err, product) {
    if (err) {
      response.json(422, err);
      return;
    }
    
    response.json(201, {id: product.id});
  });
};

exports.update = function (request, response) {
  Product.findOne({_id: request.params.id}, function (err, product){
    if (!product) {
      response.status(404).send('Not Found');
      return;
    }
    
    var body = request.body;
        
    product.name = body.name;
    product.description = body.description;
    
    if (product.price != body.price) {
      product.setPrice(body.price);
    }
    
    product.save(function (err){
      if (err) {
        response.json(422, err);
        return;
      }
      
      response.status(204).send('No Content');      
    });    
  });
};

exports.destroy = function (request, response) {
  Product.findOne({_id: request.params.id}, function (err, product) {
    if (!product) {
      response.status(404).send('Not Found');
      return;
    }
    
    product.remove(function (){
      response.status(204).send('No Content');
    });
  });
};

exports.indexComment = function (request, response) {
  Product.findOne({_id: request.params.productId}, function (err, product) {
    if (!product) {
      response.status(404).send('Not Found');
      return;
    }
    
    var data = product.comments.map(projector.projectComment);    
    response.json(200, data);
  });
};

exports.createComment = function (request, response) {
  Product.findOne({_id: request.params.productId}, function (err, product) {
    if (!product) {
      response.status(404).send('Not Found');
      return;
    }
    
    product.comments.push(request.body);
    
    product.save(function (err, product){
      if (err) {
        response.json(422, err);
        return;
      }
      
      var commentId = product.comments[product.comments.length-1].id;
      
      response.json(201, {id: commentId}); 
    });
  });
};

exports.destroyComment = function (request, response) {
  Product.findOne({_id: request.params.productId}, function (err, product) {
    if (!product) {
      response.status(404).send('Not Found');
      return;
    }
    
    for (var i = 0; i < product.comments.length; i++) {
      if (product.comments[i].id == request.params.id) {
        product.comments.splice(i, 1);
        break;         
      }
    }
    
    product.save(function (err){
      response.status(204).send('No Content');      
    });
  });  
};
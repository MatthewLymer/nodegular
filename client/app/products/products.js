'use strict';

angular.module('nodegularTestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('products', {
        url: '/products',
        templateUrl: 'app/products/products.html',
        controller: 'ProductsController'
      });
      
    $stateProvider.state('productsedit', {
      url: '/products/edit/:id',
      templateUrl: 'app/products/modify/modifyproduct.html',
      controller: 'ModifyProductController',
      authenticate: true      
    });      
      
    $stateProvider.state('productsadd', {
      url: '/products/add',
      templateUrl: 'app/products/modify/modifyproduct.html',
      controller: 'ModifyProductController',
      authenticate: true      
    });
    
    $stateProvider.state('productsview', {
      url: '/products/view/:id',
      templateUrl: 'app/products/view/viewproduct.html',
      controller: 'ViewProductController'
    });
  });
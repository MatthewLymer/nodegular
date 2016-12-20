'use strict';

angular.module('nodegularTestApp').controller('ProductsController', function ($scope, Product, Auth) {
  $scope.products = [];
  
  $scope.isAdmin = function () {
    return Auth.isAdmin();
  };
  
  Product.getAll().then(function (products) {
    $scope.products = products;
  });
});
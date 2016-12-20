'use strict';

angular.module('nodegularTestApp').controller('ModifyProductController', function ($scope, Product, $stateParams, $location, Modal) {
  var isEditMode = !!$stateParams.id;  
  
  $scope.product = {};
  $scope.editProductName = '';
  $scope.errors = {};
  
  if (isEditMode) {
    Product.get($stateParams.id).then(function(product){
      $scope.product = product;
      $scope.editProductName = product.name;      
    });
  };
  
  $scope.isEditMode = function () {
    return isEditMode;
  };
 
  $scope.submit = function (form) {
    $scope.submitted = true;
    
    if (!form.$valid) {
      return;
    }
    
    var onFulfilled = function () {
      $location.path('/products');
    };
    
    var onRejected = function (response) {
      $scope.errors = {};
      
      angular.forEach(response.data, function(errors, field) {
        form[field].$setValidity('mongoose', false);
        $scope.errors[field] = errors[0];
      });    
    };     
    
    var promise = isEditMode 
      ? Product.put($stateParams.id, $scope.product)
      : Product.post($scope.product);
      
    promise.then(onFulfilled, onRejected);
  };
  
  $scope.delete = function () {
    var deleteModal = Modal.confirm.delete(function(){
      Product.delete($stateParams.id).then(function(){
        $location.path('/products');
      });      
    });
    
    deleteModal($scope.editProductName);
  };
});
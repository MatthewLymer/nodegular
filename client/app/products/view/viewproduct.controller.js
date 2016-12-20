'use strict';

angular.module('nodegularTestApp').controller('ViewProductController', function ($scope, $stateParams, Product, Auth, Modal) {
  $scope.comment = {};
  $scope.comments = [];
  
  $scope.isAdmin = function () {
    return Auth.isAdmin();
  };
  
  Product.get($stateParams.id).then(function (product){
    $scope.product = product;
  });
  
  Product.getComments($stateParams.id).then(function (comments){
    $scope.comments = comments;
  });
  
  $scope.addComment = function (form) {
    $scope.submitted = true;
    
    if (!form.$valid) {
      return;
    }
    
    var promise = Product.postComment($stateParams.id, $scope.comment);
    
    var onFulfilled = function (response) {
      $scope.submitted = false;
      var newComment = angular.copy($scope.comment);
      newComment.id = response.id;
      $scope.comments.push(newComment);
      $scope.comment = {};
    };
    
    var onRejected = function (response) {
      $scope.errors = {};
      
      angular.forEach(response.data, function(errors, field) {
        form[field].$setValidity('mongoose', false);
        $scope.errors[field] = errors[0];
      });    
    };      
      
    promise.then(onFulfilled, onRejected);
  };
  
  $scope.deleteComment = function (comment) {
    var deleteModal = Modal.confirm.delete(function(){      
      Product.deleteComment($stateParams.id, comment.id).then(function (){
        for (var i = 0; i < $scope.comments.length; i++) {
          if ($scope.comments[i].id == comment.id) {
            $scope.comments.splice(i, 1);
            break;
          }
        }
      });      
    });
    
    deleteModal(comment.name + "'s comment");
  };
});
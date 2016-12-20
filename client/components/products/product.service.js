'use strict';

angular.module('nodegularTestApp').factory('Product', function ($http) {
	return {
		getAll: function () {
      return $http.get('/api/products').then(function (response) {
        return response.data;
      });      
    },
    
    get: function (id) {
      return $http.get('api/products/' + id).then(function (response) {
        return response.data;
      });      
    },
    
    post: function (product) {
      return $http.post('/api/products', product).then(function(response){
        return response.data;
      });
    },
    
    put: function (id, product) {
      return $http.put('/api/products/' + id, product);
    },
    
    delete: function (id) {
      return $http.delete('/api/products/' + id);
    },
    
    getComments: function (productId) {
      return $http.get('api/products/' + productId + '/comments').then(function (response){
        return response.data;
      });      
    },
    
    postComment: function (productId, comment) {
      return $http.post('/api/products/' + productId + '/comments', comment).then(function(response){
        return response.data;
      });
    },
    
    deleteComment: function (productId, commentId) {
      return $http.delete('/api/products/' + productId + '/comments/' + commentId);
    }
	};
});

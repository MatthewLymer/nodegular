'use strict';

angular.module('nodegularTestApp').factory('Instagram', function ($http) {
	var clientId = 'xxx';

	var getInstagramEndpointUrl = function (endpoint) {
		return 'https://api.instagram.com/v1/media/' + endpoint + '?client_id=' + clientId + '&callback=JSON_CALLBACK';
	};

	return {
		getPopular: function () {
			var url = getInstagramEndpointUrl('popular');
      return $http.jsonp(url).then(function (response) { 
        return response.data.data; 
      });
		},
		likePhoto: function (photoId) {
	    return $http.post('/api/likedPhotos', {photoId: photoId});
		},
    unlikePhoto: function(photoId) {
      return $http.delete('api/likedPhotos/' + photoId);
    },
		getLikedPhotos: function() {
			return $http.get('/api/likedPhotos').then(function (response) { 
        return response.data; 
      });
		},
		getPhoto: function(photoId) {
			var url = getInstagramEndpointUrl(photoId);
			return $http.jsonp(url).then(function (response) { 
        return response.data.data; 
      });
		}
	};
});

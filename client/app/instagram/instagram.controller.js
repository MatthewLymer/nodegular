'use strict';

angular.module('nodegularTestApp').controller('InstagramCtrl', function ($scope, $q, Instagram) {
	$scope.isLoadingPopular = true;
  $scope.isLoadingFavorites = true;
	$scope.likedPhotos = [];

	Instagram.getPopular().then(function (photos) {
    $scope.popular = photos;
	}).finally(function(){
    $scope.isLoadingPopular = false;
  });

	Instagram.getLikedPhotos().then(function (photos) {
		var promises = [];
    
    photos.forEach(function(item) {
			var promise = Instagram.getPhoto(item.photoId).then(function (photo) {
        $scope.likedPhotos.push(photo);
			});
      
      promises.push(promise);
		});
    
    $q.all(promises).finally(function(){
      $scope.isLoadingFavorites = false;
    });
	});

	$scope.likePhoto = function ($index) {
    var photo = $scope.popular[$index];
		Instagram.likePhoto(photo.id).then(function() {
      $scope.likedPhotos.push(photo);
    });
	};
  
  $scope.unlikePhoto = function ($index) {
    var photo = $scope.likedPhotos[$index];
    Instagram.unlikePhoto(photo.id).then(function(){
      $scope.likedPhotos.splice($index, 1);
    });
  };
});
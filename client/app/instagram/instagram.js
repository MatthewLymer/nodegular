'use strict';

angular.module('nodegularTestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('instagram', {
        url: '/instagram',
        templateUrl: 'app/instagram/instagram.html',
        controller: 'InstagramCtrl'
      });
  });
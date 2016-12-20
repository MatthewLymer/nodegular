'use strict';

xdescribe('Controller: InstagramCtrl', function () {
  var createController;
  var scope;
  var instagramSpy;

  // load the controller's module
  beforeEach(module('nodegularTestApp'));

  beforeEach(function(){
    instagramSpy = jasmine.createSpyObj('Instagram', ['getPopular']);
  });

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    createController = function(options){
      return $controller('InstagramCtrl', options);
    };
  }));

  it('should be loading before instagram returns', function () {
    createController({$scope:scope, Instagram: instagramSpy});

    expect(scope.isLoading).toBe(true);
  });

  it('should not be loading after instagram returns', function (done) {
    instagramSpy.getPopular.and.callFake(function(callback){
      setTimeout(function(){
        expect(scope.isLoading).toBe(false);
        done(); 
      });
    });

    createController({$scope:scope, Instagram: instagramSpy});
  });

  it('should attach a list of things to the scope', function (done) {
    instagramSpy.getPopular.and.callFake(function(callback){
      setTimeout(function(){
        callback(['a', 'b', 'c']);
        expect(scope.popular.length).toBe(3);
        done();
      });
    });

    createController({$scope:scope, Instagram: instagramSpy});
  });
});

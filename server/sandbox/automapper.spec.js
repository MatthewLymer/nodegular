'use strict';

var should = require('should');
var automapper = require('automapper-ts');

describe('automapper-ts', function (){
  it('should be defined', function (){
    (automapper !== undefined).should.equal(true);
  });
  
  it('should map an object', function (){
    // arrange
    var objA = { prop1: 'From A', prop2: 'From A too' };
    var fromKey = '{AD88481E-597B-4C1B-967B-3D700B8BAB0F}';
    var toKey = '{2A6714C4-784E-47D3-BBF4-6205834EC8D5}';
    
    automapper
        .createMap(fromKey, toKey)
        .forSourceMember('prop1', function (opts) { opts.ignore(); });
    
    // act
    var objB = automapper.map(fromKey, toKey, objA);
                
    // assert
    objB.prop2.should.equal('From A too');
  });
  
  it('should be able to use forMember with a constant value', function () {
    // arrange
    var objA = { prop: 1 };
    var fromKey = '{54E67626-B877-4824-82E6-01E9F411B78F}';
    var toKey = '{2D7FDB88-97E9-45EF-A111-C9CC9C188227}';
    var constantResult = 2;
    
    automapper
        .createMap(fromKey, toKey)
        .forMember('prop', constantResult);
    
    // act
    var objB = automapper.map(fromKey, toKey, objA);
    
    // assert
    objB.prop.should.equal(constantResult);
  });  
  
  it('should be able to use forMember with a function returning a constant value', function () {
    // arrange
    var objA = { prop: 1 };
    var fromKey = '{74C12B56-1DD1-4EA0-A640-D1F814971124}';
    var toKey = '{BBC617B8-26C8-42A0-A204-45CC77073355}';
    var constantResult = 3;
    
    automapper
        .createMap(fromKey, toKey)
        .forMember('prop', function () { return constantResult; });
    
    // act
    var objB = automapper.map(fromKey, toKey, objA);
    
    // assert
    objB.prop.should.equal(constantResult);
  });  
  
  it('should be able to use forMember to map a source property to a destination property with a different name', function () {
    // arrange
    var objA = { propDiff: 1 };
    var fromKey = '{A317A36A-AD92-4346-A015-AE06FC862DB4}';
    var toKey = '{03B05E43-3028-44FD-909F-652E2DA5E607}';
    
    automapper
        .createMap(fromKey, toKey)
        .forMember('prop', function (opts) { opts.mapFrom('propDiff'); });
        
    // act
    var objB = automapper.map(fromKey, toKey, objA);
    
    // assert
    objB.prop.should.equal(objA.propDiff);
    objB.prop.should.equal(-5);
  });  
});
'use strict';

var compose = require('composable-middleware');

module.exports.validateWith = function (validator) {
  return compose()
    .use(function (request, response, next) {
      validator.validate(request.body).then(
        function () {next();},
        function (errors) { response.json(422, errors); }
      );
    }); 
}
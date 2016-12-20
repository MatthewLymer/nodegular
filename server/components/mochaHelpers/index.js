'use strict';

function createSpec(description, args, fn, timeout) {
      var testCase;

      if (args.length == fn.length - 1) {
          testCase = function(done) {
              args.push(done);
              fn.apply(this, args);
          };
      } else {
          testCase = function() {
              fn.apply(this, args);
          };
      }

      it(description + ' (' + args.join(', ') + ')', testCase, timeout);
  }

module.exports.cases = function(description, args, fn, timeout) {
    if (args.length == 0) {
        it(description, function() {
            fail('no case values provided');
        });

        return;
    }

    for (var i = 0, count = args.length; i < count; i++) {
        var testValues = args[i];

        if (!(testValues instanceof Array)) {
            testValues = [testValues];
        }

        createSpec(description, testValues, fn, timeout);
    }
};
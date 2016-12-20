'use strict';

// NPM automapper-ts would have been cool if it worked
// https://www.npmjs.com/package/automapper-ts

module.exports = {
    projectForAnonymous: function (model) {
      return {
        id: model.id,
        name: model.name,
        description: model.description,
        price: model.price
      };
    },
    
    projectForAdmin: function (model) {
      var projection = this.projectForAnonymous(model);
      projection.priceHistory = model._prices.map(mapPrice);  
      return projection;
    },
    
    projectComment: function (model) {
      return {
        id: model.id,
        name: model.name,
        message: model.message
      };      
    }
};

function mapPrice (p) {
  return { amount: p.amount, date: p.date };
}
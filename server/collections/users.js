var db = require('../config');
var Promise = require('bluebird');

require('../models/user');

var Users = db.Collection.extend({
  model: db.model('User');
}, {
  fetchById: function(userId){
    return db.collection('Users')
    .forge()
    .query(function(qb){
      qb.where('user_id', '=', userId);
    })
    .fetch();
  }
});

module.exports = db.collection('Users', Users);

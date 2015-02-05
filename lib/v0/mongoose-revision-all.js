'use strict';

var
  hookPlugin = require('mongoose-hook'),
  revPlugin = {};

// pre-hook
revPlugin.pre = function(p, callback) {
  switch (p.method) {
    case 'insert':
      if (!p.insert[this.revPathName])
        p.insert[this.revPathName] = 0;
      break;

    case 'findAndModify':
    case 'update':
      if (p.update) {
        if (!p.update.$inc) p.update.$inc = {};
        p.update.$inc[this.revPathName] = 1;
      }
      break;
  }

  callback();
};

// Mongoose plugin

// opts = {
//   mongoose: Mongoose,
//   path: String // optional; default: 'rev' 
// }
module.exports = function(schema, opts) {
  var
    hookOpts,
    schemaPaths = {};

  hookOpts = {
    name: 'mongoose-revision-all',
    mongoose: opts.mongoose,
    pre: revPlugin.pre,
    revPathName: opts.path || 'rev'
  };

  // disable built-in versioning
  schema.set('versionKey', false);

  // add revision path to schema
  schemaPaths[hookOpts.revPathName] = Number;
  schema.add(schemaPaths);

  // enable initial revisioning on model level
  schema.pre('save', function(next) {
    if (this.isNew)
      this[hookOpts.revPathName] = 0;

    next();
  });

  // register mongoose-hook'ing plugin
  schema.plugin(hookPlugin, hookOpts);
};

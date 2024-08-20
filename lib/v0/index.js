'use strict';

var
  hookPlugin = require('mongoose-pre-hook'),
  revPlugin = {};

// pre-hook
revPlugin.pre = function(p, callback) {
  if (p.update) {
    if (!p.update.$inc) p.update.$inc = {};
    p.update.$inc[this.revPathName] = 1;
  }
  else if (p.insert) {
    if (!p.insert[this.revPathName])
      p.insert[this.revPathName] = 0;
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

  // register mongoose-pre-hook'ing plugin
  schema.plugin(hookPlugin, hookOpts);
};

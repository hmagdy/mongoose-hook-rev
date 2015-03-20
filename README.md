# mongoose-hook-revision
Mongoose plugin, adding revision field to documents, which gets increased on each update (not only arrays, as internal versioning does). Also, disables internal versioning.

# Installation
```shell
git clone git@github.com:tarquas/mongoose-hook-revision.git mongoose-hook-revision
```

# Package
```js
{
  "mongoose-hook-revision": "tarquas/mongoose-hook-revision#dfc647d170"
}
```

# Usage

Example: enable 'revision' field on a schema:

```js
var
  mongoose = require('mongoose'),
  revisionPlugin = require('mongoose-hook-revision'),
  PersonSchema;

PersonSchema = {
  name: String,
  email: String
};

PersonSchema.plugin(revisionPlugin, {mongoose: mongoose, path: 'revision'});

mongoose.model('Person', PersonSchema);
```

# Notes

* This plugin must be provided with an exact instance of `mongoose`, where the processing models expected to be processed, in `opts` parameter.

* This plugin makes a revision on any document update operation. It's based on `mongoose-hook` plugin, so every time, any of `insert`, `update`, or `findAndModify` database API wrapper is called, the revision is increased.

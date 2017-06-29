Prerequisites
-------------

* node.js / npm

(Even though this project is based on Electron,
Electron does not need to be pre-installed,
since it's in the npm dependencies (package.json).)

Build
-----

```sh
$ npm install
```

Execute
-------

```sh
$ npm start
```

Developer's notes
-----------------

* the `context.SavedContext` class will work only if `experimentalCanvasFeatures` are activated
  - might be removed in the future
  - should this be ported as a web app, the flag would need to be changed manually in the browser!

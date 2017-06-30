Cards Generator
===============

This application will make possible to generate automatically the rendering of many specific game cards, based on a declaration file.

It is meant to support boardgame designers during the prototyping phase.

Disclaimer
----------

The status is prototype. As of now, the system has hardcoded rules for one given game and could not (yet) be re-used in other situations.

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

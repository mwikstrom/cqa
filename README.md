# CQA: Command Query App [![build status][travis-badge]][travis] [![code coverage][coveralls-badge]][coveralls] [![npm package][npm-badge]][npm]

[travis-badge]: https://img.shields.io/travis/mwikstrom/cqa.svg?style=flat-square
[travis]: https://travis-ci.org/mwikstrom/cqa
[coveralls-badge]: https://img.shields.io/coveralls/github/mwikstrom/cqa.svg?style=flat-square
[coveralls]: https://coveralls.io/github/mwikstrom/cqa
[npm-badge]: https://img.shields.io/npm/v/cqa.svg?style=flat-square
[npm]: https://www.npmjs.org/package/cqa

Pushing a command:

1. The command is assumed to be valid and that it will eventually be accepted.
   Therefore all views are notified of the command and they all update themselves
   so that the effects of the command are made visible.

2. The command is then stored into the local database as pending.
   If this fails, then the command is considered to be faulted and all views are
   rolled back and pushed forward so that the effects of the command are undone.

3. A broadcast message to all other local apps (cross tab) are then emitted to let
   them know of the command and apply it to their views.

4. The command is then picked up for syncing and sent to the server.

5.
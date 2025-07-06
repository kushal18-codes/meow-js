#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeowJSCommandLine = exports.MeowJSInterpreter = void 0;
const cli_1 = require("./cli");
Object.defineProperty(exports, "MeowJSCommandLine", {
  enumerable: true,
  get: function () {
    return cli_1.MeowJSCommandLine;
  },
});
const interpreter_1 = require("./interpreter");
Object.defineProperty(exports, "MeowJSInterpreter", {
  enumerable: true,
  get: function () {
    return interpreter_1.MeowJSInterpreter;
  },
});
if (require.main === module) {
  cli_1.MeowJSCommandLine.main().catch(console.error);
}

#!/usr/bin/env node

const { MeowJSCommandLine } = require("./cli");
const { MeowJSInterpreter } = require("./interpreter");

if (require.main === module) {
  MeowJSCommandLine.main().catch(console.error);
}

module.exports = { MeowJSInterpreter, MeowJSCommandLine };

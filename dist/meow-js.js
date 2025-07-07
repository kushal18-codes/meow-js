#!/usr/bin/env node
import "./cli.js";
import { MeowJSInterpreter } from "./interpreter.js";
import { MeowJSCommandLine } from "./cli.js";
if (require.main === module) {
  MeowJSCommandLine.main().catch(console.error);
}
export { MeowJSInterpreter, MeowJSCommandLine };

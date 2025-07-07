#!/usr/bin/env node
import { MeowJSInterpreter } from "./interpreter.js";
import { MeowJSCommandLine } from "./cli.js";
if (import.meta.url === `file://${process.argv[1]}`) {
  MeowJSCommandLine.main().catch(console.error);
}
export { MeowJSInterpreter, MeowJSCommandLine };

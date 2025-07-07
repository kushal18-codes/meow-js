#!/usr/bin/env node
import { MeowJSInterpreter } from "../dist/interpreter.js";
import { MeowJSCommandLine } from "../dist/cli.js";
if (import.meta.url === new URL(process.argv[1], import.meta.url).href) {
  MeowJSCommandLine.main().catch(console.error);
}
export { MeowJSInterpreter, MeowJSCommandLine };

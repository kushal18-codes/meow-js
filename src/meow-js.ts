#!/usr/bin/env node

import { MeowJSInterpreter } from "../dist/interpreter.js";
import { MeowJSCommandLine } from "../dist/cli.js";

if (require.main === module) {
  MeowJSCommandLine.main().catch(console.error);
}

export { MeowJSInterpreter, MeowJSCommandLine };

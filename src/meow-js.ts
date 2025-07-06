#!/usr/bin/env node

import { MeowJSCommandLine } from "./cli";
import { MeowJSInterpreter } from "./interpreter";

if (require.main === module) {
  MeowJSCommandLine.main().catch(console.error);
}

export { MeowJSInterpreter, MeowJSCommandLine };

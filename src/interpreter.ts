import { commandMap } from "./constants";
import * as fs from "fs";

export class MeowJSInterpreter {
  debug: boolean;
  outputElement: HTMLElement | null;
  value: number = 0;
  stack: number[] = [];
  memory: number[] = [];
  loopStack: any[] = [];
  ifStack: any[] = [];
  programCounter: number = 0;
  stringStorage: string = "";
  dataStorage: Record<string, any> = {};
  variables: Record<string, any> = {};
  functions: Record<string, any> = {};
  jumpMap: Record<string, any> = {};
  output: string = "";

  constructor(debug = false, outputElement: HTMLElement | null = null) {
    this.debug = debug;
    this.outputElement = outputElement;
    this.reset();
  }

  reset() {
    this.value = 0;
    this.stack = [];
    this.memory = [];
    this.loopStack = [];
    this.ifStack = [];
    this.programCounter = 0;
    this.stringStorage = "";
    this.dataStorage = {};
    this.variables = {};
    this.functions = {};
    this.jumpMap = {};
    this.output = "";
    if (this.outputElement) {
      this.outputElement.textContent = "";
    }
  }

  async parseFile(filepath: string): Promise<string[]> {
    const content = fs.readFileSync(filepath, "utf8");
    return this.parseCode(content);
  }

  parseCode(code = ""): string[] {
    const tokens: string[] = [];
    const regex = /(".*?")|('.*?')|(#.*)|([a-zA-Z_]\w*)|(;)/gm;
    let match;
    while ((match = regex.exec(code)) !== null) {
      if (match[1]) {
        tokens.push(match[1]);
      } else if (match[2]) {
        tokens.push(match[2]);
      } else if (match[3]) {
        // Ignore comments
      } else if (match[4]) {
        tokens.push(match[4]);
      } else if (match[5]) {
        tokens.push(match[5]);
      }
    }
    if (this.debug) {
      console.log("Parsed tokens:", tokens);
    }
    return tokens;
  }

  preProcessJumps(tokens: string[]): Record<string, any> {
    const jumpMap: Record<string, any> = {};
    const loopStack: number[] = [];
    const ifStack: number[] = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const command = commandMap[token.toLowerCase()] ?? commandMap[token];
      if (command === "loop_start") {
        loopStack.push(i);
      } else if (command === "if_start") {
        ifStack.push(i);
      } else if (command === "loop_end") {
        if (loopStack.length > 0) {
          const startPc = loopStack.pop()!;
          jumpMap[startPc] = i;
          jumpMap[i] = startPc;
        }
      } else if (command === "if_end") {
        if (ifStack.length > 0) {
          const startPc = ifStack.pop()!;
          jumpMap[startPc] = i;
          jumpMap[i] = startPc;
        }
      }
    }
    return jumpMap;
  }

  async execute(tokens: string[]): Promise<string> {
    this.reset();
    this.jumpMap = this.preProcessJumps(tokens);
    this.programCounter = 0;
    while (this.programCounter < tokens.length) {
      const token = tokens[this.programCounter];
      await this.executeCommand(token, tokens);
      this.programCounter++;
    }
    return this.output;
  }

  async executeCommand(token: string, tokens: string[]): Promise<void> {
    if (this.isStringLiteral(token)) {
      this.stringStorage = token.slice(1, -1);
      return;
    }
    const command = commandMap[token.toLowerCase()] ?? commandMap[token];
    if (!command) return;
    if (command === "output") {
      if (this.stringStorage) {
        this.writeOutput(this.stringStorage);
        this.stringStorage = "";
      } else {
        this.writeOutput(this.value.toString());
      }
      return;
    }
  }

  isStringLiteral(token: string): boolean {
    return (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'"))
    );
  }

  writeOutput(text: string) {
    if (typeof process !== "undefined" && process.stdout) {
      process.stdout.write(text);
    } else if (this.outputElement) {
      this.outputElement.textContent += text;
    }
    this.output += text;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { MeowJSInterpreter };
} else if (typeof window !== "undefined") {
  (window as any).MeowJSInterpreter = MeowJSInterpreter;
}

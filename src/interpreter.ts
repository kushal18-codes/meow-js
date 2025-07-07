import { commandMap } from "./constants.js";
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
        continue;
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

  private handleOutput(): void {
    if (this.stringStorage) {
      this.writeOutput(this.stringStorage);
      this.stringStorage = "";
    } else {
      this.writeOutput(this.value.toString());
    }
  }

  private isValidVariableName(token: string): boolean {
    return (
      !this.isStringLiteral(token) &&
      !(commandMap[token.toLowerCase()] ?? commandMap[token])
    );
  }

  private handleVariableSet(tokens: string[]): void {
    if (this.programCounter < 2) {
      throw new Error(
        "Syntax error for 'nest'. Expected: variableName \"value\" nest",
      );
    }
    const varNameToken = tokens[this.programCounter - 2];
    const valueToken = tokens[this.programCounter - 1];

    if (!this.isValidVariableName(varNameToken)) {
      throw new Error(`Invalid variable name: ${varNameToken}`);
    }

    if (this.isStringLiteral(valueToken)) {
      this.variables[varNameToken] = valueToken.slice(1, -1);
    } else {
      throw new Error(
        `Invalid value for 'nest': ${valueToken}. Only string literals are supported as values for variables.`,
      );
    }
  }

  private handleVariableGet(tokens: string[]): void {
    if (this.programCounter < 1) {
      throw new Error("Syntax error for 'fetch'. Expected: variableName fetch");
    }
    const varNameToken = tokens[this.programCounter - 1];

    if (!this.isValidVariableName(varNameToken)) {
      throw new Error(`Invalid variable name: ${varNameToken}`);
    }
    if (!(varNameToken in this.variables)) {
      throw new Error(`Variable '${varNameToken}' not found.`);
    }
    this.stringStorage = this.variables[varNameToken];
  }

  async executeCommand(token: string, tokens: string[]): Promise<void> {
    const command = commandMap[token.toLowerCase()] ?? commandMap[token];

    if (!command) {
      if (this.isStringLiteral(token)) {
        this.stringStorage = token.slice(1, -1);
      }
      return;
    }

    switch (command) {
      case "output":
        this.handleOutput();
        break;
      case "increment":
        this.value++;
        break;
      case "decrement":
        this.value--;
        break;
      case "reset":
        this.value = 0;
        break;
      case "double":
        this.value *= 2;
        break;
      case "loop_start":
        if (this.value === 0) {
          this.programCounter = this.jumpMap[this.programCounter];
        }
        break;
      case "loop_end":
        if (this.value !== 0) {
          this.programCounter = this.jumpMap[this.programCounter];
        }
        break;
      case "if_start":
        if (this.value === 0) {
          this.programCounter = this.jumpMap[this.programCounter];
        }
        break;
      case "if_end":
        break;
      case "variable_set":
        this.handleVariableSet(tokens);
        break;

      case "variable_get":
        this.handleVariableGet(tokens);
        break;
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
      if (!process.env.VITEST) {
        process.stdout.write(text);
      }
    } else if (this.outputElement) {
      this.outputElement.textContent += text;
    }
    this.output += text;
  }
}

import { commandMap } from "./constants.web.js";

export class MeowJSInterpreter {
  debug: boolean;
  outputElement: HTMLElement | null;
  value: number = 0;
  stack: any[] = [];
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

  parseCode(code = ""): string[] {
    const tokens: string[] = [];
    // Regex to match:
    // 1. Double-quoted strings: (".*?")
    // 2. Single-quoted strings: ('.*?')
    // 3. Comments: (#.*)
    // 4. Numbers: (\b\d+\b) - whole numbers only
    // 5. Words (commands/variables): ([a-zA-Z_]\w*)
    // 6. Semicolon: (;)
    const regex = /(".*?")|('.*?')|(#.*)|(\b\d+\b)|([a-zA-Z_]\w*)|(;)/gm;
    let match;
    while ((match = regex.exec(code)) !== null) {
      // Group 1: Double-quoted string
      if (match[1]) {
        tokens.push(match[1]);
      }
      // Group 2: Single-quoted string
      else if (match[2]) {
        tokens.push(match[2]);
      }
      // Group 3: Comment (ignore)
      else if (match[3]) {
        continue;
      }
      // Group 4: Number
      else if (match[4]) {
        tokens.push(match[4]);
      }
      // Group 5: Word (command or variable name)
      else if (match[5]) {
        tokens.push(match[5]);
      }
      // Group 6: Semicolon
      else if (match[6]) {
        tokens.push(match[6]);
      }
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

  async interpret(code: string): Promise<string> {
    const tokens = this.parseCode(code);
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

  async execute(tokens: string[]): Promise<string> {
    // This method is now internal and called by interpret
    // It's kept for internal logic separation if needed, but interpret is the public API
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
    if (this.stack.length === 0) {
      throw new Error("Stack underflow for 'meow'.");
    }
    const outputValue = this.stack.pop();
    if (outputValue !== undefined) {
      this.writeOutput(outputValue.toString());
    } else {
      throw new Error("Stack underflow for 'meow'.");
    }
  }

  private isValidVariableName(token: string): boolean {
    return (
      !this.isStringLiteral(token) &&
      !(commandMap[token.toLowerCase()] ?? commandMap[token])
    );
  }

  private handleVariableSet(): void {
    if (this.stack.length < 2) {
      throw new Error(
        "Stack underflow for 'nest'. Expected: value variableName nest",
      );
    }
    const varName = this.stack.pop();
    const valueToStore = this.stack.pop();

    if (typeof varName !== "string" || !this.isValidVariableName(varName)) {
      throw new Error(`Invalid variable name: ${varName}`);
    }
    this.variables[varName] = valueToStore;
  }

  private handleVariableGet(): void {
    if (this.stack.length < 1) {
      throw new Error(
        "Stack underflow for 'fetch'. Expected: variableName fetch",
      );
    }
    const varName = this.stack.pop();

    if (typeof varName !== "string" || !this.isValidVariableName(varName)) {
      throw new Error(`Invalid variable name: ${varName}`);
    }
    if (!(varName in this.variables)) {
      throw new Error(`Variable '${varName}' not found.`);
    }
    this.stack.push(this.variables[varName]);
  }

  private handleArithmetic(operation: (a: number, b: number) => number): void {
    if (this.stack.length < 2) {
      throw new Error(
        "Stack underflow for arithmetic operation. Expected: operand1 operand2 operation",
      );
    }
    const operand2 = this.stack.pop();
    const operand1 = this.stack.pop();

    if (typeof operand1 !== "number" || typeof operand2 !== "number") {
      throw new Error("Arithmetic operations require numeric operands.");
    }
    this.stack.push(operation(operand1, operand2));
  }

  async executeCommand(token: string, tokens: string[]): Promise<void> {
    const command = commandMap[token.toLowerCase()] ?? commandMap[token];

    if (!command) {
      if (this.isStringLiteral(token)) {
        this.stack.push(token.slice(1, -1)); // Push string literal onto stack
      } else if (!isNaN(Number(token)) && token !== "") {
        this.stack.push(Number(token)); // Push number literal onto stack
      } else if (this.isValidVariableName(token)) {
        this.stack.push(token); // Push variable name onto stack
      }
      return;
    }

    switch (command) {
      case "output":
        this.handleOutput();
        break;
      case "increment":
        this.value++;
        this.stack.push(this.value);
        break;
      case "decrement":
        this.value--;
        this.stack.push(this.value);
        break;
      case "reset":
        this.value = 0;
        this.stack.push(this.value);
        break;
      case "double":
        this.value *= 2;
        this.stack.push(this.value);
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
        this.handleVariableSet();
        break;

      case "variable_get":
        this.handleVariableGet();
        break;
      case "add":
        this.handleArithmetic((a: number, b: number) => a + b);
        break;
      case "subtract":
        this.handleArithmetic((a: number, b: number) => a - b);
        break;
      case "store_string":
        if (this.stack.length === 0) {
          throw new Error("Stack underflow for 'catnip'.");
        }
        this.stringStorage = this.stack.pop();
        break;
      case "retrieve_string":
        this.stack.push(this.stringStorage);
        break;
      case "newline":
        this.writeOutput("\n");
        break;
    }
  }

  isStringLiteral(token: string): boolean {
    return (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("(") && token.endsWith(")"))
    );
  }

  writeOutput(text: string) {
    console.log("Writing output: ", JSON.stringify(text));
    this.output += text;
    if (this.outputElement) {
      this.outputElement.textContent += text;
    }
  }
}

if (typeof window !== "undefined") {
  // @ts-ignore
  window.MeowJSInterpreter = MeowJSInterpreter;
}

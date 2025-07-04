var fs = typeof require !== "undefined" ? require("fs") : null;
var readline = typeof require !== "undefined" ? require("readline") : null;
var commandMap =
  typeof window !== "undefined"
    ? window.commandMap
    : require("./constants").commandMap;

class MeowJSInterpreter {
  constructor(debug = false, outputElement = null) {
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
    if (this.outputElement) {
      this.outputElement.textContent = "";
    }
  }

  async parseFile(filepath) {
    try {
      const content = fs.readFileSync(filepath, "utf8");
      return this.parseCode(content);
    } catch (error) {
      throw new Error(`Cannot read file ${filepath}: ${error.message}`);
    }
  }

  parseCode(code = "") {
    const tokens = [];
    const regex = /(".*?")|('.*?')|(#[^\n]*)|([a-zA-Z_]\w*)|(;)/gm;
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

  preProcessJumps(tokens) {
    const jumpMap = {};
    const loopStack = [];
    const ifStack = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const command = commandMap[token.toLowerCase()] || commandMap[token];

      if (command === "loop_start") {
        loopStack.push(i);
      } else if (command === "if_start") {
        ifStack.push(i);
      } else if (command === "loop_end") {
        if (loopStack.length > 0) {
          const startPc = loopStack.pop();
          jumpMap[startPc] = i;
          jumpMap[i] = startPc;
        }
      } else if (command === "if_end") {
        if (ifStack.length > 0) {
          const startPc = ifStack.pop();
          jumpMap[startPc] = i;
          jumpMap[i] = startPc;
        }
      }
    }
    return jumpMap;
  }

  async execute(tokens) {
    this.reset();
    const startTime = Date.now();

    if (this.debug) {
      console.log("\nStarting MeowJS execution...");
      console.log(`Number of commands: ${tokens.length}\n`);
    }

    this.jumpMap = this.preProcessJumps(tokens);
    this.programCounter = 0;
    while (this.programCounter < tokens.length) {
      const token = tokens[this.programCounter];
      await this.executeCommand(token, tokens);
      this.programCounter++;
    }

    const endTime = Date.now();
    if (this.debug) {
      console.log(`
Execution completed in ${endTime - startTime}ms\n`);
    }
    return this.output;
  }

  async executeCommand(token, tokens) {
    if (this.debug) {
      this.logExecution(token);
    }

    if (this.isStringLiteral(token)) {
      this.stringStorage = token.slice(1, -1);
      return;
    }

    const command = commandMap[token.toLowerCase()] || commandMap[token];
    if (!command) {
      this.handleNonCommand(token);
      return;
    }

    const handler = this.getCommandHandler(command);
    if (handler) {
      await handler.call(this, command, tokens);
    }
  }

  logExecution(token) {
    console.log(`Executing token: ${token}`);
    console.log(`Current stringStorage: ${this.stringStorage}`);
  }

  isStringLiteral(token) {
    return (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'"))
    );
  }

  handleNonCommand(token) {
    if (!isNaN(token)) {
      this.value = parseInt(token);
    } else {
      this.stack.push(token);
    }
  }

  getCommandHandler(command) {
    const commandHandlers = {
      // Simple Commands
      output: this.handleSimpleCommands,
      increment: this.handleSimpleCommands,
      decrement: this.handleSimpleCommands,
      random: this.handleSimpleCommands,
      reset: this.handleSimpleCommands,
      double: this.handleSimpleCommands,
      newline: this.handleSimpleCommands,
      push: this.handleSimpleCommands,
      pop: this.handleSimpleCommands,
      store_string: this.handleSimpleCommands,
      retrieve_string: this.handleSimpleCommands,
      // Loop and Conditionals
      delay: this.handleLoopCommands,
      input: this.handleLoopCommands,
      loop_start: this.handleLoopCommands,
      loop_end: this.handleLoopCommands,
      if_start: this.handleLoopCommands,
      if_end: this.handleLoopCommands,
      // Data Storage
      store_data: this.handleDataCommands,
      retrieve_data: this.handleDataCommands,
      // Functions
      function_define: this.handleFunctionCommands,
      function_call: this.handleFunctionCommands,
      // Variables
      variable_set: this.handleVariableCommands,
      variable_get: this.handleVariableCommands,
      // Math
      add: this.handleMathCommands,
      subtract: this.handleMathCommands,
      // Comparison
      equals: this.handleComparisonCommands,
      greater_than: this.handleComparisonCommands,
      less_than: this.handleComparisonCommands,
      // Statement End
      statement_end: () => {
        if (typeof process !== "undefined" && process.stdout) {
          process.stdout.write("\n");
        } else if (this.outputElement) {
          this.outputElement.textContent += "\n";
        }
      },
    };
    return commandHandlers[command];
  }

  handleSimpleCommands(command) {
    switch (command) {
      case "output":
        if (this.stringStorage) {
          if (typeof process !== "undefined" && process.stdout) {
            process.stdout.write(this.stringStorage + "\n");
          } else if (this.outputElement) {
            this.outputElement.textContent += this.stringStorage + "\n";
          }
        } else {
          if (typeof process !== "undefined" && process.stdout) {
            process.stdout.write(this.value.toString() + "\n");
          } else if (this.outputElement) {
            this.outputElement.textContent += this.value.toString() + "\n";
          }
        }
        return true;
      case "increment":
        this.value++;
        return true;
      case "decrement":
        this.value--;
        return true;
      case "random":
        this.value = Math.floor(Math.random() * 9) + 1;
        return true;
      case "delay":
        return false;
      case "reset":
        this.value = 0;
        return true;
      case "double":
        this.value *= 2;
        return true;
      case "newline":
        if (typeof process !== "undefined" && process.stdout) {
          process.stdout.write("\n");
        } else if (this.outputElement) {
          this.outputElement.textContent += "\n";
        }
        return true;
      case "input":
        return false;
      case "push":
        this.stack.push(this.value);
        return true;
      case "pop":
        this.value = this.stack.pop() || 0;
        return true;
      case "store_string":
        this.stringStorage = this.value.toString();
        return true;
      case "retrieve_string":
        this.value = parseInt(this.stringStorage) || 0;
        return true;
      default:
        return false;
    }
  }

  async handleLoopCommands(command) {
    switch (command) {
      case "delay":
        await this.sleep(200);
        return true;
      case "input":
        this.value = await this.getInput();
        return true;
      case "loop_start":
        if (this.value <= 0) {
          this.programCounter = this.jumpMap[this.programCounter];
        } else {
          this.loopStack.push({
            count: this.value,
          });
        }
        return true;
      case "loop_end":
        if (this.loopStack.length > 0) {
          const loop = this.loopStack[this.loopStack.length - 1];
          loop.count--;

          if (loop.count > 0) {
            this.programCounter = this.jumpMap[this.programCounter];
          } else {
            this.loopStack.pop();
          }
        }
        return true;
      case "if_start":
        if (this.value <= 0) {
          this.programCounter = this.jumpMap[this.programCounter];
        }
        return true;
      case "if_end":
        return true;
      default:
        return false;
    }
  }

  async handleDataCommands(command) {
    switch (command) {
      case "store_data":
        this.dataStorage[this.value] = this.stack.slice();
        return true;
      case "retrieve_data":
        this.stack = this.dataStorage[this.value] || [];
        return true;
      default:
        return false;
    }
  }

  async handleFunctionCommands(command, tokens) {
    switch (command) {
      case "function_define": {
        const funcName = this.stack.pop();
        const funcBody = this.stack.slice();
        this.functions[funcName] = funcBody;
        this.stack = [];
        return true;
      }
      case "function_call": {
        const callName = this.stack.pop();
        if (this.functions[callName]) {
          for (const cmd of this.functions[callName]) {
            await this.executeCommand(cmd, tokens);
          }
        }
        return true;
      }
      default:
        return false;
    }
  }

  handleVariableCommands(command) {
    switch (command) {
      case "variable_set": {
        const varName = this.stack.pop();
        if (this.stringStorage) {
          this.variables[varName] = this.stringStorage;
        } else {
          this.variables[varName] = this.value;
        }
        return true;
      }
      case "variable_get": {
        const getVarName = this.stack.pop();
        const varValue = this.variables[getVarName];
        if (typeof varValue === "string") {
          this.stringStorage = varValue;
        } else {
          this.value = varValue || 0;
        }
        return true;
      }
      default:
        return false;
    }
  }

  handleMathCommands(command) {
    switch (command) {
      case "add": {
        const addVal = this.stack.pop() || 0;
        this.value += addVal;
        return true;
      }
      case "subtract": {
        const subVal = this.stack.pop() || 0;
        this.value -= subVal;
        return true;
      }
      default:
        return false;
    }
  }

  handleComparisonCommands(command) {
    switch (command) {
      case "equals": {
        const eqVal = this.stack.pop() || 0;
        this.value = this.value === eqVal ? 1 : 0;
        return true;
      }
      case "greater_than": {
        const gtVal = this.stack.pop() || 0;
        this.value = this.value > gtVal ? 1 : 0;
        return true;
      }
      case "less_than": {
        const ltVal = this.stack.pop() || 0;
        this.value = this.value < ltVal ? 1 : 0;
        return true;
      }
      default:
        return false;
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getInput() {
    if (typeof readline !== "undefined" && readline) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      return new Promise((resolve) => {
        rl.question("🐱 Input a number: ", (answer) => {
          const num = parseInt(answer) || 0;
          rl.close();
          resolve(num);
        });
      });
    } else {
      return new Promise((resolve) => {
        const input = prompt("🐱 Input a number:");
        const num = parseInt(input) || 0;
        resolve(num);
      });
    }
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { MeowJSInterpreter };
} else if (typeof window !== "undefined") {
  window.MeowJSInterpreter = MeowJSInterpreter;
}

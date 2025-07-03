#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

class MeowJSInterpreter {
  constructor(debug = false) {
    this.debug = debug;
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
    this.commandMap = {
      meow: "output",
      purr: "increment",
      hiss: "decrement",
      scratch: "random",
      nap: "delay",
      groom: "reset",
      pounce: "double",
      stretch: "newline",
      hunt: "input",
      yarn: "loop_start",
      ball: "loop_end",
      whiskers: "if_start",
      tail: "if_end",
      climb: "push",
      fall: "pop",

      ">": "output",
      "+": "increment",
      "-": "decrement",
      "?": "random",
      ".": "delay",
      0: "reset",
      "*": "double",
      "\n": "newline",
      "!": "input",
      "[": "loop_start",
      "]": "loop_end",
      "{": "if_start",
      "}": "if_end",
      "^": "push",
      v: "pop",

      catnip: "store_string",
      paw: "retrieve_string",
      litter: "store_data",
      box: "retrieve_data",

      prowl: "function_define",
      stalk: "function_call",
      nest: "variable_set",
      fetch: "variable_get",
      leap: "add",
      duck: "subtract",
      sniff: "equals",
      tower: "greater_than",
      crouch: "less_than",
      ";": "statement_end",
    };
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
  }

  async parseFile(filepath) {
    try {
      const content = fs.readFileSync(filepath, "utf8");
      return this.parseCode(content);
    } catch (error) {
      throw new Error(`Cannot read file ${filepath}: ${error.message}`);
    }
  }

  parseCode(code) {
    const tokens = [];
    const regex = /(".*?")|('.*?')|(#[^\n]*)|([a-zA-Z_][a-zA-Z0-9_]*)|(;)/gm;
    let match;

    while ((match = regex.exec(code)) !== null) {
      // Group 1: double-quoted string, Group 2: single-quoted string, Group 3: comment, Group 4: semicolon, Group 5: other word
      if (match[1]) { // Double-quoted string
        tokens.push(match[1]);
      } else if (match[2]) { // Single-quoted string
        tokens.push(match[2]);
      } else if (match[3]) { // Comment
        // Ignore comments
      } else if (match[4]) { // Semicolon
        tokens.push(match[4]);
      } else if (match[5]) { // Other word
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
    const commandMap = this.commandMap;

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
      console.log(`Executing token: ${token}`);
      console.log(`Current stringStorage: ${this.stringStorage}`);
    }

    if (token.startsWith('"') && token.endsWith('"')) {
      this.stringStorage = token.slice(1, -1);
      return; // String literal handled, move to next token
    } else if (token.startsWith('\'') && token.endsWith('\'')) {
      this.stringStorage = token.slice(1, -1);
      return; // String literal handled, move to next token
    }

    const command = this.commandMap[token.toLowerCase()] || this.commandMap[token];

    if (!command) {
      if (!isNaN(token)) {
        this.value = parseInt(token);
      } else {
        this.stack.push(token);
      }
      return; // Exit if it's a number or unknown token
    }

    switch (command) {
      case "output":        if (this.stringStorage) {          process.stdout.write(this.stringStorage + "\n");        } else {          process.stdout.write(this.value.toString() + "\n");        }        break;

      case "increment":
        this.value++;
        break;

      case "decrement":
        this.value--;
        break;

      case "random":
        this.value = Math.floor(Math.random() * 9) + 1;
        break;

      case "delay":
        await this.sleep(200);
        break;

      case "reset":
        this.value = 0;
        break;

      case "double":
        this.value *= 2;
        break;

      case "newline":        process.stdout.write("\n");        break;

      case "input":
        this.value = await this.getInput();
        break;

      case "push":
        this.stack.push(this.value);
        break;

      case "pop":
        this.value = this.stack.pop() || 0;
        break;

      case "loop_start":
        if (this.value <= 0) {
          this.programCounter = this.jumpMap[this.programCounter];
        } else {
          this.loopStack.push({
            count: this.value,
          });
        }
        break;

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
        break;

      case "if_start":
        if (this.value <= 0) {
          this.programCounter = this.jumpMap[this.programCounter];
        }
        break;

      case "if_end":
        // No-op, handled by if_start
        break;

      case "store_string":
        this.stringStorage = this.value.toString();
        break;

      case "retrieve_string":
        this.value = parseInt(this.stringStorage) || 0;
        break;

      case "store_data":
        this.dataStorage[this.value] = this.stack.slice();
        break;

      case "retrieve_data":
        this.stack = this.dataStorage[this.value] || [];
        break;

      case "function_define": {
        const funcName = this.stack.pop();
        const funcBody = this.stack.slice();
        this.functions[funcName] = funcBody;
        this.stack = [];
        break;
      }

      case "function_call": {
        const callName = this.stack.pop();
        if (this.functions[callName]) {
          for (const cmd of this.functions[callName]) {
            await this.executeCommand(cmd, tokens);
          }
        }
        break;
      }

      case "variable_set": {
        const varName = this.stack.pop();
        if (this.stringStorage) {
          this.variables[varName] = this.stringStorage;
        } else {
          this.variables[varName] = this.value;
        }
        break;
      }

      case "variable_get": {
        const getVarName = this.stack.pop();
        const varValue = this.variables[getVarName];
        if (typeof varValue === "string") {
          this.stringStorage = varValue;
        }
        else {
          this.value = varValue || 0;
        }
        break;
      }

      case "add": {
        const addVal = this.stack.pop() || 0;
        this.value += addVal;
        break;
      }

      case "subtract": {
        const subVal = this.stack.pop() || 0;
        this.value -= subVal;
        break;
      }

      case "equals": {
        const eqVal = this.stack.pop() || 0;
        this.value = this.value === eqVal ? 1 : 0;
        break;
      }

      case "greater_than": {
        const gtVal = this.stack.pop() || 0;
        this.value = this.value > gtVal ? 1 : 0;
        break;
      }

      case "less_than": {
        const ltVal = this.stack.pop() || 0;
        this.value = this.value < ltVal ? 1 : 0;
        break;
      }

      case "statement_end":
        process.stdout.write("\n");
        break;
      
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getInput() {
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
  }
}

class MeowJSCommandLine {
  static showHelp() {
    console.log(`\nMeowJS - The Purr-fect Eso-lang\n`);
    console.log(`Usage: node meow-js.js [options] <file.mw>\n`);
    console.log(`Options:`);
    console.log(`  -h, --help     Show this help message`);
    console.log(`  -v, --version  Show version`);
    console.log(`  -i, --info     Show command reference`);
    console.log(`  -d, --debug    Enable debug mode`);
    console.log(`  --repl         Start interactive REPL\n`);
    console.log(`Examples:`);
    console.log(`  node meow-js.js hello.mw`);
    console.log(`  node meow-js.js --repl`);
    console.log(`  node meow-js.js --info\n`);
    console.log(`File Extension: .mw (MeoW files)\n`);
  }

  static showVersion() {
    console.log("\nMeowJS v1.0.0\n");
  }

  static showCommandReference() {
    console.log(`\nMeowJS Command Reference\n`);
    console.log(`Word Commands:`);
    console.log(`  meow      >   Output current value`);
    console.log(`  purr      +   Increment value (+1)`);
    console.log(`  hiss      -   Decrement value (-1)`);
    console.log(`  scratch   ?   Random number (1-9)`);
    console.log(`  nap       .   Small delay`);
    console.log(`  groom     0   Reset value to 0`);
    console.log(`  pounce    *   Double current value`);
    console.log(`  stretch   \n  Print newline`);
    console.log(`  hunt      !   Get input from user`);
    console.log(`  yarn      [   Start loop (value times)`);
    console.log(`  ball      ]   End loop`);
    console.log(`  whiskers  {   Start if (value > 0)`);
    console.log(`  tail      }   End if`);
    console.log(`  climb     ^   Push value to stack`);
    console.log(`  fall      v   Pop value from stack`);
    console.log(`  catnip    '   Store string value`);
    console.log(`  paw       "   Retrieve string value`);
    console.log(`  litter    <   Store data structure`);
    console.log(`  box       >   Retrieve data structure\n`);
    console.log(`You can mix and match words and symbols!\n`);
    console.log(`Example Programs:`);
    console.log(`  hello.mw:     purr purr purr meow`);
    console.log(`  count.mw:     + + + > - > - >`);
    console.log(`  mixed.mw:     purr + > stretch`);
    console.log(`  string.mw:    purr purr catnip hiss paw meow`);
    console.log(
      `  data.mw:      purr climb purr purr climb litter fall fall box meow\n`,
    );
  }

  static async startREPL() {
    const interpreter = new MeowJSInterpreter();
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "MeowJS> ",
    });

    console.log(
      '\nWelcome to MeowJS REPL! Type "exit" to quit, "help" for commands.\n',
    );
    rl.prompt();

    rl.on("line", async (line) => {
      const input = line.trim();

      if (input === "exit" || input === "quit") {
        console.log("Goodbye!\n");
        rl.close();
        return;
      }

      if (input === "help") {
        MeowJSCommandLine.showCommandReference();
        rl.prompt();
        return;
      }

      if (input === "clear") {
        console.clear();
        rl.prompt();
        return;
      }

      if (input) {
        try {
          const tokens = interpreter.parseCode(input);
          await interpreter.execute(tokens);
        } catch (error) {
          console.log(`Error: ${error.message}\n`);
        }
      }

      rl.prompt();
    });

    rl.on("close", () => {
      console.log("\nMeowJS session ended.\n");
      process.exit(0);
    });
  }

  static async main() {
    const args = process.argv.slice(2);
    let debugMode = false;
    let filePath = null;

    if (args.length === 0) {
      MeowJSCommandLine.showHelp();
      return;
    }

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      switch (arg) {
        case "-h":
        case "--help":
          MeowJSCommandLine.showHelp();
          return;

        case "-v":
        case "--version":
          MeowJSCommandLine.showVersion();
          return;

        case "-i":
        case "--info":
          MeowJSCommandLine.showCommandReference();
          return;

        case "-d":
        case "--debug":
          debugMode = true;
          break;

        case "--repl":
          await MeowJSCommandLine.startREPL();
          return;

        default:
          if (arg.endsWith(".mw")) {
            filePath = arg;
          } else {
            console.log("😿 Error: Unknown argument or invalid file extension");
            process.exit(1);
          }
          break;
      }
    }

    if (filePath) {
      if (!fs.existsSync(filePath)) {
        console.log(`😿 Error: File ${filePath} not found`);
        process.exit(1);
      }

      try {
        const interpreter = new MeowJSInterpreter(debugMode);
        const tokens = await interpreter.parseFile(filePath);
        await interpreter.execute(tokens);
      } catch (error) {
        console.log(`😿 Error: ${error.message}`);
        process.exit(1);
      }
    } else if (!debugMode) {
      // If no file path and not in debug mode, show help
      MeowJSCommandLine.showHelp();
    }
  }
}

if (require.main === module) {
  MeowJSCommandLine.main().catch(console.error);
}

module.exports = { MeowJSInterpreter, MeowJSCommandLine };

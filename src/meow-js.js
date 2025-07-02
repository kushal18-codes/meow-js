#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

class MeowJSInterpreter {
  constructor() {
    this.reset();
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
    this.output = "";
    this.programCounter = 0;
    this.stringStorage = "";
    this.dataStorage = {};
    this.variables = {};
    this.functions = {};
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
    let current = "";
    let inString = false;
    let stringDelimiter = "";
    let inComment = false;

    for (const char of code) {
      if (char === "#" && !inString) {
        if (current.trim()) {
          tokens.push(current.trim());
          current = "";
        }
        inComment = true;
        continue;
      }

      if (char === "\n" && inComment) {
        inComment = false;
        continue;
      }

      if (inComment) {
        continue;
      }

      if ((char === '"' || char === "'") && !inString) {
        if (current.trim()) {
          tokens.push(current.trim());
          current = "";
        }
        inString = true;
        stringDelimiter = char;
        current = char;
        continue;
      }

      if (char === stringDelimiter && inString) {
        current += char;
        tokens.push(current);
        current = "";
        inString = false;
        stringDelimiter = "";
        continue;
      }

      if (inString) {
        current += char;
        continue;
      }

      if (/\s/.test(char)) {
        if (current.trim()) {
          tokens.push(current.trim());
          current = "";
        }
        continue;
      }

      if (this.commandMap[char]) {
        if (current.trim()) {
          tokens.push(current.trim());
          current = "";
        }
        tokens.push(char);
        continue;
      }

      current += char;
    }

    if (current.trim()) {
      tokens.push(current.trim());
    }

    return tokens.filter((token) => token.length > 0);
  }

  async execute(tokens) {
    this.reset();
    const startTime = Date.now();

    console.log("\nStarting MeowJS execution...");
    console.log(`Number of commands: ${tokens.length}\n`);

    this.programCounter = 0;
    while (this.programCounter < tokens.length) {
      const token = tokens[this.programCounter];
      await this.executeCommand(token, tokens);
      this.programCounter++;
    }

    const endTime = Date.now();
    console.log(`\nExecution completed in ${endTime - startTime}ms\n`);

    return this.output;
  }

  async executeCommand(token, tokens) {
    if (token.startsWith('"') && token.endsWith('"')) {
      this.stringStorage = token.slice(1, -1);
      return;
    }

    if (token.startsWith("'") && token.endsWith("'")) {
      this.stringStorage = token.slice(1, -1);
      return;
    }

    const command =
      this.commandMap[token.toLowerCase()] || this.commandMap[token];

    if (!command) {
      if (!isNaN(token)) {
        this.value = parseInt(token);
      } else {
        this.stack.push(token);
      }
      return;
    }

    switch (command) {
      case "output":
        if (this.stringStorage) {
          process.stdout.write(this.stringStorage);
          this.output += this.stringStorage;
        } else {
          process.stdout.write(this.value.toString());
          this.output += this.value.toString();
        }
        break;

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

      case "newline":
        process.stdout.write("\n");
        this.output += "\n";
        break;

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
        this.loopStack.push({
          start: this.programCounter,
          count: this.value,
        });
        break;

      case "loop_end":
        if (this.loopStack.length > 0) {
          const loop = this.loopStack[this.loopStack.length - 1];
          loop.count--;

          if (loop.count > 0) {
            this.programCounter = loop.start;
          } else {
            this.loopStack.pop();
          }
        }
        break;

      case "if_start":
        this.ifStack.push({
          condition: this.value > 0,
          start: this.programCounter,
        });
        break;

      case "if_end":
        if (this.ifStack.length > 0) {
          this.ifStack.pop();
        }
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
        } else {
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
        this.output += "\n";
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

    if (args.length === 0) {
      MeowJSCommandLine.showHelp();
      return;
    }

    const arg = args[0];

    switch (arg) {
      case "-h":
      case "--help":
        MeowJSCommandLine.showHelp();
        break;

      case "-v":
      case "--version":
        MeowJSCommandLine.showVersion();
        break;

      case "-i":
      case "--info":
        MeowJSCommandLine.showCommandReference();
        break;

      case "--repl":
        await MeowJSCommandLine.startREPL();
        break;

      default:
        if (!arg.endsWith(".mw")) {
          console.log("😿 Error: MeowJS files must have .mw extension");
          process.exit(1);
        }

        if (!fs.existsSync(arg)) {
          console.log(`😿 Error: File ${arg} not found`);
          process.exit(1);
        }

        try {
          const interpreter = new MeowJSInterpreter();
          const tokens = await interpreter.parseFile(arg);
          await interpreter.execute(tokens);
        } catch (error) {
          console.log(`😿 Error: ${error.message}`);
          process.exit(1);
        }
        break;
    }
  }
}

if (require.main === module) {
  MeowJSCommandLine.main().catch(console.error);
}

module.exports = { MeowJSInterpreter, MeowJSCommandLine };

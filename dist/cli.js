"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeowJSCommandLine = void 0;
const interpreter_1 = require("./interpreter");
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
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
    const interpreter = new interpreter_1.MeowJSInterpreter(false, null);
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
    for (const arg of args) {
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
        const interpreter = new interpreter_1.MeowJSInterpreter(
          debugMode,
          null,
        );
        const tokens = await interpreter.parseFile(filePath);
        await interpreter.execute(tokens);
      } catch (error) {
        console.log(`😿 Error: ${error.message}`);
        process.exit(1);
      }
    } else if (!debugMode) {
      MeowJSCommandLine.showHelp();
    }
  }
}
exports.MeowJSCommandLine = MeowJSCommandLine;

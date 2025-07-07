import { MeowJSInterpreter } from "./interpreter.js";
import * as fs from "fs";
import * as readline from "readline";

export class MeowJSCommandLine {
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
    const interpreter = new MeowJSInterpreter(false, null);
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
        } catch (error: any) {
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
    let filePath: string | null = null;

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
        const interpreter = new MeowJSInterpreter(debugMode, null);
        const tokens = await interpreter.parseFile(filePath);
        await interpreter.execute(tokens);
      } catch (error: any) {
        console.log(`😿 Error: ${error.message}`);
        process.exit(1);
      }
    } else if (!debugMode) {
      MeowJSCommandLine.showHelp();
    }
  }
}

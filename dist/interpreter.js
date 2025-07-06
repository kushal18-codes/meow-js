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
exports.MeowJSInterpreter = void 0;
const constants_1 = require("./constants");
const fs = __importStar(require("fs"));
class MeowJSInterpreter {
  constructor(debug = false, outputElement = null) {
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
  async parseFile(filepath) {
    const content = fs.readFileSync(filepath, "utf8");
    return this.parseCode(content);
  }
  parseCode(code = "") {
    const tokens = [];
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
  preProcessJumps(tokens) {
    const jumpMap = {};
    const loopStack = [];
    const ifStack = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const command =
        constants_1.commandMap[token.toLowerCase()] ??
        constants_1.commandMap[token];
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
    this.jumpMap = this.preProcessJumps(tokens);
    this.programCounter = 0;
    while (this.programCounter < tokens.length) {
      const token = tokens[this.programCounter];
      await this.executeCommand(token, tokens);
      this.programCounter++;
    }
    return this.output;
  }
  async executeCommand(token, tokens) {
    if (this.isStringLiteral(token)) {
      this.stringStorage = token.slice(1, -1);
      return;
    }
    const command =
      constants_1.commandMap[token.toLowerCase()] ??
      constants_1.commandMap[token];
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
  isStringLiteral(token) {
    return (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'"))
    );
  }
  writeOutput(text) {
    if (typeof process !== "undefined" && process.stdout) {
      process.stdout.write(text);
    } else if (this.outputElement) {
      this.outputElement.textContent += text;
    }
    this.output += text;
  }
}
exports.MeowJSInterpreter = MeowJSInterpreter;
if (typeof module !== "undefined" && module.exports) {
  module.exports = { MeowJSInterpreter };
} else if (typeof window !== "undefined") {
  window.MeowJSInterpreter = MeowJSInterpreter;
}

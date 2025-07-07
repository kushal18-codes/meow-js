import { describe, beforeEach, it, expect } from "vitest";
import { MeowJSInterpreter } from "../dist/interpreter.js";

describe("MeowJSInterpreter", () => {
  let interpreter: MeowJSInterpreter;

  beforeEach(() => {
    interpreter = new MeowJSInterpreter();
  });

  describe("parseCode", () => {
    it("should parse a simple command", () => {
      const code = "meow";
      const tokens = interpreter.parseCode(code);
      expect(tokens).toEqual(["meow"]);
    });

    it("should parse multiple commands", () => {
      const code = "meow purr hiss";
      const tokens = interpreter.parseCode(code);
      expect(tokens).toEqual(["meow", "purr", "hiss"]);
    });

    it("should parse commands with string literals", () => {
      const code = '"hello world" meow';
      const tokens = interpreter.parseCode(code);
      expect(tokens).toEqual(['"hello world"', "meow"]);
    });

    it("should ignore comments", () => {
      const code = "meow # this is a comment";
      const tokens = interpreter.parseCode(code);
      expect(tokens).toEqual(["meow"]);
    });

    it("should handle single and double quoted strings", () => {
      const code = `"hello" 'world'`;
      const tokens = interpreter.parseCode(code);
      expect(tokens).toEqual(['"hello"', "'world'"]);
    });
  });

  describe("preProcessJumps", () => {
    it("should correctly map loop jumps", () => {
      const tokens = ["yarn", "meow", "ball"];
      const jumpMap = interpreter.preProcessJumps(tokens);
      expect(jumpMap).toEqual({ "0": 2, "2": 0 });
    });

    it("should correctly map if jumps", () => {
      const tokens = ["whiskers", "meow", "tail"];
      const jumpMap = interpreter.preProcessJumps(tokens);
      expect(jumpMap).toEqual({ "0": 2, "2": 0 });
    });

    it("should handle nested loops", () => {
      const tokens = ["yarn", "yarn", "meow", "ball", "ball"];
      const jumpMap = interpreter.preProcessJumps(tokens);
      expect(jumpMap).toEqual({ "0": 4, "1": 3, "3": 1, "4": 0 });
    });
  });

  describe("execute", () => {
    it("should execute a simple program", async () => {
      const tokens = ['"hello world"', "meow"];
      const output = await interpreter.execute(tokens);
      expect(output).toBe("hello world");
    });

    it("should handle variable set and get", async () => {
      const tokens = ['"hello"', "myVar", "nest", "myVar", "fetch", "meow"];
      const output = await interpreter.execute(tokens);
      expect(output).toBe("hello");
    });

    it("should handle basic arithmetic", async () => {
      const tokens = ["1", "2", "leap", "meow"]; // 1 + 2 = 3
      const output = await interpreter.execute(tokens);
      expect(output).toBe("3");
    });

    it("should handle loops", async () => {
      const tokens = ["purr", "purr", "purr", "yarn", "hiss", "meow", "ball"];
      const output = await interpreter.execute(tokens);
      expect(output).toBe("210");
    });

    it("should handle if statements", async () => {
      const tokens = [
        "purr",
        "whiskers",
        '"is one"',
        "meow",
        "tail",
        "hiss",
        "whiskers",
        '"is zero"',
        "meow",
        "tail",
      ];
      const output = await interpreter.execute(tokens);
      expect(output).toBe("is one");
    });
  });
});

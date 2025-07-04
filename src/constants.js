var commandMap = {
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

if (typeof module !== "undefined" && module.exports) {
  module.exports = { commandMap };
} else if (typeof window !== "undefined") {
  window.commandMap = commandMap;
}

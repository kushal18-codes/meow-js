# meow-js

> ⁠ᓚᘏᗢ

A cat-themed esoteric programming language that's purr-fectly functional!

## Features

- **Cat-themed commands**: Use natural feline terminology like `meow`, `purr`, `hiss`, `climb`, and `prowl`
- **Variables**: Store and retrieve data with `nest` and `fetch`
- **Functions**: Define reusable code blocks with `prowl` and call them with `stalk`
- **Data structures**: Stack operations and key-value storage
- **Control flow**: Loops with `yarn`/`ball` and conditionals with `whiskers`/`tail`
- **String handling**: Store and manipulate strings with cat-themed commands
- **Comments**: Use `#` for single-line comments

## Installation

```bash
git clone https://github.com/kushal18-codes/meow-js.git
cd meow-js
```

## Usage

### Running MeowJS files

```bash
node src/meow-js.js examples/hello.mw
```

### Interactive REPL

```bash
node src/meow-js.js --repl
```

### Help and documentation

```bash
node src/meow-js.js --help
node src/meow-js.js --info
```

## Command Reference

| Command | Action | Description |
|---------|---------|-------------|
| `meow` | Output | Print current value |
| `purr` | Increment | Add 1 to current value |
| `hiss` | Decrement | Subtract 1 from current value |
| `scratch` | Random | Generate random number (1-9) |
| `sleep` | Delay | Pause execution briefly |
| `groom` | Reset | Set current value to 0 |
| `pounce` | Multiply | Double current value |
| `stretch` | Newline | Print newline character |
| `hunt` | Input | Get input from user |
| `climb` | Push | Push value to stack |
| `fall` | Pop | Pop value from stack |
| `nest` | Variable Set | Store value in variable |
| `fetch` | Variable Get | Retrieve value from variable |
| `prowl` | Function Define | Define a function |
| `stalk` | Function Call | Call a function |
| `whiskers` | If Start | Begin conditional block |
| `tail` | If End | End conditional block |
| `yarn` | Loop Start | Begin loop |
| `ball` | Loop End | End loop |
| `claw` | Store String | Store string value |
| `paw` | Retrieve String | Get stored string |
| `litter` | Store Data | Store data structure |
| `box` | Retrieve Data | Get stored data |
| `leap` | Add | Add two values |
| `duck` | Subtract | Subtract two values |
| `sniff` | Equals | Check equality |
| `tower` | Greater Than | Check if greater |
| `crouch` | Less Than | Check if less |
| `;` | Statement End | End statement with newline |

## Examples

### Hello World
```meow
# Simple hello world program
"Hello World!" meow;      # Output the string "Hello World!"
"Welcome to MeowJS!" meow; # Output welcome message
```

### Variables
```meow
# Variable storage and retrieval example
"hello" nest greeting;    # Store "hello" in variable called "greeting"
fetch greeting meow;      # Get value from "greeting" variable and output it
```

### Functions
```meow
# Function definition and calling example
"hello" meow prowl sayHello;  # Define function "sayHello" that outputs "hello"
fetch sayHello stalk;         # Call the "sayHello" function
```

### Conditionals
```meow
# Conditional comparison example
5 nest number1;                          # Store 5 in variable "number1"
3 nest number2;                          # Store 3 in variable "number2"
fetch number1 fetch number2 tower whiskers "greater" meow tail;  # Compare if number1 > number2, if true output "greater"
```

## File Extension

MeowJS files use the `.mw` extension (short for MeoW).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

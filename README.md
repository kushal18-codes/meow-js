# meow-js

> ⁠ᓚᘏᗢ

A cat-themed esoteric programming language that's purr-fectly functional!

## Features

- **Cat-themed Commands**: A rich set of commands inspired by feline behavior.
- **Variables**: Store and retrieve values using `nest` and `fetch`.
- **Functions**: Define and call reusable blocks of code with `prowl` and `stalk`.
- **Data Structures**: Includes stack operations (`climb`, `fall`) and key-value storage (`litter`, `box`).
- **Control Flow**: Conditional blocks with `whiskers` and `tail`, and loops with `yarn` and `ball`.
- **String Manipulation**: Handle strings with `catnip` and `paw`.
- **Arithmetic and Comparison**: Perform calculations (`leap`, `duck`) and comparisons (`sniff`, `tower`, `crouch`).
- **Interactive REPL**: Experiment with MeowJS in an interactive shell.
- **File Execution**: Run MeowJS scripts from `.mw` files.

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
| `nap` | Delay | Pause execution briefly |
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
| `catnip` | Store String | Store string value |
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
greeting "hello" nest;    # Store "hello" in variable called "greeting"
greeting fetch meow;      # Get value from "greeting" variable and output it
```

### Conditionals

```meow
# Conditional comparison example
3 climb;                                 # Push 3 onto the stack
5 tower whiskers "5 is greater" meow tail; # Compares 5 (current value) > 3 (on stack)
```

## File Extension

MeowJS files use the `.mw` extension (short for MeoW).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

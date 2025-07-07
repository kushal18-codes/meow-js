# meow-js

> ⁠ᓚᘏᗢ

A cat-themed esoteric programming language that's purr-fectly functional!

## Features

- **Cat-themed Commands**: A rich set of commands inspired by feline behavior.
- **Variables**: Store and retrieve values using `nest` and `fetch`.
- **Functions**: Define and call reusable blocks of code with `prowl` and `stalk`.
- **Data Structures**: Includes stack operations (`climb`, `fall`) and key-value storage (`litter`, `box`).
- **Control Flow**: Conditional blocks with `whiskers` and `tail`, and loops with `yarn` and `ball`.
- **String Manipulation**: Handle strings with `catnip` (store) and `paw` (retrieve).
- **Arithmetic and Comparison**: Perform calculations (`leap`, `duck`, `pounce`, `purr`, `hiss`, `groom`) and comparisons (`sniff`, `tower`, `crouch`).
- **Input/Output**: Interact with the user using `meow` (output) and `hunt` (input).
- **Randomness**: Generate random numbers with `scratch`.
- **Timing**: Pause execution with `nap`.
- **Interactive REPL**: Experiment with MeowJS in an interactive shell.
- **File Execution**: Run MeowJS scripts from `.mw` files.

## Installation

```bash
git clone https://github.com/kushal18-codes/meow-js.git
cd meow-js
npm install
```

## Usage

### Running MeowJS files

```bash
node src/cli.js examples/hello.mw
```

### Interactive REPL

```bash
node src/cli.js --repl
```

### Help and documentation

```bash
node src/cli.js --help
node src/cli.js --info
```

## Command Reference

| Command    | Action          | Description                   |
| ---------- | --------------- | ----------------------------- |
| `meow`     | Output          | Print current value           |
| `purr`     | Increment       | Add 1 to current value        |
| `hiss`     | Decrement       | Subtract 1 from current value |
| `scratch`  | Random          | Generate random number (1-9)  |
| `nap`      | Delay           | Pause execution briefly       |
| `groom`    | Reset           | Set current value to 0        |
| `pounce`   | Multiply        | Double current value          |
| `stretch`  | Newline         | Print newline character       |
| `hunt`     | Input           | Get input from user           |
| `climb`    | Push            | Push value to stack           |
| `fall`     | Pop             | Pop value from stack          |
| `nest`     | Variable Set    | Store value in variable       |
| `fetch`    | Variable Get    | Retrieve value from variable  |
| `prowl`    | Function Define | Define a function             |
| `stalk`    | Function Call   | Call a function               |
| `whiskers` | If Start        | Begin conditional block       |
| `tail`     | If End          | End conditional block         |
| `yarn`     | Loop Start      | Begin loop                    |
| `ball`     | Loop End        | End loop                      |
| `catnip`   | Store String    | Store string value            |
| `paw`      | Retrieve String | Get stored string             |
| `litter`   | Store Data      | Store data structure          |
| `box`      | Retrieve Data   | Get stored data               |
| `leap`     | Add             | Add two values                |
| `duck`     | Subtract        | Subtract two values           |
| `sniff`    | Equals          | Check equality                |
| `tower`    | Greater Than    | Check if greater              |
| `crouch`   | Less Than       | Check if less                 |
| `;`        | Statement End   | End statement with newline    |

## Examples

### Hello World (`examples/hello.mw`)

```meow
# Simple hello world program
"Hello World!" meow;      # Output the string "Hello World!"
"Welcome to MeowJS!" meow; # Output welcome message
```

### Variables (`examples/variable.mw`)

```meow
# Variable storage and retrieval example

# Store a string in a variable
myVar "Hello from a variable!" nest;

# Retrieve the value from 'myVar' and print it
myVar fetch meow;

# Store a number in a variable
count 10 nest;

# Retrieve and print the number
count fetch meow;

# Update the value of a variable
count 20 nest;

# Retrieve and print the updated number
count fetch meow;
```

### Conditionals (`examples/conditionals.mw`)

```meow
# Conditional comparison example

# Example 1: Greater Than
# Check if 5 is greater than 3
5 climb;
3 climb;
tower whiskers "5 is greater than 3" meow tail;

# Example 2: Less Than
# Check if 3 is less than 5
3 climb;
5 climb;
crouch whiskers "3 is less than 5" meow tail;

# Example 3: Equals
# Check if 5 is equal to 5
5 climb;
5 climb;
sniff whiskers "5 is equal to 5" meow tail;

# Example 4: Not Equal (using a combination of sniff and whiskers)
# Check if 5 is not equal to 3
5 climb;
3 climb;
sniff whiskers "5 is equal to 3 (this should not print)" meow tail;
# To express "not equal", you would typically use a combination of sniff and then
# an inverted logic or a separate command if available.
# For now, we'll just show the equality check.
```

### Functions (`examples/functions.mw`)

```meow
# Function definition and calling example

# Define a function named 'greet' that takes a name as an argument
# and prints a greeting message.
"Hello, " climb fetch climb "! Meow!" climb meow prowl greet;

# Call the 'greet' function with different names
"Whiskers" greet stalk;
"Mittens" greet stalk;
```

### Data Structures (`examples/data.mw`)

```meow
# Data structure storage example

# Store a list of items at key "myList"
"item1" climb "item2" climb "item3" climb "myList" litter;

# Retrieve the list and print its contents
"myList" box;
fall meow; # Output: item3
fall meow; # Output: item2
fall meow; # Output: item1

# Store a key-value pair (dictionary-like) at key "myDict"
"valueA" climb "keyA" climb "valueB" climb "keyB" climb "myDict" litter;

# Retrieve the dictionary and demonstrate accessing values (conceptual, as direct key access isn't shown)
"myDict" box;
fall meow; # Output: keyB
fall meow; # Output: valueB
fall meow; # Output: keyA
fall meow; # Output: valueA
```

### String Manipulation (`examples/string.mw`)

```meow
# String storage and retrieval example

# Store a string using catnip
"MeowJS is fun!" catnip;

# Retrieve the stored string using paw and print it
paw meow;

# Store another string
"Cats are awesome." catnip;

# Retrieve and print the new string
paw meow;
```

## File Extension

MeowJS files use the `.mw` extension (short for MeoW).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

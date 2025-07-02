#!/usr/bin/env node

const fs = require('fs');

class MeowJSInterpreter {
    constructor() {
        this.value = 0;
        this.output = '';
    }

    execute(code) {
        const tokens = code.trim().split(/\s+/);

        console.log(`🐱 Executing ${tokens.length} meow commands...`);

        for (const token of tokens) {
            this.executeCommand(token);
        }

        return this.output;
    }

    executeCommand(command) {
        switch (command.toLowerCase()) {
            case 'meow':
                process.stdout.write(this.value.toString());
                this.output += this.value.toString();
                break;

            case 'purr':
                this.value++;
                break;

            case 'hiss':
                this.value--;
                break;

            case 'stretch':
                process.stdout.write('\n');
                this.output += '\n';
                break;

            default:
                break;
        }
    }
}

function main() {
    const filename = process.argv[2];

    if (!filename) {
        console.log('Usage: node meowjs.js <file.mw>');
        console.log('Example: node meowjs.js hello.mw');
        return;
    }

    try {
        const code = fs.readFileSync(filename, 'utf8');
        const interpreter = new MeowJSInterpreter();
        interpreter.execute(code);
    } catch (error) {
        console.log(`😿 Error: ${error.message}`);
    }
}

if (require.main === module) {
    main();
}

module.exports = MeowJSInterpreter;

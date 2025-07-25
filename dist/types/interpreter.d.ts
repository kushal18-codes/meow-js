export declare class MeowJSInterpreter {
    debug: boolean;
    outputElement: HTMLElement | null;
    value: number;
    stack: any[];
    memory: number[];
    loopStack: any[];
    ifStack: any[];
    programCounter: number;
    stringStorage: string;
    dataStorage: Record<string, any>;
    variables: Record<string, any>;
    functions: Record<string, any>;
    jumpMap: Record<string, any>;
    output: string;
    constructor(debug?: boolean, outputElement?: HTMLElement | null);
    reset(): void;
    parseFile(filepath: string): Promise<string[]>;
    parseCode(code?: string): string[];
    preProcessJumps(tokens: string[]): Record<string, any>;
    execute(tokens: string[]): Promise<string>;
    private handleOutput;
    private isValidVariableName;
    private handleVariableSet;
    private handleVariableGet;
    private handleArithmetic;
    executeCommand(token: string, tokens: string[]): Promise<void>;
    isStringLiteral(token: string): boolean;
    writeOutput(text: string): void;
}

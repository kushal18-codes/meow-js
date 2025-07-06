declare global {
  interface Window {
    MeowJSInterpreter: any;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const codeElement = document.getElementById("code") as HTMLTextAreaElement;
  const runButton = document.getElementById("run") as HTMLButtonElement;
  const outputElement = document.getElementById("output") as HTMLElement;
  const interpreter = new window.MeowJSInterpreter(false, outputElement);

  runButton.addEventListener("click", async () => {
    const code = codeElement.value;
    const tokens = interpreter.parseCode(code);
    await interpreter.execute(tokens);
  });
});

export {};

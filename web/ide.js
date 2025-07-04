document.addEventListener("DOMContentLoaded", () => {
  const codeElement = document.getElementById("code");
  const runButton = document.getElementById("run");
  const outputElement = document.getElementById("output");
  const interpreter = new MeowJSInterpreter(false, outputElement);

  runButton.addEventListener("click", async () => {
    const code = codeElement.value;
    const tokens = interpreter.parseCode(code);
    await interpreter.execute(tokens);
  });
});

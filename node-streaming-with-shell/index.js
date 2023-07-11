const { createElement } = require("react");
const { renderToPipeableStream } = require("react-dom/server");
const express = require("express");
const app = express();

app.use("/", (request, response) => {
  const reactTree = createElement(
    "h1",
    { className: "greeting" },
    "Hello World!"
  );
  const { pipe } = renderToPipeableStream(reactTree, {
    bootstrapScriptContent: 'alert("Shell JS run before streaming content");',
    onShellReady: () => {
      pipe(response);
    },
  });
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000");
});

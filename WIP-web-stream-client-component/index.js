const { createElement } = require("react");
const { renderToPipeableStream } = require("react-dom/server");
const express = require("express");
const app = express();

app.use("/", (request, response) => {
  const reactTree = createElement("h1", "Server component", clientComponent);
  const { pipe } = renderToPipeableStream(reactTree, {
    bootstrapScriptContent:
      'const clientComponent = createElement("h1", "client compnent");',
    onShellReady: () => {
      pipe(response);
    },
  });
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000");
});

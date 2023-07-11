const React = require("react");
const { renderToPipeableStream } = require("react-dom/server");
const express = require("express");
const app = express();

app.use("/", (request, response) => {
  const DelayedContent = () => {
    React.use(
      new Promise((resolve) => {
        setTimeout(resolve, 3000);
      })
    );
    return React.createElement("p", null, "done.");
  };
  const reactTree = React.createElement(
    "div",
    null,
    React.createElement("h1", null, "Hello world"),
    React.createElement(
      React.Suspense,
      { fallback: React.createElement("p", null, "waiting...") },
      React.createElement(DelayedContent, null)
    )
  );
  const { pipe } = renderToPipeableStream(reactTree, {
    onShellReady: () => {
      pipe(response);
    },
  });
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000");
});

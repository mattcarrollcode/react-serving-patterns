const { createElement } = require("react");
const { renderToPipeableStream } = require("react-dom/server");
const express = require("express");
const app = express();

const bootstrapScriptContent = `
const root = document.getElementById("root");
const app = React.createElement("h1", null, "Hello, world!");
ReactDOM.hydrateRoot(root, app);
`;

app.get("/", (request, response) => {
  const reactTree = createElement(
    "div",
    { id: "root" },
    createElement("h1", null, "Hello World!")
  );
  const stream = renderToPipeableStream(reactTree, {
    // bootstrapScriptContent: bootstrapScriptContent,
    bootstrapScripts: ["/main2.js"],
    onAllReady() {
      response.setHeader("content-type", "text/html");
      stream.pipe(response);
    },
  });
});

// This does work because React on the client side hasn't loaded yet
// I think the "right" way to do this is a bundler but I was hoping
// To make the simpliest example without any "magic" so others
// (including bundler maintainers/contributors) could use this to
// understand RSCs and the primatives to integrate them
// All the ways I can think of to get around the bundler requirement
// are very hacky (e.g. retriving a string of minified react and
// including it in script contents)
// Another option might be including the script in the head of the HTML
// but I'm not sure if that is violating best practices
app.get("/main2.js", (req, res) => {
  const scriptContent = `
  const root = document.getElementById("root");
  const app = React.createElement("h1", null, "Hello, world!");
  ReactDOM.hydrateRoot(root, app);
  `;
  res.type("text/javascript");
  res.send(scriptContent);
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000");
});

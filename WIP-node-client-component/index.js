const register = require("react-server-dom-webpack/node-register");
register();

const React = require("react");
const { renderToPipeableStream } = require("react-server-dom-webpack/server");
const express = require("express");
const app = express();
const { ClientComponent } = require("./client-component");

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

app.get("/rsc", (request, response) => {
  async function ServerComponent() {
    // await new Promise((resolve) => {
    //   setTimeout(resolve, 3000);
    // });
    return React.createElement("p", null, "server component");
  }
  const reactTree = React.createElement(
    "div",
    null,
    React.createElement(ServerComponent, null),
    React.createElement(ClientComponent, null)
  );
  const clientComponentManifest = {
    [`file://${__dirname}/client-component.js`]: {
      id: `/client-component.js`,
      chunks: [],
      name: "ClientComponent",
      async: false,
    },
  };
  const { pipe } = renderToPipeableStream(reactTree, clientComponentManifest);
  pipe(response);
});

app.get("/client-component.js", (request, response) => {
  response.sendFile(__dirname + "/client-component-browser.js");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000");
});

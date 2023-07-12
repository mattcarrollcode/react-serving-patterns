const register = require("react-server-dom-webpack/node-register");
// register() needs to be called before other imports
// so that React can parse the "use client" directive from
// module imports
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
  // react-dom.development.js:25109 Uncaught ReferenceError: __webpack_require__ is not defined
  //   at requireModule (react-server-dom-webpack-client.browser.development.js:137:25)
  //   at initializeModuleChunk (react-server-dom-webpack-client.browser.development.js:1166:19)
  //   at readChunk (react-server-dom-webpack-client.browser.development.js:991:9)
  //   at mountLazyComponent (react-dom.development.js:15608:21)
  //   at beginWork$1 (react-dom.development.js:17319:18)
  //   at beginWork (react-dom.development.js:25692:16)
  //   at performUnitOfWork (react-dom.development.js:24543:14)
  //   at workLoopConcurrent (react-dom.development.js:24529:7)
  //   at renderRootConcurrent (react-dom.development.js:24485:11)
  //   at performConcurrentWorkOnRoot (react-dom.development.js:23342:40)
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

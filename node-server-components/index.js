const React = require("react");
const { renderToPipeableStream } = require("react-server-dom-webpack/server");
const express = require("express");
const app = express();

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

app.get("/rsc", (request, response) => {
  async function ServerComponent() {
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    return React.createElement("p", null, "server component");
  }
  const { pipe } = renderToPipeableStream(
    React.createElement(ServerComponent, null)
  );
  pipe(response);
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000");
});

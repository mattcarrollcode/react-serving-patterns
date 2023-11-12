const React = require("react");
const { renderToPipeableStream } = require("react-server-dom-webpack/server");
const { renderToString } = require("react-dom/server");
const express = require("express");
const app = express();
const fs = require('fs');

function Message({message}){
  return React.createElement("p", {}, message)
}

function App({root}){
  return React.createElement("div", {id:"root"}, Message({message: "SSR"}))
}

app.get("/", (request, response) => {
  console.log("/ hit")
  // Get template replace the root div with our React app
  const indexTemplate = fs.readFileSync('index.html', 'utf8');
  const app = App({root: true})
  const appHtml = renderToString(app);
  // TODO: replace this with templating system like ejs
  const html = indexTemplate.replace('<div id="root"></div>', appHtml);
  console.log(html)
  response.send(html);
});

app.get("/rsc", (request, response) => {
  console.log("/rsc/ hit")
  async function ServerComponent() {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    const rsc = React.createElement(Message, {message:"server component"})
    console.log(rsc)
    return rsc
  }
  const { pipe } = renderToPipeableStream(
    ServerComponent()
  );
  pipe(response);
});

const port = 3005

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

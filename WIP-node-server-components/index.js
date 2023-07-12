const React = require("react");
const { renderToPipeableStream } = require("react-dom/server");
const express = require("express");
const app = express();

app.get("/", (request, response) => {
  response.setHeader("Content-Type", "text/html");
  response.send(`
  <html>
  <head>
    <script src="https://www.unpkg.com/react@18.3.0-canary-7118f5dd7-20230705/umd/react.development.js" crossorigin></script>
    <script src="https://www.unpkg.com/react-dom@18.3.0-canary-7118f5dd7-20230705/umd/react-dom.development.js" crossorigin></script>
    <script src="https://www.unpkg.com/react-server-dom-webpack@18.3.0-canary-7118f5dd7-20230705/umd/react-server-dom-webpack-client.browser.development.js" crossorigin></script>
  </head>
  <body>
    <h1>Static HTML</h1>
    <div id="root"></div>
    <script>
      let rsc = null;
      function App() {
        if (!rsc) {
          rsc = ReactServerDOMClient.createFromFetch(
            fetch("/rsc", {
              headers: {
                Accept: "text/x-component",
              },
            })
          );
        }
        return rsc;
      }
      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(
        React.createElement(
          React.Suspense,
          { fallback: "Loading..." },
          React.createElement(App, null)
        )
      );
    </script>
  </body>
  </html>
  `);
});

app.get("/rsc", (request, response) => {
  async function ServerComponent() {
    // await new Promise((resolve) => {
    //   setTimeout(resolve, 3000);
    // });
    return React.createElement("p", null, "server component");
  }
  const { pipe } = renderToPipeableStream(
    React.createElement(ServerComponent, null),
    {
      ServerComponent: {
        id: "ServerComponent",
      },
      chunks: [],
      name: "default",
    }
  );
  pipe(response);
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000");
});

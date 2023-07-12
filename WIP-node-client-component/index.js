const { createElement } = require("react");
const { renderToReadableStream } = require("react-dom/server");
const express = require("express");
const app = express();

app.get("/", (request, response) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`
    <h1>Static HTML</h1>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <div id="root"><div>
    
  `);
  const reactTree = createElement(
    "div",
    null,
    createElement("h1", null, "Server component"),
    createElement("Counter", null)
  );
});

// Endpoint to retrive the client compontent's Javascript
// This is usally handled by the framework/bunder
app.get("/client-component.js", (request, response) => {
  const stream = renderToPipeableStream(reactTree, {
    // This is the client component map which is
    // usally created by the framework and/or bundler
    "/client-component.js": {
      id: "/client-component.js",
      name: "Counter",
      chunks: [],
      async: true,
    },
    onShellReady: () => {
      pipe(response);
    },
  });
  const scriptContent = response.type("text/javascript");
  response.send(`
  "use client"

  function counter() {
    const [count, setCount] = useState(0);

    function handleClick() {
      setCount(count + 1);
    }

    return React.createElement(
      "button",
      { onClick: handleClick },
      "You pressed me ",
      count,
      " times"
    );
  }`);
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000");
});

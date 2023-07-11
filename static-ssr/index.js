const { renderToStaticMarkup } = require("react-dom/server");
const { createElement } = require("react");

function Greeting({ name }) {
  return createElement("h1", { id: "greeting" }, "Hello World");
}

const html = renderToStaticMarkup(greeting);

console.log(html);

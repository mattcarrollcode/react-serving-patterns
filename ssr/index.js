const { renderToStaticMarkup } = require("react-dom/server");
const { createElement } = require("react");

function Greeting({ name }) {
  return createElement(
    "h1",
    { className: "greeting" },
    "Hello ",
    createElement("i", null, name),
    ". Welcome!"
  );
}

const greeting = Greeting("world");

const html = renderToStaticMarkup(greeting);

console.log(html);

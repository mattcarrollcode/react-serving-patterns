let rsc = null;
function App() {
  if (!rsc) {
    rsc = ReactServerDOMClient.createFromFetch(
      fetch("/app", {
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

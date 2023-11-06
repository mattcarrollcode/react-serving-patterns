import React from "npm:react@0.0.0-experimental-ce2bc58a9-20231102";
import { renderToReadableStream } from "npm:react-dom@0.0.0-experimental-ce2bc58a9-20231102/server";
const { use, useState, Suspense } = React;

function fetchMessage(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay, "React"));
}

function Message({ messagePromise }) {
  const messageContent = React.use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

function App() {
  const [messagePromise1] = useState(() => fetchMessage(1000));
  const [messagePromise2] = useState(() => fetchMessage(2000));
  const [messagePromise3] = useState(() => fetchMessage(3000));
  return (
    <>
      <h1>renderToReadableStream allReady example</h1>
      <Suspense fallback={<p>⌛Downloading 1st message...</p>}>
        <Message messagePromise={messagePromise1} />
      </Suspense>
      <Suspense fallback={<p>⌛Downloading 2nd message...</p>}>
        <Message messagePromise={messagePromise2} />
      </Suspense>
      <Suspense fallback={<p>⌛Downloading 3rd message...</p>}>
        <Message messagePromise={messagePromise3} />
      </Suspense>
    </>
  );
}

async function handler() {
  console.time("Time for stream to start");
  const stream = await renderToReadableStream(<App />, {});
  console.timeEnd("Time for stream to start");
  console.time("Time waiting for stream to be ready");
  await stream.allReady;
  console.timeEnd("Time waiting for stream to be ready");
  return new Response(stream, {
    status: 200,
    headers: { "content-type": "text/html" },
  });
}

Deno.serve({ port: 3000 }, handler);

import React from "npm:react@0.0.0-experimental-ce2bc58a9-20231102"
import { renderToReadableStream } from "npm:react-dom@0.0.0-experimental-ce2bc58a9-20231102/server";

async function handler() {
    const stream = await renderToReadableStream(<h1>Hi!</h1>, {});
    await stream.allReady;
    return new Response(stream, {
        status: 200,
        headers: { 'content-type': 'text/html' },
    })
}

const response = await handler()
console.log(await response.text())

// Load variables from .env into process.env before anything else reads them.
require("dotenv").config({ quiet: true });

const { createApp } = require("./app");


const PORT = Number(process.env.PORT) || 5000;

const app = createApp();


const server = app.listen(PORT, () => {
  console.log(`Huddle server listening on http://localhost:${PORT}`);
});


// Graceful shutdown: on Ctrl+C (SIGINT) or a platform stop signal (SIGTERM),
// stop accepting new connections and let in-flight requests finish.
function shutdown(signal) {
  console.log(`${signal} received, shutting down...`);

  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

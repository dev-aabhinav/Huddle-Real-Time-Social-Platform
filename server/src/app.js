const express = require("express");


// Build and return the Express app.
// We do NOT call app.listen() here — that happens in server.js.
// Keeping them separate lets tests import the app without opening a port.
function createApp() {
  const app = express();


  // Don't advertise "X-Powered-By: Express" — it tells attackers our stack for free.
  app.disable("x-powered-by");


  // Middleware: parse JSON request bodies into req.body.
  // The 100kb limit stops someone from sending a huge body to eat our memory.
  app.use(express.json({ limit: "100kb" }));


  // Health check: a cheap route that tells us "the process is alive".
  // Load balancers and uptime monitors hit this.
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });


  // 404 handler: runs only if no route above matched.
  app.use((req, res) => {
    res.status(404).json({
      error: `Route not found: ${req.method} ${req.originalUrl}`,
    });
  });


  // Error handler: Express recognises it because it takes 4 arguments.
  // Any error thrown in a route (sync or async in Express 5) ends up here.
  app.use((err, req, res, next) => {
    const status = err.status || 500;

    if (status === 500) {
      console.error(err);
    }

    res.status(status).json({
      error: status === 500 ? "Internal server error" : err.message,
    });
  });


  return app;
}


module.exports = { createApp };

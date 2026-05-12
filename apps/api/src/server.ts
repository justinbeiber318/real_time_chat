import "dotenv/config";
import { createServer } from "node:http";
import { createApp } from "./app.js";
import { createSocketServer } from "./socket.js";

const app = createApp();
const httpServer = createServer(app);

createSocketServer(httpServer);

const PORT = Number(process.env.PORT) || 4000;

httpServer.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
import cors from "cors";
import express from "express";
import { mw } from "request-ip";
import { Server } from "socket.io";
import { createServer } from "http";

import { corsOptions, connectToDb, initFirebase } from "./config/index.js";
import { userRoutes } from "./controllers/user.controller.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { timeLogger } from "./utils/timeLogger.js";

const app = express();
const server = createServer(app);

// for socket
const io = new Server(server, {
  pingTimeout: 60000,
  cors: corsOptions,
});

app.use(cors(corsOptions));
app.use(mw());

// make io available everywhere
app.set("io", io);

app.use("/user", userRoutes);
app.use(errorHandler);

const port = process.env.PORT || 4001; // use 4001 if not provided

initFirebase();
connectToDb()
  .then(() => {
    server.listen(port, () => timeLogger(`Server running on port: ${port}`));
  })
  .catch(timeLogger);

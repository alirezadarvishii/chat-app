const { createServer } = require("http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5500",
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("message", (args) => {
    console.log(args);
  });
});

httpServer.listen(3000, () =>
  console.log("Application Running Successfully on port 3000!")
);

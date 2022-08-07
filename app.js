const path = require("path");
const { createServer } = require("http");
const express = require("express");
const dotenv = require("dotenv");

const app = express();
const httpServer = createServer(app);
const { Server } = require("socket.io");
const handler = require("./handler");

const io = new Server(httpServer);
const eventHandler = handler(io);
dotenv.config({ path: "./config/.env" });

app.use(express.static("public"));

// Application endpoints
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/chatroom", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Socket events
const onConnection = (socket) => {
  socket.on("disconnect", eventHandler.socketDisconnected);

  socket.on("new_user", eventHandler.newUser);

  socket.on("new_message", eventHandler.newMessage);

  socket.on("pv_message", eventHandler.pvMessage);
};

io.on("connection", onConnection);

const { PORT } = process.env;

httpServer.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`);
});

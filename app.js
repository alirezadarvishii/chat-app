const path = require("path");
const { createServer } = require("http");
const express = require("express");

const app = express();
const httpServer = createServer(app);
const { Server } = require("socket.io");

const io = new Server(httpServer);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/chatroom", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

const usersList = {};
io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    delete usersList[socket.id];
  });

  socket.on("new_user", (args) => {
    usersList[socket.id] = args.username;
    io.emit("online_users", usersList);
  });

  socket.on("pv_chat", (data) => {
    io.to(data.to).emit("pv_chat", data.messageText);
  });
});

httpServer.listen(3000, () => console.log("Application started...!"));

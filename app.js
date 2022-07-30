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

  socket.on("new_user", (data) => {
    socket.join(data.chatroom);
    usersList[data.chatroom] = {
      ...usersList[data.chatroom],
      [socket.id]: data.username,
    };
    socket.data.username = data.username;
    socket.data.chatroom = data.chatroom;
    io.in(data.chatroom).emit("online_users", usersList[data.chatroom]);
  });

  socket.on("disconnect", () => {
    if (socket.data.chatroom) {
      delete usersList[socket.data.chatroom][socket.id];
      io.in(socket.data.chatroom).emit(
        "online_users",
        usersList[socket.data.chatroom]
      );
    }
  });

  socket.on("new_message", (messageDto) => {
    socket.broadcast.emit("new_message", messageDto);
  });

  socket.on("pv_message", (data) => {
    const messageDto = {
      message: data.message,
      sender: data.sender,
      senderId: data.socketId,
    };
    socket.to(data.to).emit("pv_message", messageDto);
  });
});

httpServer.listen(3000, () => console.log("Application started"));

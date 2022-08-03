const usersList = {};

function handler(io) {
  function socketDisconnected() {
    const socket = this;
    if (socket.data.chatroom) {
      delete usersList[socket.data.chatroom][socket.id];
      io.in(socket.data.chatroom).emit(
        "online_users",
        usersList[socket.data.chatroom]
      );
    }
  }

  function newUser(data) {
    const socket = this;
    socket.join(data.chatroom);
    usersList[data.chatroom] = {
      ...usersList[data.chatroom],
      [socket.id]: data.username,
    };
    socket.data.username = data.username;
    socket.data.chatroom = data.chatroom;
    io.in(data.chatroom).emit("online_users", usersList[data.chatroom]);
  }

  function newMessage(messageDto) {
    const socket = this;
    socket.broadcast.emit("new_message", messageDto);
  }

  function pvMessage(data) {
    const socket = this;
    const messageDto = {
      message: data.message,
      sender: data.sender,
      senderId: data.socketId,
    };
    socket.to(data.to).emit("pv_message", messageDto);
  }

  return {
    socketDisconnected,
    newUser,
    newMessage,
    pvMessage,
  };
}

module.exports = handler;

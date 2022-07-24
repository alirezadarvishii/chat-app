const { Server } = require("socket.io");

class Socket {
  constructor(httpServer) {
    this.io = new Server(httpServer);
  }
}

module.exports = Socket;

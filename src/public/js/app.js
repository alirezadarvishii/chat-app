const socket = io("http://localhost:3000");

const clientName = prompt("Please enter your name...");
const sendMessage = document.querySelector("#send_message");
const message = document.querySelector("#message");

socket.on("connect", () => {
  console.log(socket.id);
});

document.addEventListener("DOMContentLoaded", () => {
  socket.emit("login", {
    clientName,
  });
});

sendMessage.addEventListener("click", () => {
  socket.emit("message", {
    message: message.value,
    sender: clientName,
  });
});

socket.on("new_message", (args) => {
  console.log(args);
});

message.addEventListener("keypress", () => {
  socket.emit("typing", {
    client: clientName,
  });
});

socket.on("typing", (args) => {
  console.log(`${args.client} is typing...`);
});

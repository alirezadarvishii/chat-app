const socket = io("http://localhost:3000");

const sendMessage = document.querySelector("#send_message");
const message = document.querySelector("#message");

socket.on("connect", () => {
  console.log(socket.id);
});

sendMessage.addEventListener("click", () => {
  const messageValue = message.value;
  const messageDto = {
    message: messageValue,
    sender: socket.id,
  };
  socket.emit("message", messageDto);
});

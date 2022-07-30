const socket = io("http://localhost:3000");

// DOM Selectors
const message = document.querySelector("#message-text");
const sendMessageForm = document.querySelector("#send-message");
const membesrList = document.querySelector(".members-list");
const messagesBox = document.querySelector("#messages-box");
const logout = document.querySelector("#logout");
const pvMessageForm = document.querySelector("#pv-message-form");
const pvModal = document.querySelector(".modal");

// Variables
const username = localStorage.getItem("username");
const chatroom = localStorage.getItem("chatroom");

function onlineUsers(users) {
  membesrList.innerHTML = "";
  for (user in users) {
    membesrList.innerHTML += `<li class="p-2 border-bottom" style="background-color: #eee">
              <div class="d-flex justify-content-between align-items-center">
                  <div class="pt-1">
                    <p class="fw-bold username mb-0 ${
                      socket.id === user ? "text-danger" : "text-primary"
                    }">${users[user]}</p>
                  </div>
                  ${
                    socket.id !== user
                      ? `<div>
                        <button class="btn btn-secondary btn-sm pv-modal-opener" data-bs-toggle="modal" data-bs-target="#pv-message-modal" data-id=${user}>
                          Pv Message
                        </button>
                      </div>`
                      : ""
                  }
              </div>
        </li>`;
    const pvModalOpener = document.querySelectorAll(".pv-modal-opener");
    pvModalOpener.forEach((el) => {
      el.addEventListener("click", (e) => {
        const { id } = e.target.dataset;
        pvMessageForm.dataset.target = id;

        const username = e.target
          .closest("li")
          .querySelector(".username").textContent;
        pvModal.querySelector(
          ".modal-title"
        ).textContent = `Send pv message to: ${username}`;
      });
    });
  }
}

function sendMessage() {
  const messageText = message.value;
  const messageDto = {
    text: messageText,
    sender: username,
    socketId: socket.id,
  };
  addMessage(true, messageDto);
  socket.emit("new_message", messageDto);
  message.value = "";
}

function sendPvMessage() {
  const message = pvMessageForm.querySelector("textarea").value;
  const to = pvMessageForm.dataset.target;
  const messageDto = {
    message,
    to,
    sender: username,
    socketId: socket.id,
  };
  socket.emit("pv_message", messageDto);
}

function addMessage(isSelf, messageDto) {
  if (isSelf) {
    messagesBox.innerHTML += `<li class="d-flex justify-content-between mb-4 w-75 ms-auto">
                <div class="card w-100">
                  <div class="card-header d-flex justify-content-between p-3">
                    <p class="text-muted small mb-0">
                      <i class="far fa-clock"></i> ${new Date().getHours()}:${new Date().getMinutes()}
                    </p>
                    <p class="fw-bold mb-0">You</p>
                  </div>
                  <div class="card-body">
                    <p class="mb-0">
                      ${messageDto.text}
                    </p>
                  </div>
                </div>
              </li>`;
  } else {
    messagesBox.innerHTML += `<li class="d-flex justify-content-between mb-4 w-75">
                <div class="card w-100">
                  <div class="card-header d-flex justify-content-between p-3">
                    <p class="fw-bold mb-0">${messageDto.sender}</p>
                    <p class="text-muted small mb-0">
                      <i class="far fa-clock"></i> ${new Date().getHours()}:${new Date().getMinutes()}
                    </p>
                  </div>
                  <div class="card-body">
                    <p class="mb-0">
                    ${messageDto.text}
                    </p>
                  </div>
                </div>
              </li>`;
  }
}

function handleLogout() {
  localStorage.clear();
  window.location.replace("/");
}

function pvMessage(messageDto) {
  const modal = document.querySelector(".modal");
  modal.querySelector(
    ".modal-title"
  ).textContent = `Send pv message to: ${messageDto.sender}`;
  modal.querySelector(".modal-body").textContent = messageDto.message;
  modal.querySelector("form").dataset.target = messageDto.senderId;
  const pvModal = new bootstrap.Modal(".modal");
  pvModal.show();
}

// Socket Events
socket.emit("new_user", {
  username,
  chatroom,
});

socket.on("online_users", (users) => {
  onlineUsers(users);
});

socket.on("new_message", (messageDto) => {
  addMessage(false, messageDto);
});

socket.on("pv_message", (messageDto) => {
  pvMessage(messageDto);
});

// Event Listeners
sendMessageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

pvMessageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendPvMessage();
});

logout.addEventListener("click", handleLogout);

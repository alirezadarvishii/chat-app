const socket = io("http://localhost:3000");

// DOM Selectors
const message = document.querySelector("#message");
const sendMessageForm = document.querySelector("#send_message");
const peopleList = document.querySelector(".people-list > ul");

function onlineUsers(users) {
  peopleList.innerHTML = "";
  for (user in users) {
    peopleList.innerHTML += `<li class="clearfix people" data-id="${user}" style="${
      user === socket.id ? "background: #f6f6f6" : ""
    }">
    <div class="about">
      <div class="name">${users[user]} 
      ${
        user === socket.id
          ? "<span style='color: #ccc; font-size: 10px'>(you)</span>"
          : ""
      }
      </div>
      <div class="status">
        <i class="fa fa-circle online"></i> online
      </div>
    </div>
  </li>`;
  }

  const peoples = document.querySelectorAll(".people-list > ul > li");

  peoples.forEach((el) => {
    el.addEventListener("click", (e) => {
      const { id } = e.target.dataset;
      sendMessageForm.dataset.target = id;
    });
  });
}

sendMessageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const messageText = message.value;
  const to = sendMessageForm.dataset.target;
  socket.emit("pv_chat", {
    messageText,
    to,
  });
});

socket.emit("new_user", {
  username,
});

socket.on("online_users", (users) => {
  onlineUsers(users);
});

socket.on("pv_chat", (args) => {
  console.log(args);
});

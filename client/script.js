const socket = io();

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const usernameInput = document.getElementById("username");

let registered = false;

usernameInput.addEventListener("change", () => {
  if (!registered && usernameInput.value.trim()) {
    socket.emit("register", usernameInput.value.trim());
    registered = true;
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const msg = input.value;
  if (!msg) return;

  if (msg.startsWith("/w ")) {
    const parts = msg.split(" ");
    const to = parts[1];
    const text = parts.slice(2).join(" ");
    socket.emit("private message", { to, text });
  } else {
    socket.emit("chat message", msg);
  }
  input.value = "";
});

socket.on("chat message", function ({ from, text }) {
  const item = document.createElement("li");
  item.textContent = `${from}: ${text}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

socket.on("private message", function ({ from, text }) {
  const item = document.createElement("li");
  item.textContent = `(Private) ${from}: ${text}`;
  item.style.fontStyle = "italic";
  item.style.color = "#c0392b";
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

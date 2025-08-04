const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

app.use(express.static(path.join(__dirname, "../client")));

const users = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("register", (username) => {
    users[socket.id] = username;
    console.log(`${username} registered with ID ${socket.id}`);
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", { from: users[socket.id] || "Anonymous", text: msg });
  });

  socket.on("private message", ({ to, text }) => {
    for (const id in users) {
      if (users[id] === to) {
        io.to(id).emit("private message", {
          from: users[socket.id] || "Anonymous",
          text,
        });
        break;
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`${users[socket.id] || "A user"} disconnected`);
    delete users[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

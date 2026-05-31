const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        gameState: {}
      };
    }

    rooms[roomId].players.push(socket.id);

    io.to(roomId).emit("room-update", rooms[roomId]);
  });

  socket.on("game-update", ({ roomId, state }) => {
    rooms[roomId].gameState = state;

    socket.to(roomId).emit("game-update", state);
  });

  socket.on("needle-move", ({ roomId, angle }) => {
    if (rooms[roomId] && rooms[roomId].gameState) {
      rooms[roomId].gameState.currentNeedleAngle = angle;
    }
    socket.to(roomId).emit("needle-move", angle);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on 3000");
});
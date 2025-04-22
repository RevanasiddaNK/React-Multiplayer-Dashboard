import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

let playerScores = [];

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on("scores", (scores) => {
    console.log(`Received scores from ${socket.id}:`, scores);

    const index = playerScores.findIndex(p => p.id === socket.id);
    if (index !== -1) {
      playerScores[index] = { ...scores, id: socket.id };
    } else {
      playerScores.push({ ...scores, id: socket.id });
    }

    console.log("Updated playerScores:", playerScores);
    io.emit("playerScores", playerScores);
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`);
    playerScores = playerScores.filter(p => p.id !== socket.id);
    io.emit("playerScores", playerScores);
  });
  
});

setInterval(() => {
  console.log("Periodic emit:", playerScores);
  io.emit("playerScores", playerScores);
}, 5000);

httpServer.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

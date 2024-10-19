import { Server } from "socket.io";
import { NextResponse } from "next/server";

let io;

export async function GET(request: Request) {
  if (!io) {
    io = new Server();
    
    // This will set up the Socket.IO connection
    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("player-joined", (gameData) => {
        io.emit("update-game", gameData);
      });

      socket.on("question-answered", (data) => {
        io.emit("update-progress", data);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });

    io.listen(3001); // You can run the socket server on a different port (e.g., 3001)
  }

  return NextResponse.json({ message: "Socket.IO server initialized" });
}

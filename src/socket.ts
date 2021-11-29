import socketio, { Socket, Server } from "socket.io";
import { Server as httpserver } from "http";
import { addUser, getUser, removeUser, getUsersInRoom } from "./users";

export const configureWebSockets = (httpServer: httpserver) => {
  const io = new Server(httpServer);
  io.on("connect", (socket: Socket) => {
    socket.on("join", ({ username, room }, callback) => {
      console.log(`${username} joined ${room}`);
      const { error, user } = addUser({
        id: socket.id,
        room,
        username,
      });

      if (error) return callback(error);
      let users = getUsersInRoom(user?.room!);

      socket.join(user?.room!);
      socket.emit("alert", {
        message: `${user?.username}, welcome to room ${user?.room} 🎉🎉`,
        participants: users,
      });

      socket.on("sendMessage", ({ message, type }, callback) => {
        const user = getUser(socket.id);
        console.log(user);
        io.to(user?.room!).emit("message", {
          user: user?.username,
          type,
          text: message,
          time: Date.now(),
        });
        callback();
      });
      socket.broadcast.to(user?.room!).emit("alert", {
        message: `🎉 ${user?.username} has joined!`,
        participants: users,
      });
    });

    // Disconnection
    socket.on("disc", () => {
      const user = removeUser(socket.id);

      if (user) {
        io.to(user.room).emit("alert", {
          message: `👋 ${user.username} has left.`,
          participants: getUsersInRoom(user.room),
        });
        socket.leave(user.id);
      }
    });
  });
};

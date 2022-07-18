const { updateChat } = require("../routes/controllers/chat.controller");

class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;

    socket.on("join_room", (data) => {
      socket.join(data);
    });

    socket.on("send_message", async (data) => {
      await updateChat(data);
      socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  }
}

const editor = (io) => {
  io.on("connection", (socket) => {
    new Connection(io, socket);
  });
};

module.exports = editor;

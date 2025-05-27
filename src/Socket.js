import { io } from "socket.io-client";

const socket = io("https://chat-app-backend-8lel.onrender.com", {
  auth: { token: localStorage.getItem("x-access-token") }, // optional JWT
});

export default socket;

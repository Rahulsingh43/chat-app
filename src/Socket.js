import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:3307", {
  auth: { token: localStorage.getItem("x-access-token") }, // optional JWT
});

export default socket;

import { io } from "socket.io-client";

// Conectamos al servidor de Node que acabamos de hacer
const socket = io("http://localhost:3001");

export default socket;
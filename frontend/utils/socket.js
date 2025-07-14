import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false, // ❌ do NOT connect immediately on import
  withCredentials: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;

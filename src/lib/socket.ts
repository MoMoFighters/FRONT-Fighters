import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (accessToken: string): Socket => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080", {
            auth: {
                token: accessToken,
            },
            autoConnect: false,
        });
    }
    return socket;
};
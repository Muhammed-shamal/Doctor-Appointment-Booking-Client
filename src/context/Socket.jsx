"use client";

import { createContext, useContext, useEffect } from "react";
import { socket } from "../api/axiosInstance";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

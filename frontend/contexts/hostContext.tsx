"use client";

import useAuth from "@/hooks/useAuth";
import { HostSocketMessage } from "@/types";
import { error } from "console";
import { createContext, useState, useEffect, useContext } from "react";

export interface HostContextType {
    latestData: HostSocketMessage | null;
    socket: WebSocket | null;
}

export const HostContext = createContext<HostContextType | null>(null);

export function HostProvider({ children }: { children: React.ReactNode }) {
    const { hostId, hostUsername } = useAuth();

    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [latestData, setLatestData] = useState<HostSocketMessage | null>(
        null
    );

    useEffect(() => {
        if (!hostId || !hostUsername) return;

        const ws = new WebSocket("ws://localhost:8080");
        setSocket(ws);
        ws.onopen = () => {
            console.log("Connection opened from host client");
            ws.send(
                JSON.stringify({
                    action: "JOIN_HOST",
                    data: {
                        hostId: hostId,
                        username: hostUsername,
                    },
                })
            );
        };

        ws.onmessage = (message) => {
            console.log(
                "message received from web socket server, ",
                message.data
            );
            setLatestData(message.data);
        };

        return () => {
            ws.onopen = null;
            ws.onmessage = null;
            ws.close();
            console.log("Socket connection closed to server from host client");
        };
    }, [hostId, hostUsername]);

    const value = { socket, latestData };

    return (
        <HostContext.Provider value={value}>{children}</HostContext.Provider>
    );
}

export function useHostSocket() {
    const ctx = useContext(HostContext);
    if (!ctx)
        throw new Error(
            "The component should be wrapped within the HostProvider"
        );

    return ctx;
}

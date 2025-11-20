"use client";

import { useState, useEffect } from "react";
import { HostSocketMessage } from "@/types";

export default function useHostSocket() {
    const [socket, setSocket] = useState<null | WebSocket>(null);
    const [latestData, setLatestData] = useState<null | HostSocketMessage>(
        null
    );

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = () => {
            console.log("Socket connection opened for host!");
            setSocket(ws);
        };

        ws.onmessage = (message) => {
            console.log(
                "Message data received from web socket for host: ",
                message.data
            );
            setLatestData(message.data);
        };

        return () => {
            ws.onopen = null;
            ws.onmessage = null;
            ws.close();
            console.log("Closed web socket connection from host!");
        };
    }, []);

    return { socket, latestData };
}

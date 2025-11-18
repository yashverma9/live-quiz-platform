"use client";

import { useState, useEffect } from "react";
import { ParticipantSocketMessage } from "@/types";

export default function useParticipantSocket() {
    const [socket, setSocket] = useState<null | WebSocket>(null);
    const [latestData, setLatestData] =
        useState<null | ParticipantSocketMessage>(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = () => {
            console.log("Socket connection opened for participant!");
            setSocket(ws);
        };

        ws.onmessage = (message) => {
            console.log(
                "Message data received from web socket for participant: ",
                message.data
            );
            setLatestData(message.data);
        };

        return () => {
            ws.onopen = null;
            ws.onmessage = null;
            ws.close();
            console.log("Closed web socket connection from participant!");
        };
    }, []);

    return { latestData };
}

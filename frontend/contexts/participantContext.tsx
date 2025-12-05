"use client";

import useAuth from "@/hooks/useAuth";
import { ParticipantMessageTypes, ParticipantSocketMessage } from "@/types";
import { useContext, createContext, useEffect, useState } from "react";

export interface ParticipantContextType {
    latestData: ParticipantSocketMessage | null;
    socket: WebSocket | null;
}

export const ParticipantContext = createContext<ParticipantContextType | null>(
    null
);

export function ParticipantProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { participantId } = useAuth();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [latestData, setLatestData] =
        useState<ParticipantSocketMessage | null>(null);

    useEffect(() => {
        if (!participantId) return;

        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = () => {
            console.log(
                "Socket connection opened to server by participant client!"
            );
            ws.send(
                JSON.stringify({
                    action: ParticipantMessageTypes.JOIN_QUIZ,
                    data: {
                        participantId: participantId,
                    },
                })
            );

            ws.onmessage = (message) => {
                console.log(
                    "Data received from the socket server for participant: ",
                    message.data
                );
                setLatestData(message.data);
            };

            return () => {
                ws.onopen = null;
                ws.onmessage = null;
                ws.close();
                console.log(
                    "Socket connection closed from participant client to server"
                );
            };
        };
    }, [participantId]);

    const value = { socket, latestData };
    return (
        <ParticipantContext.Provider value={value}>
            {children}
        </ParticipantContext.Provider>
    );
}

export function useParticipantSocket() {
    const ctx = useContext(ParticipantContext);
    if (!ctx)
        throw new Error(
            "The context should be used in a component wrapped inside ParticipantProvider"
        );
    return ctx;
}

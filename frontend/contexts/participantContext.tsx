"use client";

import useAuth from "@/hooks/useAuth";
import {
    ParticipantMessageTypes,
    ParticipantMessageOutgoingTypes,
    ParticipantSocketMessageIncoming,
} from "@/types";
import { useContext, createContext, useEffect, useState } from "react";

export interface ParticipantContextType {
    latestData: ParticipantSocketMessageIncoming | null;
    socket: WebSocket | null;
    openConnection: (quizId: number) => void;
    closeConnection: () => void;
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
        useState<ParticipantSocketMessageIncoming | null>(null);

    const openConnection = (quizId: number) => {
        if (!participantId) return;

        const ws = new WebSocket("ws://localhost:8080");
        setSocket(ws);
        ws.onopen = () => {
            console.log(
                "Socket connection opened to server by participant client!"
            );
            ws.send(
                JSON.stringify({
                    action: ParticipantMessageOutgoingTypes.JOIN_QUIZ,
                    data: {
                        participantId: participantId,
                        quizId: quizId,
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
    };

    const closeConnection = () => {
        if (!socket) return;
        socket.onopen = null;
        socket.onmessage = null;
        socket.close();
        console.log(
            "Socket connection closed from participant client to server"
        );
    };

    // useEffect(() => {
    //     if (!participantId) return;

    //     const ws = new WebSocket("ws://localhost:8080");

    //     ws.onopen = () => {
    //         console.log(
    //             "Socket connection opened to server by participant client!"
    //         );
    //         ws.send(
    //             JSON.stringify({
    //                 action: ParticipantMessageOutgoingTypes.JOIN_QUIZ,
    //                 data: {
    //                     participantId: participantId,
    //                 },
    //             })
    //         );

    //         ws.onmessage = (message) => {
    //             console.log(
    //                 "Data received from the socket server for participant: ",
    //                 message.data
    //             );
    //             setLatestData(message.data);
    //         };

    //         return () => {
    //             ws.onopen = null;
    //             ws.onmessage = null;
    //             ws.close();
    //             console.log(
    //                 "Socket connection closed from participant client to server"
    //             );
    //         };
    //     };
    // }, [participantId]);

    const value = { socket, latestData, openConnection, closeConnection };
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

import WebSocket from "ws";
import type { IncomingMessage } from "../models/incomingMessages.js";

export const parseMessage = (message: WebSocket.RawData): IncomingMessage => {
    console.log("type of message", typeof message);
    if (typeof message === "string") {
        return JSON.parse(message);
    }
    const buf = Buffer.from(message as any);
    const text = buf.toString("utf8");
    const payload = JSON.parse(text);
    return payload;
};

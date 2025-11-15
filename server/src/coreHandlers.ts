import WebSocket from "ws";
import { SupportedMessage } from "./models/incomingMessages.js";

const parseMessage = (message: WebSocket.RawData) => {
    console.log("type of message", typeof message);
    if (typeof message === "string") {
        return JSON.parse(message);
    }
    const buf = Buffer.from(message as any);
    const text = buf.toString("utf8");
    return JSON.parse(text);
};

export default function messageHandler(
    message: WebSocket.RawData,
    isBinary: boolean
) {
    const data = parseMessage(message);
    if ((data.action = SupportedMessage.CreateQuiz))
        console.log("message received", data);
}

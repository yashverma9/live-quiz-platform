import WebSocket from "ws";

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
    console.log("message received", data);
}

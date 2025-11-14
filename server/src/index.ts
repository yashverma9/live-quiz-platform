import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import messageHandler from "./coreHandlers.js";

const server = http.createServer(function (request: any, response: any) {
    console.log(new Date() + "Request received from " + request.url);
    response.end("Hi from server");
});

const wss = new WebSocketServer({ server });

wss.on("connection", function (connection) {
    connection.on("error", function (err) {
        console.error(err);
    });

    connection.on("message", function (message, isBinary) {
        messageHandler(message, isBinary);
    });
});

server.listen(8080, () => {
    console.log("server running on port 8080!");
});

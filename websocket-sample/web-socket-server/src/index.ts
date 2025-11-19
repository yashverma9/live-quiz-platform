import WebSocket, { WebSocketServer } from "ws";
import http from "http";

// A basic http server from scratch like express server
const server = http.createServer(function (request: any, response: any) {
    console.log(new Date() + " Received request for " + request.url);
    response.end("hi there");
});

const wss = new WebSocketServer({ server });
let userCount = 0;

// Works on the logic of callbacks
// So whenevr there is a connection, control reaches the connection function and you get a ws instance- the connection socket for that specific client which connected just now
wss.on("connection", function connection(ws) {
    // Whenevr there is a error, just log it
    ws.on("error", (err) => console.error(err));

    // Whenevr there is a message, then message callback
    ws.on("message", function message(data, isBinary) {
        // for every client, check if connection is open to them and then send them data except the client which sent the message
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
    // This hello is send everytime connection is made with ws
    console.log("Users connected to the socket: ", ++userCount);
    ws.send("Hello! Message from the Server!");
});

server.listen(8080, function () {
    console.log(new Date() + " Server is listening on port 8080");
});

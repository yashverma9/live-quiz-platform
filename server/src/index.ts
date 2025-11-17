import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import express from "express";
import messageHandler from "./coreHandlers.js";
import { quizRouter } from "./router/quiz.js";
import { userRouter } from "./router/user.js";
import cors from "cors";

// Using express as server
const app = express();
app.use(cors());
app.use(express.json());

const server = app.listen(8080, () => {
    console.log("server running on port 8080!");
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

const appRouter = express.Router();
app.use(appRouter);

appRouter.use("/quiz", quizRouter);
appRouter.use("/user", userRouter);

// const server = http.createServer(function (request: any, response: any) {
//     console.log(new Date() + "Request received from " + request.url);
//     response.end("Hi from server");
// });

// server.listen(8080, () => {
//     console.log("server running on port 8080!");
// });

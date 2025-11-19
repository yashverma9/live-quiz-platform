import { v4 as uuid4 } from "uuid";
import type { Questions } from "./models/zodSchemas.js";
import WebSocket from "ws";

export class Participant {
    userId: number;
    username: string;
    socket: WebSocket;
    score: number;

    constructor(userId: number, username: string, socket: WebSocket) {
        this.userId = userId;
        this.username = username;
        this.socket = socket;
        this.score = 0;
    }

    addScore(points: number) {
        this.score += points;
    }

    getParticipantDetails() {
        return {
            userId: this.userId,
            name: this.username,
            score: this.score,
        };
    }
}

export class QuizManager {
    quizId: number;
    participants: Map<number, Participant> = new Map();
    hostId: string;
    title: string;
    questions: Questions;
    currentQuestion: number = 0;

    // constructor() {
    //     this.quizId = "";
    //     this.hostId = "";
    //     this.title = "";
    //     this.questions = [];
    // }

    constructor(
        quizId: number,
        hostId: string,
        title: string,
        questions: Questions
    ) {
        this.quizId = quizId;
        this.hostId = hostId;
        this.title = title;
        this.questions = questions;
    }

    addParticipant(participantDetails: Participant) {
        this.participants.set(participantDetails.userId, participantDetails);
    }

    getNextQuestion() {
        this.currentQuestion += 1;
        return this.questions[this.currentQuestion - 1];
    }

    broadcastMessage(message: WebSocket.RawData) {
        console.log("Message being broadcasted: ", message);
        this.participants.forEach((participant) => {
            participant.socket.send(message); // check what format/type for payload is expected here
            console.log(`Message sent to ${participant.username}`);
        });
    }
}

import { v4 as uuid4 } from "uuid";
import type {
    ParticipantQuestionResponse,
    Questions,
    QuizQuestionResponse,
    QuizResponse,
} from "./models/zodSchemas.js";
import WebSocket from "ws";
import type {
    NewQuestionData,
    OutgoingMessage,
} from "./models/outgoingMessages.js";

export class Participant {
    userId: number;
    username: string;
    socket: WebSocket;
    score: number;
    quizResponses: Map<number, Map<number, ParticipantQuestionResponse>> =
        new Map(); // {quizId: {questionId: ParticipantQuestionResponse}, ...}

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
    participants: Map<number, Participant> = new Map(); // {userId: Participant, ....}
    hostId: number;
    title: string;
    questions: Questions;
    currentQuestion: number = 0;
    responses: Map<number, QuizResponse> = new Map(); // {questionId: {QuizResponse}, ...}

    // constructor() {
    //     this.quizId = "";
    //     this.hostId = "";
    //     this.title = "";
    //     this.questions = [];
    // }

    constructor(
        quizId: number,
        hostId: number,
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

    getNextQuestion(): NewQuestionData {
        this.currentQuestion += 1;
        return (
            this.questions[this.currentQuestion - 1] || {
                questionId: -1,
                question: "",
                options: ["", "", "", ""],
                answer: "",
            }
        );
    }

    broadcastMessage(message: OutgoingMessage) {
        console.log("Message being broadcasted: ", message);
        this.participants.forEach((participant) => {
            participant.socket.send(JSON.stringify(message));
            console.log(`Message sent to ${participant.username}`);
        });
    }

    checkAnswerCorrect(questionId: number, answer: string) {
        if (this.questions[questionId]?.answer === answer) return true;

        return false;
    }
}

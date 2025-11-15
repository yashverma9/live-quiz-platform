import { v4 as uuid4 } from "uuid";
import type { Questions } from "./models/zodSchemas.js";

export class Participant {
    userId: string;
    name: string;
    score: number;

    constructor(name: string) {
        this.userId = uuid4();
        this.name = name;
        this.score = 0;
    }

    addScore(points: number) {
        this.score += points;
    }

    getParticipantDetails() {
        return {
            userId: this.userId,
            name: this.name,
            score: this.score,
        };
    }
}

export class QuizManager {
    quizId: string;
    participants: Map<string, Participant> = new Map();
    hostId: string;
    title: string;
    questions: Questions;
    currentQuestion: number = 0;

    constructor(
        quizId: string,
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

    nextQuestion() {
        this.currentQuestion += 1;
        return this.questions[this.currentQuestion - 1];
    }
}

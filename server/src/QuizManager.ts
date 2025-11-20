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

    storeResponse(
        quizId: number,
        questionId: number,
        answer: string,
        correctAnswer: string,
        time: number,
        isCorrect: boolean | undefined
    ) {
        this.quizResponses.set(quizId, new Map());
        this.quizResponses.get(quizId)?.set(questionId, {
            answer,
            correctAnswer,
            time,
            isCorrect,
        });
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
    // questionAnsweredFlag: Map<number, boolean> = new Map(); // {userId: false}

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

        questions.map((question) => {
            let correctOption = "";
            const optionsList = ["a", "b", "c", "d"];
            question.options.map((option, index) => {
                if (option === question.answer)
                    correctOption = optionsList[index] || "";
            });
            this.responses.set(question.questionId, {
                correctAnswer: question.answer,
                correctOption: correctOption,
                response: [],
            });
        });
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

    storeResponse(
        questionId: number,
        userId: number,
        answer: string,
        time: number,
        isCorrect: boolean | undefined
    ) {
        this.responses.get(questionId)?.response.push({
            userId,
            answer,
            time,
            isCorrect,
        });
    }

    broadcastMessage(message: OutgoingMessage) {
        console.log("Message being broadcasted: ", message);
        this.participants.forEach((participant) => {
            participant.socket.send(JSON.stringify(message));
            console.log(`Message sent to ${participant.username}`);
        });
    }

    checkAnswerCorrect(questionId: number, answer: string) {
        const correctAnswer = this.questions[questionId]?.answer;
        if (correctAnswer === answer) return { correctAnswer, isCorrect: true };

        return { correctAnswer, isCorrect: false };
    }
}

import type { Questions } from "./zodSchemas.js";

export enum SupportedMessage {
    CreateQuiz = "CREATE_QUIZ",
    StartQuiz = "START_QUIZ",
    JoinQuiz = "JOIN_QUIZ",
    AnswerQuiz = "ANSWER_QUIZ",
}

export interface CreateQuizData {
    quizId: number;
    hostId: number;
    title: string;
    questions: Questions;
}

export interface JoinQuizData {
    quizId: number;
    userId: number;
    username: string;
}

export interface StartQuizData {
    quizId: number;
    userId: number;
}

export interface AnswerQuizData {
    quizId: number;
    userId: number;
    questionId: string;
    answer: string;
}

export interface IncomingMessage {
    action: SupportedMessage;
    data: CreateQuizData | StartQuizData | JoinQuizData | AnswerQuizData;
}

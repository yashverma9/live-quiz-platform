import { z } from "zod";

export interface Question {
    questionId: number;
    question: string;
    options: string[];
    answer: string;
}

export type Questions = Question[];

export interface ParsedQuiz {
    id: number;
    title: string;
    hostId: number;
    createdAt: Date;
    questions: Questions;
}

export const CreateQuiz = z.object({
    hostId: z.number(),
    title: z.string(),
    questions: z.array(z.object()),
});

export interface QuizQuestionResponse {
    userId: number;
    answer: string;
    time: number;
    isCorrect: boolean | undefined;
}

export interface ParticipantQuestionResponse {
    answer: string;
    correctAnswer: string;
    time: number;
    isCorrect: boolean | undefined;
}

export interface QuizResponse {
    correctAnswer: string;
    correctOption: string;
    response: QuizQuestionResponse[];
}

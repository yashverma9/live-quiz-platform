import { z } from "zod";

export interface Question {
    questionId: number;
    question: string;
    options: string[];
    answer: string;
}

export type Questions = Question[];

export const CreateQuiz = z.object({
    hostId: z.number(),
    title: z.string(),
    questions: z.array(z.object()),
});

export interface QuizQuestionResponse {
    userId: number;
    answerOption: string;
    answer: string;
    time: number;
}

export interface ParticipantQuestionResponse {
    answerOption: string;
    answer: string;
    correctAnswer: string;
    time: number;
}

export interface QuizResponse {
    correctAnswer: string;
    correctOption: string;
    response: QuizQuestionResponse[];
}

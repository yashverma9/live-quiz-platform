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

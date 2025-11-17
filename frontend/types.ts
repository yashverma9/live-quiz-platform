export interface Question {
    question: string;
    options: string[];
    answer: string;
}

export type Questions = Question[];

export interface Quiz {
    id: number;
    hostId: number;
    title: string;
    questions: Questions;
    createdAt: string;
}

export type Quizes = Quiz[];

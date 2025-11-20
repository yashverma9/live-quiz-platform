// Host dashboard related types

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

// Web socket related types - PARTICIPANTS

export enum ParticipantMessageTypes {
    WAIT_FOR_QUIZ_START = "WAIT_FOR_QUIZ_START",
    NEW_QUESTION = "NEW_QUESTION",
    WAIT_FOR_NEXT_QUESTION = "WAIT_FOR_NEXT_QUESTION",
    QUIZ_END = "QUIZ_END",
}

export interface ParticipantQuestion {
    id: number;
    question: string;
    options: string[];
    currentScore: number;
}

export interface Scores {
    participantId: number;
    username: string;
    score: number;
}

export interface ParticipantSocketMessage {
    type: ParticipantMessageTypes;
    data: ParticipantQuestion | Scores[] | {};
}

// Web socket related types - HOST

export enum HostMessageTypes {
    CREATE_QUIZ = "CREATE_QUIZ",
    START_QUIZ = "START_QUIZ",
    WAIT_FOR_QUIZ_START = "WAIT_FOR_QUIZ_START",
    NEW_QUESTION = "NEW_QUESTION",
    WAIT_FOR_NEXT_QUESTION = "WAIT_FOR_NEXT_QUESTION",
    QUIZ_END = "QUIZ_END",
}

export interface HostData {
    id: number;
    question: string;
    options: string[];
    answer: string;
    currentScores: Scores[];
}

export interface HostSocketMessage {
    type: HostMessageTypes;
    data: HostData | Scores[] | {};
}

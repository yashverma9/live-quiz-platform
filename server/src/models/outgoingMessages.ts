export enum SupportedMessageOutgoing {
    StartQuiz = "START_QUIZ",
    NewQuestion = "NEW_QUESTION",
    ScoreBreak = "SCORE_BREAK",
    EndQuiz = "END_QUIZ",
}

export interface StartQuizData {
    userId: number;
    score: 0;
}

export interface NewQuestionData {
    questionId: number;
    question: string;
    options: string[];
    answer: string;
}

export interface IndividualScore {
    userId: number;
    score: number;
}

export interface ScoreBreakData {
    scores: IndividualScore[];
    questionCountDone: number;
}

export interface EndQuizData {
    scores: IndividualScore[];
}

export interface OutgoingMessage {
    action: SupportedMessageOutgoing;
    data: StartQuizData | NewQuestionData | ScoreBreakData | EndQuizData;
}

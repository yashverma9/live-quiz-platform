export enum SupportedMessage {
    CreateQuiz = "CREATE_QUIZ",
    StartQuiz = "START_QUIZ",
    JoinQuiz = "JOIN_QUIZ",
    AnswerQuiz = "ANSWER_QUIZ",
}

export interface CreateQuizMessage {
    adminId: string;
    quizId: string;
}

export interface JoinQuiz {
    quizId: string;
    userId: string;
}

export interface AnswerQuiz {
    quizId: string;
    userId: string;
    questionId: string;
    answer: string;
}

import WebSocket from "ws";
import {
    SupportedMessage,
    type AnswerQuizData,
    type CreateQuizData,
    type IncomingMessage,
    type JoinQuizData,
    type StartQuizData,
} from "./models/incomingMessages.js";
import { Participant, QuizManager } from "./QuizManager.js";
import {
    SupportedMessageOutgoing,
    type StartQuizOutgoingData,
} from "./models/outgoingMessages.js";

const quizzes = new Map<number, QuizManager>();

const parseMessage = (message: WebSocket.RawData): IncomingMessage => {
    console.log("type of message", typeof message);
    if (typeof message === "string") {
        return JSON.parse(message);
    }
    const buf = Buffer.from(message as any);
    const text = buf.toString("utf8");
    return JSON.parse(text);
};

export default function messageHandler(
    connection: WebSocket,
    message: WebSocket.RawData,
    isBinary: boolean
) {
    const payload = parseMessage(message);
    console.log("message received", payload);

    if (payload.action === SupportedMessage.CreateQuiz) {
        /*
        payload = {
            action: "CREATE_QUIZ",
            data : {
                quizId: 1,
                hostId: 1,
                title: "Animals",
                questions: [{
                    questionId: 1,
                    question: "What is a cat?",
                    options: ["Animal", "Fish", "Bird", "Mammal"],
                    answer: "Animal"
                }]
            }
        }
    */
        const { quizId, hostId, title, questions } =
            payload.data as CreateQuizData;
        const quiz = new QuizManager(quizId, hostId, title, questions);
        quizzes.set(quiz.quizId, quiz);
    } else if (payload.action === SupportedMessage.JoinQuiz) {
        const { quizId, userId, username } = payload.data as JoinQuizData;
        /*
        payload = {
            action: "JOIN_QUIZ",
            data : {
                quizId: 1,
                userId: 10,
                username: "vermayash"
            }
        }
    */

        const participant = new Participant(userId, username, connection);
        quizzes.get(quizId)?.addParticipant(participant);
    } else if (payload.action === SupportedMessage.StartQuiz) {
        /*
        payload = {
            action: "START_QUIZ",
            data : {
                userId: 10,
                quizId: 1,
            }
        }
    */
        const { userId, quizId } = payload.data as StartQuizData;
        const quiz = quizzes.get(quizId);
        const currentQuestion = quiz?.getNextQuestion();
        const outgoingPayload = {
            action: SupportedMessageOutgoing.StartQuiz,
            data: {
                userId: userId,
                score: 0,
                firstQuestionData: currentQuestion,
            } as StartQuizOutgoingData,
        };
        quiz?.broadcastMessage(outgoingPayload);
    } else if (payload.action === SupportedMessage.AnswerQuiz) {
        /*
        payload = {
            action: "ANSWER_QUIZ",
            data: {
            }
        }
        */
        const { quizId, userId, questionId, answer } =
            payload.data as AnswerQuizData;

        const isCorrect = quizzes
            .get(quizId)
            ?.checkAnswerCorrect(questionId, answer);
    }
}

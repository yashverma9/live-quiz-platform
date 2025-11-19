import WebSocket from "ws";
import { SupportedMessage } from "./models/incomingMessages.js";
import { Participant, QuizManager } from "./QuizManager.js";
import { SupportedMessageOutgoing } from "./models/outgoingMessages.js";

const quizzes = new Map<number, QuizManager>();

const parseMessage = (message: WebSocket.RawData) => {
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
    const data = parseMessage(message);
    console.log("message received", data);

    if (data.action === SupportedMessage.CreateQuiz) {
        /*
        data = {
            action: "CREATE_QUIZ",
            payload : {
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
        const { quizId, hostId, title, questions } = data.payload;
        const quiz = new QuizManager(quizId, hostId, title, questions);
        quizzes.set(quiz.quizId, quiz);
    } else if (data.action === SupportedMessage.JoinQuiz) {
        const { quizId, userId, username } = data.payload;
        /*
        data = {
            action: "JOIN_QUIZ",
            payload : {
                quizId: 1,
                userId: 10,
                username: "vermayash"
            }
        }
    */

        const participant = new Participant(userId, username, connection);
        quizzes.get(quizId)?.addParticipant(participant);
    } else if (data.action === SupportedMessage.StartQuiz) {
        /*
        data = {
            action: "START_QUIZ",
            payload : {
                quizId: 1,
            }
        }
    */
        const { quizId } = data.payload;
        const quiz = quizzes.get(quizId);
        const currentQuestion = quiz?.getNextQuestion();
        const payload = {
            action: SupportedMessageOutgoing.NewQuestion,
            payload: {
                currentQuestion: currentQuestion,
            },
        };
        quiz?.broadcastMessage(payload);
    }
}

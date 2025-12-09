import WebSocket from "ws";
import {
    SupportedMessage,
    type AnswerQuizData,
    type CreateQuizData,
    type IncomingMessage,
    type JoinHostData,
    type JoinQuizData,
    type StartQuizData,
} from "./models/incomingMessages.js";
import { Host, Participant, QuizManager } from "./QuizManager.js";
import {
    SupportedMessageOutgoing,
    type ParticipantJoinedData,
    type StartQuizOutgoingData,
    type WaitForQuizStartData,
} from "./models/outgoingMessages.js";

import { parseMessage } from "./utils/generic.js";

const quizzes = new Map<number, QuizManager>();
const hosts = new Map<number, Host>();

export default function messageHandler(
    connection: WebSocket,
    message: WebSocket.RawData,
    isBinary: boolean
) {
    const payload = parseMessage(message);
    console.log("message received", payload, typeof payload);

    if (payload.action === SupportedMessage.JoinHost) {
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
        const { hostId, username } = payload.data as JoinHostData;

        const host = new Host(hostId, username, connection);
        console.log("Host joined the connection: ", host);
        hosts.set(hostId, host);
    } else if (payload.action === SupportedMessage.CreateQuiz) {
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
        const currentQuiz = quizzes.get(quizId);
        const hostId = currentQuiz?.hostId;
        if (hostId === undefined) return;
        const currentHost = hosts.get(hostId);
        const participants = [] as Participant[];
        currentQuiz?.addParticipant(participant);
        currentQuiz?.participants.forEach((participant, participantId) => {
            participants.push(participant);
        });

        const outgoingPayloadHost = {
            action: SupportedMessageOutgoing.ParticipantJoined,
            data: {
                totalParticipants: participants.length,
                participants: participants,
            } as ParticipantJoinedData,
        };

        const outgoingPayloadParticipant = {
            action: SupportedMessageOutgoing.WaitForQuizStart,
            data: {
                participants: participants,
                title: currentQuiz?.title,
            } as WaitForQuizStartData,
        };

        currentQuiz?.sendMessage(
            outgoingPayloadHost,
            currentHost?.socket,
            hostId
        );

        currentQuiz?.broadcastMessage(outgoingPayloadParticipant);
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
        const { quizId, userId, questionId, answer, time } =
            payload.data as AnswerQuizData;

        const quiz = quizzes.get(quizId);
        const participant = quiz?.participants.get(userId);

        const { correctAnswer = "", isCorrect = undefined } =
            quiz?.checkAnswerCorrect(questionId, answer) || {
                correctAnswer: "",
            };

        quiz?.storeResponse(questionId, userId, answer, time, isCorrect);
        participant?.storeResponse(
            quizId,
            questionId,
            answer,
            correctAnswer,
            time,
            isCorrect
        );
    }
}

import { success } from "zod";
import { PrismaClient } from "../generated/prisma/client.js";
import type { ParsedQuiz } from "./zodSchemas.js";

const prisma = new PrismaClient();

export async function createSampleUser(
    username: string,
    email: string,
    password: string
) {
    try {
        const exists = await prisma.user.findFirst({
            where: {
                OR: [{ username: username }, { email: email }],
            },
        });
        console.log("exists", exists);

        if (exists)
            return {
                message: "User already exists with same username or email",
                success: false,
            };

        const resp = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: password,
            },
        });
        console.log("Created user succesfully", resp);
        await prisma.$disconnect();
        return { message: "User created successfully!", success: true };
    } catch (e) {
        console.error("failed to create user in db", e);
        await prisma.$disconnect();
        return {
            message: `Error creating user ${e}`,
            success: false,
        };
    }
}

export async function createQuiz(
    title: string,
    hostId: number,
    questions: {
        questionId: number;
        question: string;
        answer: string;
        option: string[];
    }[]
) {
    try {
        const resp = await prisma.quiz.create({
            data: {
                title: title,
                hostId: hostId,
                questions: JSON.stringify(questions),
            },
        });
        return { message: "Quiz created succcessfully", success: true };
    } catch (e) {
        console.error("failed to create quiz in db", e);
        await prisma.$disconnect();
        return {
            message: `Error creating quiz`,
            success: false,
        };
    }
}

export async function getAllQuiz(hostId: number) {
    try {
        const quizes = await prisma.quiz.findMany({
            where: {
                hostId: hostId,
            },
        });
        console.log(`all quizes for host ${hostId}`, quizes);

        const parsedQuiz: ParsedQuiz[] = quizes.map((quiz) => ({
            ...quiz,
            questions: JSON.parse(quiz.questions),
        }));

        return { success: true, quizes: parsedQuiz };
    } catch (e) {
        console.error("failed to fetch quizes from the db", e);
        await prisma.$disconnect();
        return {
            message: `Error fetching quiz ${e}`,
            success: false,
        };
    }
}

export async function joinQuiz(userId: number, quizId: number) {
    try {
        const quiz = await prisma.quiz.findFirst({
            where: {
                id: quizId,
            },
        });

        if (!quiz) {
            return { message: "Quiz doesn't exist", success: false };
        }

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return { message: "User doesn't exist", success: false };
        }

        const participant = await prisma.participantsInQuiz.upsert({
            where: {
                participantId_quizId: {
                    quizId: quizId,
                    participantId: userId,
                },
            },
            update: {},
            create: {
                participantId: userId,
                quizId: quizId,
            },
        });
        console.log(
            `participant ${userId} added to the quiz ${quizId}`,
            participant
        );
        return { success: true, message: "User added to the quiz" };
    } catch (e) {
        console.error("failed to add user to quiz", e);
        await prisma.$disconnect();
        return {
            message: `Error adding user to the quiz ${e}`,
            success: false,
        };
    }
}

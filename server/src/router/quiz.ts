import express from "express";
import { z } from "zod";
import { CreateQuiz } from "../models/zodSchemas.js";
import { createQuiz, getAllQuiz } from "../models/database.js";

export const quizRouter = express.Router();

const validatePayload = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const payload = req.body;
    console.log("payload:", payload);
    const result = CreateQuiz.safeParse(payload);
    console.log("parse result: ", result);
    if (result.success) next();
    else res.status(411).json({ message: "incorrect input payload" });
};

quizRouter.get("/", (req, res) => {
    res.status(200).send({
        message: "this is working",
    });
});

quizRouter.post("/create", validatePayload, async (req, res) => {
    const payload = req.body;
    const { hostId, title, questions } = payload;
    await createQuiz(title, hostId, questions);
    res.status(200).send({
        message: "Received payload",
    });
});

quizRouter.get("/all", async (req, res) => {
    const hostId = Number(req.query.hostId);
    const quizes = await getAllQuiz(hostId);
    res.status(200).json({
        message: "Success",
        quizes: quizes,
    });
});

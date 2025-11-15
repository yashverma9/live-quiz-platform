import express from "express";
import { z } from "zod";
import { CreateQuiz } from "../models/zodSchemas.js";

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

quizRouter.post("/create", validatePayload, (req, res) => {
    const payload = res.status(200).send({
        message: "Received payload",
    });
});

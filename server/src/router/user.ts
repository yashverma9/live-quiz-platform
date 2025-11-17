import express from "express";
import { createSampleUser, joinQuiz } from "../models/database.js";

export const userRouter = express.Router();

userRouter.get("/", (req, res) => {
    res.status(200).json({
        message: "This get is working!",
    });
});

userRouter.post("/register", async (req, res) => {
    const payload = req.body;
    const { username, email, password } = payload;
    await createSampleUser(username, email, password);
    res.status(200).json({
        message: "created user successfully",
    });
});

userRouter.post("/joinQuiz", async (req, res) => {
    const payload = req.body;
    const userId = Number(payload.userId);
    const quizId = Number(payload.quizId);

    const resp = await joinQuiz(userId, quizId);

    res.status(200).json(resp);
});

"use client";

import { useParticipantSocket } from "@/contexts/participantContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function participantHome() {
    const router = useRouter();
    const [quizId, setQuizId] = useState<number | undefined>();
    const { socket, latestData, openConnection, closeConnection } =
        useParticipantSocket();
    const joinQuizHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log("joining quiz ... ", quizId);
        if (!quizId) {
            console.log("Quiz id is not defined");
            alert("Quiz id not defined");
            return;
        }
        openConnection(quizId);
        router.push(`/quiz?quizId${quizId}`);
    };

    return (
        <div>
            <div>
                <div>Join Quiz</div>
                <label>Enter quiz ID</label>
                <input
                    value={quizId}
                    onChange={(e) => setQuizId(Number(e.target.value))}
                ></input>
                <button onClick={joinQuizHandler}>Join</button>
            </div>
        </div>
    );
}

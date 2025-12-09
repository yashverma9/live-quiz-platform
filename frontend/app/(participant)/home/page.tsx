"use client";

import { useState } from "react";

export default function participantHome() {
    const [quizId, setQuizId] = useState<number | undefined>();

    const joinQuizHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log("joining quiz ... ", quizId);
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

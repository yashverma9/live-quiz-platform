"use client";

import useHostSocket from "@/hooks/useHostSocket";
import { useEffect, useState } from "react";

export default function quizHost({
    params,
    searchParams,
}: {
    params: Promise<{ quizId: string }>;
    searchParams: Promise<{ title: string; hostId: string }>;
}) {
    const [quizId, setQuizId] = useState<number>();
    const [quizTitle, setQuizTitle] = useState<string>();
    const [hostId, setHostId] = useState<number>(-1);

    const { latestData } = useHostSocket(hostId);
    console.log("latest data: ", latestData);
    console.log("quizId: ", quizId);

    // Params/searchParams parsed in useEffect as client component don't support async directly
    useEffect(() => {
        async function loadParams() {
            const { quizId } = await params;
            const { title, hostId } = await searchParams;
            console.log("Quizid: ", quizId, typeof quizId);
            setQuizId(Number(quizId));
            setQuizTitle(title);
            setHostId(Number(hostId));
        }

        loadParams();
    }, []);

    return (
        <div className="flex flex-col items-center">
            <div className="p-5">Quiz: {quizTitle}</div>
            <div>This is the room which will host quiz: {quizId}</div>
            <div>Total Participants: </div>
        </div>
    );
}

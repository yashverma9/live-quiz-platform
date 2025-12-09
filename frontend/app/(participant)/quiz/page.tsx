// import useParticipantSocket from "@/hooks/useParticipantSocket";
"use client";

import { use } from "react";
import { useParticipantSocket } from "@/contexts/participantContext";

export default function quiz({
    searchParams,
}: {
    searchParams: Promise<{ quizId: string }>;
}) {
    const { quizId } = use(searchParams);
    console.log("Quizid: ", quizId);

    const { socket, latestData } = useParticipantSocket();
    console.log("latest data: ", latestData);

    return <div>Quiz page for participant {JSON.stringify(latestData)}</div>;
}

// import useParticipantSocket from "@/hooks/useParticipantSocket";

import { useParticipantSocket } from "@/contexts/participantContext";

export default function quiz({
    queryParam: { quizId },
}: {
    queryParam: { quizId: string };
}) {
    console.log("Quizid: ", quizId);

    const { socket, latestData } = useParticipantSocket();
    console.log("latest data: ", latestData);
}

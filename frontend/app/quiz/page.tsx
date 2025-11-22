import useParticipantSocket from "@/hooks/useParticipantSocket";

export default function quiz({
    queryParam: { quizId },
}: {
    queryParam: { quizId: string };
}) {
    console.log("Quizid: ", quizId);

    const { latestData } = useParticipantSocket();
    console.log("latest data: ", latestData);
}

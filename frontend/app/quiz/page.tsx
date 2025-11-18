import useParticipantSocket from "@/hooks/useParticipantSocket";

export default function quiz() {
    console.log("Quizid: ");

    const { latestData } = useParticipantSocket();
    console.log("latest data: ", latestData);
}

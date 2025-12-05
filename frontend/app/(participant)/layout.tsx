import { ParticipantProvider } from "@/contexts/participantContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <ParticipantProvider>{children}</ParticipantProvider>
        </div>
    );
}

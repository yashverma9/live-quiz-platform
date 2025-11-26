import { createContext } from "react";

interface HostContextType {
    hostId: number;
    socket: WebSocket;
}

const HostContext = createContext<HostContextType | null>(null);

export default function HostProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return;
}

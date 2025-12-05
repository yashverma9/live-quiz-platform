import { HostProvider } from "@/contexts/hostContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <HostProvider>{children}</HostProvider>
        </div>
    );
}

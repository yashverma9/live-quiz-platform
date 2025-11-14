import { useEffect, useState } from "react";

function App() {
    const [socket, setSocket] = useState<null | WebSocket>(null);
    const [latestMessage, setLatestMessage] = useState<string>("");
    const [inputMessage, setInputMessage] = useState<string>("");

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080"); // WebSocket is natively available like fetch
        socket.onopen = () => {
            console.log("Connected!");
            setSocket(socket);
        };
        socket.onmessage = (message) => {
            console.log("Recieved message from the ws: ", message.data);
            setLatestMessage(message.data);
        };
        return () => {
            socket.onopen = null;
            socket.onmessage = null;
            socket.close();
        };
    }, []);

    if (!socket) {
        return <div>Loading ....</div>;
    }
    return (
        <>
            <input
                value={inputMessage}
                onChange={(e) => {
                    setInputMessage(e.target.value);
                }}
            ></input>
            <button
                onClick={() => {
                    socket.send(
                        inputMessage !== ""
                            ? inputMessage
                            : "Hi from the client"
                    );
                }}
            >
                Send message
            </button>
            <div>Latest message from the ws: {latestMessage}</div>
        </>
    );
}

export default App;

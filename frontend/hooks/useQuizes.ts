"use client";
import { useState, useEffect } from "react";
import { Quizes } from "@/types";

export default function useQuizes() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [quizes, setQuizes] = useState<Quizes>([]);

    const hostId = 1; // HARDCODED FOR NOW

    useEffect(() => {
        async function fetchQuizes() {
            setIsLoading(true);
            const resp = await fetch(
                `http://localhost:8080/quiz/all?hostId=${hostId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await resp.json();
            console.log("data:", data);
            if (data.success) setQuizes(data.quizes);
            setIsLoading(false);
        }
        fetchQuizes();
    }, []);

    return { isLoading, quizes };
}

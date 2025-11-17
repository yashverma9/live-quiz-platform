"use client";

import useQuizes from "@/hooks/useQuizes";

export default function dashboard() {
    const { isLoading, quizes } = useQuizes();
    return (
        <div>
            <div>This is admin dashboard</div>
            <div>
                {!isLoading && quizes ? (
                    quizes.map((quiz) => {
                        return (
                            <div>
                                <p>{quiz.id}</p>
                                <p>{quiz.title}</p>
                            </div>
                        );
                    })
                ) : (
                    <div>Loading.....</div>
                )}
            </div>
        </div>
    );
}

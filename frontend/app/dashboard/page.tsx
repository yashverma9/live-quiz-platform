"use client";

import useQuizes from "@/hooks/useQuizes";

export default function dashboard() {
    const { isLoading, quizes } = useQuizes();
    return (
        <div className="w-full h-full">
            <div className="flex justify-center p-5">
                This is admin dashboard
            </div>
            <div className="flex flex-col w-full items-center px-20">
                {!isLoading && quizes ? (
                    quizes.map((quiz, index) => {
                        return (
                            <div
                                className="flex gap-10 justify-between w-full my-2 p-4 border border-gray-200 rounded-lg"
                                key={index}
                            >
                                <div className="flex gap-10 items-center">
                                    <p>{quiz.id}</p>
                                    <p>{quiz.title}</p>
                                </div>

                                <button className="cursor-pointer border border-gray-100 p-2 hover:bg-gray-100">
                                    Start Quiz
                                </button>
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

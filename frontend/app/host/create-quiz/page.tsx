"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function createQuiz() {
    const router = useRouter();
    interface Question {
        question: string;
        options: string[];
        answer: string;
    }

    const [questionCount, setQuestionCount] = useState<number>(1);
    const [title, setTitle] = useState<string>("");
    const [hostId, setHostId] = useState<number>(1);
    const [questionBank, setQuestionBank] = useState<Question[]>([
        {
            question: "",
            options: ["", "", "", ""],
            answer: "",
        },
    ]);

    function handleInput(
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) {
        console.log("name: ", e.target.name);
        console.log("question number: ", index + 1);
        console.log("input value: ", e.target.value);

        const optionMapping = { a: 0, b: 1, c: 2, d: 3 };

        if (e.target.name === "question")
            questionBank[index].question = e.target.value;
        else if (e.target.name === "option-a")
            questionBank[index].options[0] = e.target.value;
        else if (e.target.name === "option-b")
            questionBank[index].options[1] = e.target.value;
        else if (e.target.name === "option-c")
            questionBank[index].options[2] = e.target.value;
        else if (e.target.name === "option-d")
            questionBank[index].options[3] = e.target.value;
        else if (
            e.target.name === "answerOption" &&
            ["a", "b", "c", "d"].includes(e.target.value)
        ) {
            const key = e.target.value as keyof typeof optionMapping; // Narrow the type

            questionBank[index].answer =
                questionBank[index].options[optionMapping[key]];
        } else {
            console.error("Invalid option", e.target.value);
        }
    }

    async function handleCreate() {
        console.log(
            "questionCount: ",
            questionCount,
            "questionbank:",
            questionBank
        );

        try {
            const resp = await fetch("http://localhost:8080/quiz/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    hostId,
                    questions: questionBank,
                }),
            });
            const data = await resp.json();
            console.log("resp: ", resp);
            console.log("data:", data);
            console.log("success:", data.resp.success);
            if (data.resp.success) {
                console.log("in");
                router.push("/dashboard");
            }
        } catch (e) {
            console.error("Error creating quiz: ", e);
        }
    }

    return (
        <div className="flex flex-col w-full h-full items-center">
            <div className="p-2 text-2xl">Create Quiz</div>

            <div className="flex flex-col w-full px-10 py-5">
                <div className="flex gap-4">
                    <div>
                        <p>Host id</p>
                        <input
                            className="border border-black p-1"
                            name="hostId"
                            onChange={(e) => setHostId(Number(e.target.value))}
                        ></input>
                    </div>
                    <div>
                        <p>Quiz Title</p>
                        <input
                            className="border border-black p-1"
                            name="title"
                            onChange={(e) => setTitle(e.target.value)}
                        ></input>
                    </div>
                </div>

                <div>
                    {[...Array(questionCount)].map((_, index) => {
                        return (
                            <div key={index} className="pt-4">
                                <div># {index + 1}</div>
                                <div className="p-2">
                                    {" "}
                                    <p className="text-sm pb-2">Question</p>
                                    <input
                                        className="border border-black p-1"
                                        name="question"
                                        onChange={(e) => handleInput(e, index)}
                                    ></input>
                                    <p className="text-sm py-2 pt-4">Options</p>
                                    <div className="flex gap-2 items-center">
                                        <p>a</p>
                                        <input
                                            name={"option-a"}
                                            className="border border-black p-1"
                                            onChange={(e) =>
                                                handleInput(e, index)
                                            }
                                        ></input>
                                        <p>b</p>
                                        <input
                                            name={"option-b"}
                                            className="border border-black p-1"
                                            onChange={(e) =>
                                                handleInput(e, index)
                                            }
                                        ></input>
                                        <p>c</p>
                                        <input
                                            name={"option-c"}
                                            className="border border-black p-1"
                                            onChange={(e) =>
                                                handleInput(e, index)
                                            }
                                        ></input>
                                        <p>d</p>
                                        <input
                                            name={"option-d"}
                                            className="border border-black p-1"
                                            onChange={(e) =>
                                                handleInput(e, index)
                                            }
                                        ></input>
                                    </div>
                                    <p className="text-sm py-2 pt-4">
                                        Answer option
                                    </p>
                                    <input
                                        className="border border-black p-1"
                                        name="answerOption"
                                        onChange={(e) => handleInput(e, index)}
                                    ></input>
                                </div>
                            </div>
                        );
                    })}
                    <div className="w-full flex justify-end p-2 gap-4">
                        <button
                            className="border border-gray-500 p-2 rounded-md cursor-pointer"
                            onClick={handleCreate}
                        >
                            Create
                        </button>
                        <button
                            className="border border-gray-500 cursor-pointer mr-0 rounded-md"
                            onClick={() => {
                                setQuestionCount(questionCount + 1);
                                setQuestionBank([
                                    ...questionBank,
                                    {
                                        question: "",
                                        options: ["", "", "", ""],
                                        answer: "",
                                    },
                                ]);
                            }}
                        >
                            <p className="mr-0 w-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 640 640"
                                    width={30}
                                >
                                    <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z" />
                                </svg>
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

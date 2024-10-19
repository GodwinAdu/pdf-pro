"use client"


import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function StudyBattle() {
    const [players, setPlayers] = useState({ playerOne: {}, playerTwo: {} });
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [playerProgress, setPlayerProgress] = useState({});

    useEffect(() => {
        // Initialize socket connection
        socket = io();

        // Emit player joined event when component loads
        socket.emit("player-joined", { playerName: "Player One" });

        // Listen for game updates
        socket.on("update-game", (data) => {
            setPlayers(data.players);
            setQuestions(data.questions);
            setCurrentQuestion(data.currentQuestion);
        });

        // Listen for progress updates
        socket.on("update-progress", (progress) => {
            setPlayerProgress(progress);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Handle submitting an answer
    const submitAnswer = () => {
        const answerData = {
            playerName: "Player One",
            answer: currentAnswer,
            questionId: currentQuestion.id,
        };

        // Emit the answer event
        socket.emit("question-answered", answerData);

        // Move to the next question locally
        const nextQuestionIndex = questions.indexOf(currentQuestion) + 1;
        if (nextQuestionIndex < questions.length) {
            setCurrentQuestion(questions[nextQuestionIndex]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="container mx-auto p-8">
                {/* Players Section */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Player One */}
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">Player One</h2>
                        <p className="text-gray-600 text-lg">
                            Score: <span className="text-green-500 font-bold">{playerProgress.playerOne?.score || 0}</span>
                        </p>
                        <p className="text-gray-500 mt-2">
                            Current Question: {playerProgress.playerOne?.question || "Waiting..."}
                        </p>
                    </div>

                    {/* Player Two */}
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">Player Two</h2>
                        <p className="text-gray-600 text-lg transition-transform duration-300 transform hover:scale-110">
                            Score: <span className="text-green-500 font-bold">{playerProgress.playerOne?.score || 0}</span>
                        </p>

                        <p className="text-gray-500 mt-2">
                            Current Question: {playerProgress.playerTwo?.question || "Waiting..."}
                        </p>
                    </div>
                </div>

                {/* Question Section */}
                <div className="my-8 p-8 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg shadow-lg">
                    <h3 className="text-3xl font-bold mb-4">Question:</h3>
                    <p className="text-xl">{currentQuestion?.text || "Loading question..."}</p>
                </div>

                {/* Answer Input Section */}
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    <input
                        type="text"
                        className="w-full md:w-3/4 p-4 rounded-lg shadow-md border-2 border-gray-200 focus:outline-none focus:border-blue-500"
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        placeholder="Type your answer..."
                    />
                    <button
                        onClick={submitAnswer}
                        className="w-full md:w-1/4 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg shadow-lg transition-all duration-200"
                    >
                        Submit Answer
                    </button>
                </div>
            </div>
        </div>
    );
}

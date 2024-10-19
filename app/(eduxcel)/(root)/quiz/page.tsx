"use client";
import QuizSummary from "@/components/quiz/QuizSummary";
import { Separator } from "@/components/ui/separator";
import { shuffleArray } from "@/lib/utils";
import { Timer } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type QuizData = {
  [subject: string]: {
    question: string;
    options: string[];
    correct: string;
  }[];
};
const quizData: QuizData = {
  "Medical Nursing": [
    {
      question:
        "A client with cirrhosis of the liver has prolonged prothrombin time and a low platele count. A regular dient is ordered. What should the nurse instruct the client to do considering the clients condition?",
      options: [
        "Avoid foods higy in vitamin K",
        "Check the pulse several times a day",
        "Drink a glass of milk when taking aspirin",
        "Report signs of bleeding no matter how slight",
      ],
      correct: "Report signs of bleeding no matter how slight",
    },
    {
      question: "Which of the following about atherosclerosis is true",
      options: [
        "Intake of unsaturated fatty acid associated with decreased risk",
        "Intake of saturated fatty acid associated with decreased risk",
        "Extent of lesion in veins is same as that in arteries",
      ],
      correct:
        "Intake of unsaturated fatty acid associated with decreased risk",
    },
    {
      question:
        "A client is admitted with a diagnosis of retinal detachment. Which of the following will the nurse include in the plan of care.",
      options: [
        "Out of bed to ambulate with assistance",
        "Place an eye patch over the affected eye",
        "Maintain high-Fowler's position",
      ],
      correct: "Place an eye patch over the affected eye",
    },
    {
      question:
        "Which of the following lab studies should be done periodically if the client is taking warfarin sodium(Coumadin) ?",
      options: [
        "Blood glucose",
        "Erythrocyte count",
        "Stool specimen for occult blood",
      ],
      correct: "Stool specimen for occult blood",
    },
    {
      question:
        "In appendicitis, pain is felt in the right lower quadrant of the patient's abdomen when the left lower quadrant is palpated. This is Known as ...........",
      options: [
        "Brudziskin's sign",
        "McBurney's point",
        "Rebound tenderness",
        "Rovsing's sign",
      ],
      correct: "Rovsing's sign",
    },
    {
      question:
        "The client has an order fro heparin to prevent post-surgical thrombi. Immediately following a heparin injection, the nurse should",
      options: [
        "Aspirate for blood",
        "Check the pulse rate",
        "Check the site for bleeding",
      ],
      correct: "Check the site for bleeding",
    },
    // Add more questions for Subject 1
  ],
  "Obstetric Nursing": [
    {
      question: "Question 1 for Subject 2?",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correct: "Option 2",
    },
    // Add more questions for Subject 2
  ],
  "Paediatric Nursing": [
    {
      question: "Question 1 for Subject 3?",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correct: "Option 3",
    },
    // Add more questions for Subject 3
  ],
  "Public Health Nursing": [
    {
      question: "Question 1 for Subject 3?",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correct: "Option 3",
    },
    // Add more questions for Subject 3
  ],
  "Psychiatric Nursing": [
    {
      question: "Question 1 for Subject 3?",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correct: "Option 3",
    },
    // Add more questions for Subject 3
  ],
  "Ward Man/ Ethical Issuses": [
    {
      question: "Question 1 for Subject 3?",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correct: "Option 3",
    },
    // Add more questions for Subject 3
  ],
  "Subject 3": [
    {
      question: "Question 1 for Subject 3?",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correct: "Option 3",
    },
    // Add more questions for Subject 3
  ],
  // Add more subjects as needed
};

const subjects = Object.keys(quizData);

const page = () => {
  const [quizSummaryDetails, setQuizSummaryDetails] = useState<null | {
    subject: string;
    numberOfQuizzes: number;
    score: number;
  }>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [numberOfQuizzes, setNumberOfQuizzes] = useState(5);
  const [showIntro, setShowIntro] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answered, setAnswered] = useState(false);

  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null); // Use a ref to store the timeout ID
  const shuffledQuestions = useRef<QuizData[typeof selectedSubject]>([]);

  const isMounted = useRef(true); // Add this line to declare isMounted

  useEffect(() => {
    shuffledQuestions.current = shuffleArray(quizData[selectedSubject]);
  }, [selectedSubject]);

  useEffect(() => {
    let timeoutId;

    const updateTimer = () => {
      if (timer > 0 && !answered) {
        setTimer((prev) => prev - 1);
        timeoutId = setTimeout(updateTimer, 1000);
      } else if (timer === 0 || answered) {
        nextQuestion();
      }
    };

    timeoutId = setTimeout(updateTimer, 1000);

    return () => clearTimeout(timeoutId);
  }, [timer, answered, currentQuestion]);

  const handleAnswer = (selectedOption: string) => {
    if (!answered) {
      const currentQ = shuffledQuestions.current[currentQuestion];

      let isCorrect = false;

      if (selectedOption === currentQ?.correct) {
        setScore((prev) => prev + 1);
        isCorrect = true;
      }

      setSelectedAnswer(selectedOption);

      // Use setTimeout to delay the transition to the next question and color change
      setTimeout(() => {
        if (isMounted.current) {
          setAnswered(true);

          setTimeout(() => {
            nextQuestion();
          }, 1000); // Add a delay of 1 second
        }
      }, 500); // Add a delay of 0.5 seconds to show the color before transitioning
    }
  };

  const nextQuestion = () => {
    clearTimeoutQuestionTimer();
    if (answered) {
      setAnswered(false); // Reset the answered state for the new question
    }
    if (timer === 0 || answered) {
      if (currentQuestion < numberOfQuizzes - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setTimer(60);
      } else {
        finishQuiz();
      }
    }
  };

  console.log(selectedAnswer);
  const finishQuiz = () => {
    clearTimeoutQuestionTimer();

    setQuizSummaryDetails({
      subject: selectedSubject,
      numberOfQuizzes,
      score,
    });

    // Wait for a minute before showing the intro
    setShowModal(false);
    setCurrentQuestion(0);
    setScore(0);
    setTimeout(() => {
      setQuizSummaryDetails(null);
      setShowIntro(true);
      setSelectedSubject("");
      setSelectedAnswer("");
      setNumberOfQuizzes(5);
    }, 60000); // 60000 milliseconds = 1 minute
  };

  const clearTimeoutQuestionTimer = () => {
    clearTimeout(questionTimerRef.current);
  };

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(event.target.value);
    setCurrentQuestion(0);
  };

  const handleNumberOfQuizzesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNumberOfQuizzes(parseInt(event.target.value, 10));
    setCurrentQuestion(0);
  };

  const startQuiz = () => {
    setShowIntro(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const continueToQuiz = () => {
    setShowModal(false);
    setCurrentQuestion(0);
    setTimer(60);
  };

  const showQuestion = () => {
    const currentQ = shuffledQuestions.current[currentQuestion];
    const questionNumber = currentQuestion + 1;

    return (
      <div>
        <div className="text-md px-5  py-5 bg-white shadow-xl rounded-xl mt-2 mb-3">
          <p>
            <strong className="font-bold md:text-md text-sm">
              {" "}
              {questionNumber}.
            </strong>{" "}
            {currentQ?.question}
          </p>
        </div>
        <Separator />
        <div className="flex flex-col">
          {currentQ?.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = currentQ.correct === option;
            console.log(isCorrect, "correct");

            let buttonClass = "bg-transparent border border-2 border-gray-500";
            if (isSelected) {
              buttonClass = isCorrect
                ? " border border-2 border-green-500"
                : " border border-2 border-red-500";
            }

            return (
              <button
                key={index}
                className={`${buttonClass} text-black  px-2 py-2 m-1 rounded cursor-pointer text-left`}
                onClick={() => handleAnswer(option)}
                disabled={answered} // Disable the button after an answer is selected
              >
                <strong>{String.fromCharCode(65 + index)}:</strong> {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen h-[calc(100vh-3.5rem)]">
      <div className="bg-gray-100 p-2 md:p-8 rounded-md shadow-md w-[96%] max-w-4xl">
        {showIntro && !quizSummaryDetails && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Welcome to the Quiz!</h1>
            <p className="mb-2">
              Remember, exams are a part of the learning process, and each
              experience contributes to your personal and academic growth.
              You've prepared diligently, and you have the ability to tackle
              whatever comes your way.
            </p>
            <p className="mb-2">Rules and regulations governing the quiz...</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
              onClick={startQuiz}
            >
              Start Quiz
            </button>
          </div>
        )}

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Are You Prepared!!!.</DialogTitle>
              <DialogDescription>
                Select Subject and Number of Quizzes
              </DialogDescription>
            </DialogHeader>

            <div className="bg-white p-8">
              <div className="mb-4 flex gap-2 justify-between text-sm">
                <label className="">Subject:</label>
                <select value={selectedSubject} onChange={handleSubjectChange}>
                  <option value="" disabled> Select Subject
                  </option>
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4 flex gap-2 justify-between text-sm">
                <label className="">Number:</label>
                <input
                  type="number"
                  value={numberOfQuizzes}
                  onChange={handleNumberOfQuizzesChange}
                  min="1"
                />
              </div>
            </div>
            <DialogFooter >
              <div className="flex justify-between items-center">
              <Button type="submit" onClick={continueToQuiz}>
                Continue
              </Button>
              <Button type="submit" onClick={closeModal}>
                Cancel
              </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {!showIntro && !showModal && !quizSummaryDetails && (
          <div className="py-5">
            <h1 className="text-xl md:text-3xl font-bold text-center">
              {selectedSubject}
            </h1>
            <div className="flex justify-between items-center mb-1 mt-2">
              <div className="text-sm md:text-lg bg-black text-white rounded-lg p-2 shadow-2xl">
                Score: {score}
              </div>
              <div className="md:text-lg text-sm flex gap-1 items-center bg-black text-white rounded-lg p-2 shadow-2xl">
                <Timer className="h-5 w-5 font-bold" />:{" "}
                {Math.floor(timer / 60)}:
                {(timer % 60).toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
              </div>
            </div>
            <Separator />
            {showQuestion()}
          </div>
        )}

        {quizSummaryDetails && !showIntro && (
          <QuizSummary
            subject={quizSummaryDetails.subject}
            numberOfQuizzes={quizSummaryDetails.numberOfQuizzes}
            score={quizSummaryDetails.score}
          />
        )}
      </div>
    </div>
  );
};

export default page;

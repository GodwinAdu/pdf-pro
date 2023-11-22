"use client";
import QuizSummary from "@/components/quiz/QuizSummary";
import { Separator } from "@/components/ui/separator";
import { shuffleArray } from "@/lib/utils";
import { Timer } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

type QuizData = {
  [subject: string]: {
    [stage: number]: {
      question: string;
      options: string[];
      correct: string;
    }[];
  };
};

const quizData: QuizData = {
  "Medical Nursing": {
    1: [
      {
        question: "Question 1 for Medical Nursing Stage 1?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct: "Option 2",
      },
      {
        question: "Question 1 for Medical Nursing Stage 1?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct: "Option 2",
      },
      {
        question: "Question 1 for Medical Nursing Stage 1?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct: "Option 2",
      },
      {
        question: "Question 1 for Medical Nursing Stage 1?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct: "Option 2",
      },
      {
        question: "Question 1 for Medical Nursing Stage 1?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct: "Option 2",
      },
      {
        question: "Question 1 for Medical Nursing Stage 1?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct: "Option 2",
      },
      // Add more questions for Stage 1
    ],
    2: [
      {
        question: "Question 1 for Medical Nursing Stage 2?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct: "Option 3",
      },
      {
        question: "Question 1 for Medical Nursing Stage 2?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct: "Option 3",
      },
      {
        question: "Question 1 for Medical Nursing Stage 2?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct: "Option 3",
      },
      {
        question: "Question 1 for Medical Nursing Stage 2?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct: "Option 3",
      },
      {
        question: "Question 1 for Medical Nursing Stage 2?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct: "Option 3",
      },
      {
        question: "Question 1 for Medical Nursing Stage 2?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correct: "Option 3",
      },
      // Add more questions for Stage 2
    ],
    3: [
      {
        question: "Question 1 for Medical Nursing Stage 3?",
        options: ["Option 1", "Option 3", "Option 3", "Option 4"],
        correct: "Option 3",
      },
      {
        question: "Question 1 for Medical Nursing Stage 3?",
        options: ["Option 1", "Option 3", "Option 3", "Option 4"],
        correct: "Option 3",
      },
      {
        question: "Question 1 for Medical Nursing Stage 3?",
        options: ["Option 1", "Option 3", "Option 3", "Option 4"],
        correct: "Option 3",
      },
      {
        question: "Question 1 for Medical Nursing Stage 3?",
        options: ["Option 1", "Option 3", "Option 3", "Option 4"],
        correct: "Option 3",
      },
      {
        question: "Question 1 for Medical Nursing Stage 3?",
        options: ["Option 1", "Option 3", "Option 3", "Option 4"],
        correct: "Option 3",
      },
      {
        question: "Question 1 for Medical Nursing Stage 3?",
        options: ["Option 1", "Option 3", "Option 3", "Option 4"],
        correct: "Option 3",
      },
      // Add more questions for Stage 2
    ],
    // Add more stages as needed
  },
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
  const [currentStage, setCurrentStage] = useState(1);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [numberOfQuizzes, setNumberOfQuizzes] = useState(5);
  const [showIntro, setShowIntro] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [showSummaryAfterStage, setShowSummaryAfterStage] = useState(false);
  const [stageScore, setStageScore] = useState<number>(0);


  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const shuffledQuestions = useRef<QuizData[typeof selectedSubject]>([]);

  const getQuestionsForStage = (
    subject: string,
    stage: number
  ): QuizData[typeof subject] => {
    return quizData[subject]?.[stage] || [];
  };

  useEffect(() => {
    const questionsForStage = getQuestionsForStage(
      selectedSubject,
      currentStage
    );

    if (questionsForStage.length > 0) {
      shuffledQuestions.current = shuffleArray(questionsForStage);
    }
  }, [selectedSubject, currentStage]);

  useEffect(() => {
    if (showSummaryAfterStage) {
      // If showSummaryAfterStage is true, set a timeout to hide the summary and proceed to the next stage
      const timeoutId = setTimeout(() => {
        setShowSummaryAfterStage(false);
        setCurrentStage((prev) => prev + 1);

        // Adjust the timer for the current stage
        setTimer(60 - (currentStage - 1) * 5);
      }, 3000); // Adjust the timeout duration as needed (3 seconds in this example)

      // Clear the timeout if the component unmounts or if the user proceeds manually
      return () => clearTimeout(timeoutId);
    }
  }, [showSummaryAfterStage]);

  useEffect(() => {
    if (currentStage > 10) {
      // End of the quiz
      finishQuiz();
    } else {
      setCurrentQuestion(0);
      setTimer(60 - (currentStage - 1) * 5); // Reduce 5 seconds for each stage
      setAnswered(false);
      startQuestionTimer();
    }
  }, [currentStage]);

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
  }, [timer, answered, currentQuestion, currentStage]);

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
        setAnswered(true);

        setTimeout(() => {
          nextQuestion();
        }, 1000); // Add a delay of 1 second
      }, 500); // Add a delay of 0.5 seconds to show the color before transitioning
    }
  };

  const nextQuestion = () => {
    clearTimeoutQuestionTimer();
    if (answered) {
      setAnswered(false);
    }
    if (stageScore > 80 && currentStage < 10) {
        // If the score is greater than 80% and it's not the last stage (10th stage), show the summary
        // setShowSummaryAfterStage(true);
        setSelectedAnswer("");
        setCurrentStage((prev) => prev + 1);
      } else {
        // If it's the last stage or the score is not greater than 80%, show the intro
        setShowSummaryAfterStage(false);
        // setTimeout(() => {
        //   setQuizSummaryDetails(null);
        //   setSelectedSubject("");
        //   setSelectedAnswer("");
        //   setNumberOfQuizzes(5);
          
        // }, 10000); // 60000 milliseconds = 1 minute
      }
  
    if (timer === 0 || answered) {
      if (currentQuestion < numberOfQuizzes - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        // Move to the next stage
        const isLastStage = currentStage === 10;
        if (isLastStage) {
          // End of the quiz
          finishQuiz();
        } else {
          // Calculate the stage score
          const newStageScore = (score / numberOfQuizzes) * 100;
          setStageScore(newStageScore);
  
          // Show the QuizSummary and proceed to the next stage after a delay
          setQuizSummaryDetails({
            subject: selectedSubject,
            numberOfQuizzes,
            score: newStageScore,
          });
          setShowModal(false);
  
          setTimeout(() => {
            setQuizSummaryDetails(null);
            setShowSummaryAfterStage(true); // Move to the next stage
            setStageScore(0); // Reset stage score for the next stage
          }, 60000); // Adjust the timeout duration as needed (3 seconds in this example)
        }
      }
    }
  };
  
  

  const finishQuiz = () => {
    clearTimeoutQuestionTimer();

    const stageScore = (score / numberOfQuizzes) * 100;
    const quizSummary = {
      subject: selectedSubject,
      numberOfQuizzes,
      score: stageScore,
    };

    setQuizSummaryDetails(quizSummary);

    setShowModal(false);
    setCurrentQuestion(0);
    setScore(0);
    setTimeout(() => {
        setQuizSummaryDetails(null)
      setShowIntro(true);
      setSelectedSubject("");
      setSelectedAnswer("")
      setQuizSummaryDetails(null)
      setNumberOfQuizzes(5);
    }, 60000); // 60000 milliseconds = 1 minute

    
  };

  const clearTimeoutQuestionTimer = () => {
    clearTimeout(questionTimerRef.current);
  };

  const startQuestionTimer = () => {
    questionTimerRef.current = setTimeout(() => {
      setAnswered(true);
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    }, timer * 1000);
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
    setShowSummaryAfterStage(false);
  };

  const continueToQuiz = () => {
    setShowModal(false);
    setCurrentQuestion(0);
    setTimer(60 - (currentStage - 1) * 5); // Adjust timer for the current stage
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
            {currentQ.question}
          </p>
        </div>
        <Separator />
        <div className="flex flex-col">
          {currentQ.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = currentQ.correct === option;

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

        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-md">
            <div className="bg-white p-8 rounded shadow-md text-center">
              <h2 className="text-xl font-bold mb-4">
                Select Subject and Number of Quizzes
              </h2>
              <div className="mb-4">
                <label className="mr-2">Select Subject:</label>
                <select value={selectedSubject} onChange={handleSubjectChange}>
                  <option value="" disabled>
                    Select Subject
                  </option>
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="mr-2">Number of Quizzes:</label>
                <input
                  type="number"
                  value={numberOfQuizzes}
                  onChange={handleNumberOfQuizzesChange}
                  min="1"
                />
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded cursor-pointer"
                onClick={continueToQuiz}
              >
                Continue
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 ml-2 mt-4 rounded cursor-pointer"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

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

        {(quizSummaryDetails || showSummaryAfterStage) && !showIntro && (
          <QuizSummary
            subject={quizSummaryDetails?.subject || selectedSubject}
            numberOfQuizzes={
              quizSummaryDetails?.numberOfQuizzes || numberOfQuizzes
            }
            score={quizSummaryDetails?.score || stageScore}
          />
        )}
      </div>
    </div>
  );
};

export default page;

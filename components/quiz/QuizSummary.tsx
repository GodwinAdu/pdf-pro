

interface QuizSummaryProps {
  subject: string;
  numberOfQuizzes: number;
  score: number;
}

const QuizSummary: React.FC<QuizSummaryProps> = ({
  subject,
  numberOfQuizzes,
  score,
}) => {
  const percentageScore = Math.round((score / numberOfQuizzes) * 100);

  let feedbackMessage = '';
  if (percentageScore >= 80) {
    feedbackMessage = 'Excellent! You performed exceptionally well.';
  } else if (percentageScore >= 60) {
    feedbackMessage = 'Good job! You performed well.';
  } else {
    feedbackMessage = 'Keep practicing. You can improve!';
  }

  return (
    <div className="bg-white p-8 rounded shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">Quiz Summary</h2>
      <div className="text-left">
        <p>
          <strong>Subject:</strong> {subject}
        </p>
        <p>
          <strong>Number of Quizzes:</strong> {numberOfQuizzes}
        </p>
        <p>
          <strong>Your Score:</strong> {score}/{numberOfQuizzes}
        </p>
        <p>
          <strong>Percentage:</strong> {percentageScore}%
        </p>
        <p className="font-bold text-blue-500 mt-4">{feedbackMessage}</p>
      </div>
    </div>
  );
};

export default QuizSummary;

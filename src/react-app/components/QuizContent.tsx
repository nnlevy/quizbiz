import type { QuizQuestion } from "./QuestionsData";

type QuizProps = {
  questions: QuizQuestion[];
  answers: Record<string, string>;
  currentIndex: number;
  onSelectAnswer: (questionId: string, optionId: string) => void;
  onGoBack: () => void;
  onGoNext: () => void;
  onSubmit: () => void;
};

const QuizContent = ({
  questions,
  answers,
  currentIndex,
  onSelectAnswer,
  onGoBack,
  onGoNext,
  onSubmit,
}: QuizProps) => {
  const question = questions[currentIndex];
  const selectedAnswer = answers[question.id];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <section className="quiz-shell" aria-labelledby="quiz-question-title">
      <div className="quiz-shell__progress" aria-hidden="true">
        <div className="quiz-shell__progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-shell__header">
        <p className="quizbiz-advisory">{question.eyebrow}</p>
        <h3 id="quiz-question-title">{question.prompt}</h3>
        <p>{question.hint}</p>
      </div>

      <div className="quiz-shell__options" role="list" aria-label={question.prompt}>
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={`quiz-shell__option${isSelected ? " is-selected" : ""}`}
              onClick={() => onSelectAnswer(question.id, option.id)}
              aria-pressed={isSelected}
            >
              <span className="quiz-shell__option-label">{option.label}</span>
            </button>
          );
        })}
      </div>

      <div className="quiz-shell__controls">
        <button
          type="button"
          className="quizbiz-secondary-button"
          onClick={onGoBack}
          disabled={currentIndex === 0}
        >
          Back
        </button>
        {isLastQuestion ? (
          <button
            type="button"
            className="quizbiz-primary-button"
            onClick={onSubmit}
            disabled={!selectedAnswer}
          >
            See my score
          </button>
        ) : (
          <button
            type="button"
            className="quizbiz-primary-button"
            onClick={onGoNext}
            disabled={!selectedAnswer}
          >
            Next question
          </button>
        )}
      </div>
    </section>
  );
};

export default QuizContent;

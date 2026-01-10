import { useCallback, useEffect, useMemo, useState } from "react";

const SCORE_MESSAGES = [
  "You got {score}/{total} — your Water IQ is just getting started!",
  "You got {score}/{total} — good instincts, keep going!",
  "You got {score}/{total} — your Water IQ is strong!",
  "You got {score}/{total} — your Water IQ is high!",
];

const getScoreMessage = (score, total) => {
  const ratio = total ? score / total : 0;
  if (ratio < 0.4) return SCORE_MESSAGES[0];
  if (ratio < 0.7) return SCORE_MESSAGES[1];
  if (ratio < 0.9) return SCORE_MESSAGES[2];
  return SCORE_MESSAGES[3];
};

const WaterIQQuiz = ({ onComplete }) => {
  // Core quiz state: questions, progress, and result tracking.
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  const loadQuestions = useCallback(async () => {
    setIsLoading(true);
    setLoadError(false);

    try {
      // Load the self-hosted JSON data on mount so we can retry on failure.
      const module = await import("../../data/waterIQQuestions.json");
      const data = module.default ?? module;
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Questions not found");
      }
      setQuestions(data);
      setCurrentIndex(0);
      setSelectedIndex(null);
      setScore(0);
      setShowResults(false);
    } catch (error) {
      console.error("Failed to load Water IQ questions", error);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  const scoreMessage = useMemo(
    () => getScoreMessage(score, totalQuestions),
    [score, totalQuestions],
  );
  const formattedScoreMessage = useMemo(
    () =>
      scoreMessage
        .replace("{score}", String(score))
        .replace("{total}", String(totalQuestions)),
    [scoreMessage, score, totalQuestions],
  );

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  const handleNext = () => {
    if (selectedIndex == null || !currentQuestion) return;

    // Update score before moving forward.
    if (selectedIndex === currentQuestion.answerIndex) {
      setScore((prev) => prev + 1);
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < totalQuestions) {
      setCurrentIndex(nextIndex);
      setSelectedIndex(null);
    } else {
      setShowResults(true);
      onComplete?.();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setShowResults(false);
  };

  // Loading state while we hydrate the quiz JSON.
  if (isLoading) {
    return (
      <section className="section water-iq-quiz">
        <div className="water-iq-card">
          <h1 className="wsH1">Water IQ Challenge</h1>
          <p className="wsP">Loading the quiz…</p>
        </div>
      </section>
    );
  }

  // Friendly fallback if the JSON import fails.
  if (loadError) {
    return (
      <section className="section water-iq-quiz">
        <div className="water-iq-card">
          <h1 className="wsH1">Water IQ Challenge</h1>
          <p className="wsP">Quiz failed to load, please try again.</p>
          <button
            type="button"
            className="wsBtnPrimary"
            aria-label="Retry loading the Water IQ quiz"
            onClick={loadQuestions}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // Results screen after the final question.
  if (showResults) {
    return (
      <section className="section water-iq-quiz">
        <div className="water-iq-card water-iq-card--results">
          <h1 className="wsH1">Your Water IQ Results</h1>
          <p className="water-iq-score">
            {score}/{totalQuestions}
          </p>
          <p className="wsP">{formattedScoreMessage}</p>
          <div className="water-iq-results-actions">
            <button
              type="button"
              className="wsBtnPrimary"
              aria-label="Try the Water IQ quiz again"
              onClick={handleRestart}
            >
              Try again
            </button>
            <a className="wsBtnGhost" href="/" aria-label="Return to the WaterShortcut home page">
              Return home
            </a>
          </div>
        </div>
      </section>
    );
  }

  // Main quiz view (one question at a time).
  return (
    <section className="section water-iq-quiz">
      <div className="water-iq-card">
        <header className="water-iq-header">
          <p className="water-iq-progress">Question {currentIndex + 1} of {totalQuestions}</p>
          <h1 className="wsH1">Water IQ Challenge</h1>
        </header>
        <h2 className="water-iq-question">{currentQuestion?.question}</h2>
        <div className="water-iq-choices" role="group" aria-label="Answer choices">
          {currentQuestion?.choices.map((choice, index) => (
            <button
              key={`${choice}-${index}`}
              type="button"
              className={`water-iq-choice ${selectedIndex === index ? "is-selected" : ""}`}
              aria-pressed={selectedIndex === index}
              aria-label={`Select answer: ${choice}`}
              onClick={() => handleSelect(index)}
            >
              {choice}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="wsBtnPrimary water-iq-next"
          aria-label="Go to the next question"
          onClick={handleNext}
          disabled={selectedIndex == null}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default WaterIQQuiz;

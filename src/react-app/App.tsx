import { useMemo, useState } from "react";

import { DEFAULT_ADSENSE_SLOTS } from "../config/adsense";
import AdSenseSlot from "./components/AdSenseSlot";
import Quiz from "./components/QuizContent";
import {
  businessQuestions,
  calculateQuizScore,
  getCorrectAnswer,
  type QuizQuestion,
} from "./components/QuestionsData";
import { usePageMeta } from "./hooks/usePageMeta";
import "./App.css";
import { normalizePathname } from "./utils/pathname";

type AnswerMap = Record<string, string>;

type ResultBand = {
  id: string;
  label: string;
  heading: string;
  summary: string;
  tips: string[];
};

const RESULT_BANDS: ResultBand[] = [
  {
    id: "starter",
    label: "Getting started",
    heading: "Start with one problem and one customer segment.",
    summary:
      "You need a tighter launch plan before spending money on branding, product depth, or channels.",
    tips: [
      "Interview five potential customers before you build more.",
      "Write a one-sentence offer that explains the pain, audience, and outcome.",
      "Pick one acquisition channel you can test this week.",
    ],
  },
  {
    id: "operator",
    label: "Operator mode",
    heading: "You understand the basics. Now tighten execution.",
    summary:
      "Your next gains come from sharper positioning, simpler pricing, and a repeatable weekly operating rhythm.",
    tips: [
      "Turn your best answer into a landing page promise and CTA.",
      "Track one funnel metric from traffic to qualified lead or pilot.",
      "Document the first three repeatable tasks before you hire anyone.",
    ],
  },
  {
    id: "builder",
    label: "Builder ready",
    heading: "You are ready to launch a disciplined first version.",
    summary:
      "The fundamentals are there. Focus on shipping quickly, measuring demand, and compounding what works.",
    tips: [
      "Launch a paid pilot before expanding scope.",
      "Review customer conversations and conversion metrics every week.",
      "Protect momentum by saying no to channels and features that do not validate demand.",
    ],
  },
];

const LEGAL_COPY: Record<
  string,
  { title: string; description: string; heading: string; body: string[] }
> = {
  "/privacy": {
    title: "Privacy | Quizbiz",
    description:
      "Quizbiz uses lightweight analytics and ad placements to keep the startup quiz free and accessible.",
    heading: "Privacy",
    body: [
      "Quizbiz stores quiz answers locally in your browser session so you can complete the experience without creating an account.",
      "We may use privacy-respecting analytics and AdSense to understand usage and support the free product. We do not sell personal information.",
      "If you contact us directly, use only the information necessary for your request.",
    ],
  },
  "/terms": {
    title: "Terms | Quizbiz",
    description:
      "Terms for using Quizbiz and the startup basics quiz content on quizbiz.org.",
    heading: "Terms",
    body: [
      "Quizbiz provides educational quiz content about starting a business. It is not legal, tax, or financial advice.",
      "You are responsible for decisions you make based on the content, including any launch, hiring, pricing, or marketing actions.",
      "We may update or remove parts of the quiz experience, advertising surfaces, and supporting content at any time.",
    ],
  },
};

const getResultBand = (score: number) => {
  if (score < 40) return RESULT_BANDS[0];
  if (score < 80) return RESULT_BANDS[1];
  return RESULT_BANDS[2];
};

const buildStructuredData = (score?: number): Array<Record<string, unknown>> => {
  const base: Array<Record<string, unknown>> = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Quizbiz",
      url: "https://quizbiz.org/",
    },
    {
      "@context": "https://schema.org",
      "@type": "Quiz",
      name: "Startup Basics Quiz",
      description:
        "A five-question business quiz on customer validation, pricing, channels, hiring, and launch metrics.",
      educationalAlignment: "Self-assessment",
      numberOfQuestions: businessQuestions.length,
    },
  ];

  if (typeof score === "number") {
    base.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "Improve your business quiz score",
      description: `Startup Basics Quiz result: ${score}%`,
      step: getResultBand(score).tips.map((tip) => ({
        "@type": "HowToStep",
        text: tip,
      })),
    });
  }

  return base;
};

const App = () => {
  const pathname =
    typeof window === "undefined" ? "/" : normalizePathname(window.location.pathname);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => calculateQuizScore(businessQuestions, answers),
    [answers],
  );
  const correctCount = useMemo(
    () =>
      businessQuestions.filter((question: QuizQuestion) => {
        const selected = answers[question.id];
        return selected === getCorrectAnswer(question).id;
      }).length,
    [answers],
  );
  const resultBand = useMemo(() => getResultBand(score), [score]);

  const pageMeta = useMemo(() => {
    if (pathname in LEGAL_COPY) {
      const page = LEGAL_COPY[pathname];
      return {
        title: page.title,
        description: page.description,
        canonicalPath: pathname,
        ogImage: "https://quizbiz.org/brand/icon.png",
      };
    }

    if (submitted) {
      return {
        title: `${score}% on the Startup Basics Quiz | Quizbiz`,
        description:
          "See your startup quiz score, review each answer, and get the next steps to launch smarter.",
        canonicalPath: "/",
        ogImage: "https://quizbiz.org/brand/icon.png",
        structuredData: buildStructuredData(score),
      };
    }

    return {
      title: "Startup Basics Quiz | Quizbiz",
      description:
        "Take a five-question startup quiz on validation, pricing, marketing, hiring, and launch metrics.",
      canonicalPath: "/",
      ogImage: "https://quizbiz.org/brand/icon.png",
      structuredData: buildStructuredData(),
    };
  }, [pathname, score, submitted]);

  usePageMeta(pageMeta);

  const currentQuestion = businessQuestions[currentIndex];
  const selectedAnswer = answers[currentQuestion.id];

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: optionId,
    }));
  };

  const handleGoBack = () => {
    setCurrentIndex((previous) => Math.max(previous - 1, 0));
  };

  const handleGoNext = () => {
    if (!selectedAnswer) return;
    setCurrentIndex((previous) =>
      Math.min(previous + 1, businessQuestions.length - 1),
    );
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setSubmitted(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (pathname in LEGAL_COPY) {
    const page = LEGAL_COPY[pathname];
    return (
      <div className="quizbiz-app">
        <header className="quizbiz-topbar">
          <a className="quizbiz-brand" href="/">
            Quizbiz
          </a>
          <span className="quizbiz-tagline">Startup quiz app for first-time founders</span>
        </header>
        <main className="quizbiz-legal">
          <div className="quizbiz-legal__inner">
            <p className="quizbiz-kicker">Legal</p>
            <h1>{page.heading}</h1>
            {page.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <a className="quizbiz-link" href="/">
              Back to the quiz
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="quizbiz-app">
      <header className="quizbiz-topbar">
        <div>
          <a className="quizbiz-brand" href="/">
            Quizbiz
          </a>
          <p className="quizbiz-tagline">Five questions. Better business instincts.</p>
        </div>
        <div className="quizbiz-topbar__ad" aria-label="Sponsored">
          <span className="quizbiz-ad-label">Sponsored</span>
          <AdSenseSlot
            slotId={DEFAULT_ADSENSE_SLOTS.inline}
            adType="inline"
            className="quizbiz-ad-slot"
          />
        </div>
      </header>

      <main className="quizbiz-main">
        <section className="quizbiz-hero">
          <div className="quizbiz-hero__copy">
            <p className="quizbiz-kicker">Startup Basics Quiz</p>
            <h1>Test the instincts that matter before you start a business.</h1>
            <p className="quizbiz-lead">
              Quizbiz turns the first week of founder confusion into a fast reality check on
              validation, pricing, marketing, hiring, and launch discipline.
            </p>
            <div className="quizbiz-hero__meta">
              <span>5 multiple-choice questions</span>
              <span>Score from 0% to 100%</span>
              <span>Actionable tips at the end</span>
            </div>
          </div>
          <div className="quizbiz-hero__panel" aria-label="Quiz outline">
            <div className="quizbiz-panel__row">
              <span>Question set</span>
              <strong>Starting a business</strong>
            </div>
            <div className="quizbiz-panel__score">
              <span>Current progress</span>
              <strong>
                {submitted ? "Complete" : `${currentIndex + 1}/${businessQuestions.length}`}
              </strong>
            </div>
            <ul className="quizbiz-panel__list">
              <li>Validate the problem before you build.</li>
              <li>Keep the offer simple enough to sell in one sentence.</li>
              <li>Measure the launch with one hard demand signal.</li>
            </ul>
          </div>
        </section>

        <section className="quizbiz-content" aria-labelledby="quiz-heading">
          <div className="quizbiz-content__header">
            <p className="quizbiz-kicker">Interactive quiz</p>
            <h2 id="quiz-heading">
              {submitted ? "Your results" : "Answer each question before moving on."}
            </h2>
          </div>

          {submitted ? (
            <section className="quizbiz-results" aria-labelledby="results-heading">
              <div className="quizbiz-results__summary">
                <p className="quizbiz-advisory">{resultBand.label}</p>
                <h3 id="results-heading">{resultBand.heading}</h3>
                <p>{resultBand.summary}</p>
                <div className="quizbiz-score">
                  <span className="quizbiz-score__value">{score}%</span>
                  <span className="quizbiz-score__caption">
                    {correctCount} of {businessQuestions.length} correct
                  </span>
                </div>
                <ul className="quizbiz-results__tips">
                  {resultBand.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
                <button className="quizbiz-primary-button" type="button" onClick={handleRestart}>
                  Retake the quiz
                </button>
              </div>

              <div className="quizbiz-review">
                {businessQuestions.map((question: QuizQuestion, index: number) => {
                  const correctAnswer = getCorrectAnswer(question);
                  const chosenAnswer =
                    question.options.find((option) => option.id === answers[question.id]) ?? null;
                  const isCorrect = chosenAnswer?.id === correctAnswer.id;

                  return (
                    <article className="quizbiz-review__item" key={question.id}>
                      <p className="quizbiz-review__index">Question {index + 1}</p>
                      <h4>{question.prompt}</h4>
                      <p className="quizbiz-review__status">
                        {isCorrect ? "Correct" : "Needs work"}
                      </p>
                      <p>
                        <strong>Your answer:</strong>{" "}
                        {chosenAnswer?.label ?? "No answer selected"}
                      </p>
                      {!isCorrect ? (
                        <p>
                          <strong>Best answer:</strong> {correctAnswer.label}
                        </p>
                      ) : null}
                      <p>{correctAnswer.insight}</p>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : (
            <Quiz
              answers={answers}
              currentIndex={currentIndex}
              onGoBack={handleGoBack}
              onGoNext={handleGoNext}
              onSelectAnswer={handleSelectAnswer}
              onSubmit={handleSubmit}
              questions={businessQuestions}
            />
          )}
        </section>
      </main>

      <footer className="quizbiz-footer">
        <div className="quizbiz-footer__copy">
          <p className="quizbiz-kicker">Quizbiz.org</p>
          <h2>Keep the launch simple enough to learn fast.</h2>
          <p>
            Quizbiz is built for founders who need sharper first principles before spending more
            time or money.
          </p>
          <nav className="quizbiz-footer__nav" aria-label="Footer">
            <a href="/">Quiz</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </nav>
        </div>
        <div className="quizbiz-footer__ad" aria-label="Footer advertisement">
          <span className="quizbiz-ad-label">Advertisement</span>
          <AdSenseSlot
            slotId={DEFAULT_ADSENSE_SLOTS.footer}
            adType="footer"
            format="autorelaxed"
            className="quizbiz-ad-slot"
          />
        </div>
      </footer>
    </div>
  );
};

export default App;

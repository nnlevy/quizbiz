export type QuizOption = {
  id: string;
  label: string;
  isCorrect: boolean;
  insight: string;
};

export type QuizQuestion = {
  id: string;
  eyebrow: string;
  prompt: string;
  hint: string;
  options: QuizOption[];
};

export const businessQuestions: QuizQuestion[] = [
  {
    id: "validate-problem",
    eyebrow: "Question 1",
    prompt: "What should come first when you want to start a business?",
    hint: "Start where uncertainty is highest.",
    options: [
      {
        id: "design-logo",
        label: "Design the logo and buy social handles",
        isCorrect: false,
        insight:
          "Branding can wait. Early founders need proof that a real customer has a painful problem worth solving.",
      },
      {
        id: "customer-problem",
        label: "Talk to potential customers and validate the problem",
        isCorrect: true,
        insight:
          "Customer interviews and problem validation reduce wasted product work and give you sharper language for the offer.",
      },
      {
        id: "register-llc",
        label: "Register an LLC before anything else",
        isCorrect: false,
        insight:
          "Legal setup matters, but it is not the first signal of demand. Start by confirming the problem and the buyer.",
      },
      {
        id: "hire-dev",
        label: "Hire a developer to build the full product",
        isCorrect: false,
        insight:
          "Building too early is expensive. First prove people want the outcome enough to act.",
      },
    ],
  },
  {
    id: "pricing",
    eyebrow: "Question 2",
    prompt: "What is the best first approach to pricing a new offer?",
    hint: "Keep it simple enough to test and learn from.",
    options: [
      {
        id: "lowest-market",
        label: "Be the cheapest option in the market",
        isCorrect: false,
        insight:
          "Competing only on low price makes positioning weak and leaves little room to learn what the outcome is actually worth.",
      },
      {
        id: "copy-competitor",
        label: "Copy a competitor price without asking why",
        isCorrect: false,
        insight:
          "Competitor pricing can inform your range, but you still need a reasoned starting point tied to customer value and scope.",
      },
      {
        id: "value-hypothesis",
        label: "Set a simple price based on value and test willingness to pay",
        isCorrect: true,
        insight:
          "A clean pricing hypothesis lets you learn from sales conversations without introducing unnecessary complexity.",
      },
      {
        id: "delay-pricing",
        label: "Avoid pricing until after the full product is built",
        isCorrect: false,
        insight:
          "Pricing is part of validation. If customers will not pay, that is a critical early signal.",
      },
    ],
  },
  {
    id: "distribution",
    eyebrow: "Question 3",
    prompt: "How should a first-time founder usually approach marketing?",
    hint: "Narrow beats scattered.",
    options: [
      {
        id: "all-channels",
        label: "Launch on every channel at once",
        isCorrect: false,
        insight:
          "Spreading across too many channels makes it hard to learn what is actually creating traction.",
      },
      {
        id: "single-channel",
        label: "Pick one channel where the target customer already pays attention",
        isCorrect: true,
        insight:
          "A single-channel focus creates cleaner feedback loops and lowers the operating load in the first weeks.",
      },
      {
        id: "ads-immediately",
        label: "Buy ads immediately before the message is clear",
        isCorrect: false,
        insight:
          "Paid acquisition amplifies your messaging. If the positioning is weak, paid spend just burns money faster.",
      },
      {
        id: "wait-for-organic",
        label: "Wait for word of mouth before doing any outreach",
        isCorrect: false,
        insight:
          "You still need deliberate distribution. Passive waiting is rarely enough for an early business.",
      },
    ],
  },
  {
    id: "hiring",
    eyebrow: "Question 4",
    prompt: "When is it usually smart to make an early hire?",
    hint: "Do not hire to hide uncertainty.",
    options: [
      {
        id: "before-revenue",
        label: "Before demand is clear, so the team feels bigger",
        isCorrect: false,
        insight:
          "Hiring before demand is repeatable often turns uncertainty into payroll risk.",
      },
      {
        id: "after-repeatable",
        label: "After demand is repeatable and the role solves a clear bottleneck",
        isCorrect: true,
        insight:
          "A good first hire should remove a known bottleneck in a business that already shows consistent demand or delivery pressure.",
      },
      {
        id: "friends-first",
        label: "As soon as a friend is available to help",
        isCorrect: false,
        insight:
          "Convenience is not a hiring strategy. The role and economics should be clear first.",
      },
      {
        id: "replace-founder",
        label: "Once you get tired of the work, regardless of economics",
        isCorrect: false,
        insight:
          "Founders should document and understand the work before delegating it.",
      },
    ],
  },
  {
    id: "metrics",
    eyebrow: "Question 5",
    prompt: "Which metric matters most in the first month of a small business launch?",
    hint: "Choose the metric closest to real demand.",
    options: [
      {
        id: "followers",
        label: "Social media follower count",
        isCorrect: false,
        insight:
          "Attention can help, but it is weaker than signals tied directly to qualified interest or payment.",
      },
      {
        id: "pageviews",
        label: "Raw pageviews",
        isCorrect: false,
        insight:
          "Traffic matters only if it moves toward a useful business outcome like leads, booked calls, or payments.",
      },
      {
        id: "qualified-demand",
        label: "A concrete demand signal like booked calls, pilots, or paid conversions",
        isCorrect: true,
        insight:
          "Early-stage businesses need a hard signal that customers want the offer enough to take meaningful action.",
      },
      {
        id: "feature-count",
        label: "Number of shipped features",
        isCorrect: false,
        insight:
          "Shipping matters, but demand is more important than scope in the first month.",
      },
    ],
  },
];

export const getCorrectAnswer = (question: QuizQuestion): QuizOption =>
  question.options.find((option) => option.isCorrect) ?? question.options[0];

export const calculateQuizScore = (
  questions: QuizQuestion[],
  answers: Record<string, string>,
) => {
  if (!questions.length) return 0;
  const correctAnswers = questions.reduce((count, question) => {
    const selected = answers[question.id];
    return count + (selected === getCorrectAnswer(question).id ? 1 : 0);
  }, 0);
  return Math.round((correctAnswers / questions.length) * 100);
};

import { useEffect, useMemo, useRef, useState } from "react";
import "./LeakPatrol.css";

const ICON_MAP: Record<Scenario["icon"], string> = {
  faucet: "🚰",
  toilet: "🚽",
  shower: "🚿",
  sprinkler: "💦",
  meter: "📟",
  bill: "📄",
  pipe: "🛠️",
};

type Action = "check" | "measure" | "fix" | "replace";

type Scenario = {
  id: string;
  text: string;
  icon: "faucet" | "toilet" | "shower" | "sprinkler" | "meter" | "bill" | "pipe";
  correctAction: Action;
  waterSaved: number;
  tip: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
};

const SCENARIOS: Scenario[] = [
  {
    id: "faucet-drip",
    text: "Bathroom faucet drips all day",
    icon: "faucet",
    correctAction: "fix",
    waterSaved: 5,
    tip: "A worn washer can waste hundreds of gallons a year.",
    difficulty: 1,
  },
  {
    id: "toilet-running",
    text: "Toilet keeps running after every flush",
    icon: "toilet",
    correctAction: "fix",
    waterSaved: 12,
    tip: "Replace the flapper or adjust the chain to stop silent leaks.",
    difficulty: 2,
  },
  {
    id: "shower-90s",
    text: "90s-era showerhead, 15 min showers",
    icon: "shower",
    correctAction: "replace",
    waterSaved: 18,
    tip: "Swapping to a WaterSense showerhead can cut use by 30%.",
    difficulty: 3,
  },
  {
    id: "bill-jump",
    text: "Bill jumps 40% with same habits",
    icon: "bill",
    correctAction: "measure",
    waterSaved: 20,
    tip: "Compare meter reads and look for tier changes before paying.",
    difficulty: 3,
  },
  {
    id: "soggy-patch",
    text: "Soggy patch and super-green lawn",
    icon: "sprinkler",
    correctAction: "check",
    waterSaved: 10,
    tip: "Walk the zone and inspect heads for cracks or leaks.",
    difficulty: 1,
  },
  {
    id: "meter-spinning",
    text: "All taps off but meter still spinning",
    icon: "meter",
    correctAction: "measure",
    waterSaved: 16,
    tip: "Document the meter test to prove a hidden leak before billing.",
    difficulty: 2,
  },
  {
    id: "sidewalk-spray",
    text: "Sprinkler blasting the sidewalk",
    icon: "sprinkler",
    correctAction: "replace",
    waterSaved: 8,
    tip: "Swap or realign broken heads to keep water on the grass.",
    difficulty: 2,
  },
  {
    id: "noon-watering",
    text: "Watering at noon every day",
    icon: "sprinkler",
    correctAction: "check",
    waterSaved: 6,
    tip: "Schedule early morning cycles to cut evaporation.",
    difficulty: 1,
  },
  {
    id: "shower-long",
    text: "20-minute hot showers",
    icon: "shower",
    correctAction: "measure",
    waterSaved: 7,
    tip: "Track time to stay under 8-10 minutes and save heat and water.",
    difficulty: 2,
  },
  {
    id: "hose-burst",
    text: "Old hose bib drips at the handle",
    icon: "pipe",
    correctAction: "fix",
    waterSaved: 9,
    tip: "Tighten packing nuts or replace washers to stop outdoor drips.",
    difficulty: 1,
  },
  {
    id: "tile-warp",
    text: "Warping baseboard near shower",
    icon: "pipe",
    correctAction: "check",
    waterSaved: 11,
    tip: "Check caulk lines and valves before mold sets in.",
    difficulty: 2,
  },
  {
    id: "bill-estimate",
    text: "Utility switched to estimated bills",
    icon: "bill",
    correctAction: "measure",
    waterSaved: 13,
    tip: "Submit your own reads to avoid being overcharged.",
    difficulty: 3,
  },
  {
    id: "toilet-sweat",
    text: "Condensation around toilet tank",
    icon: "toilet",
    correctAction: "check",
    waterSaved: 6,
    tip: "Inspect for slow leaks or high humidity causing drips.",
    difficulty: 2,
  },
  {
    id: "pipe-rattle",
    text: "Pipes rattle when faucet shuts off",
    icon: "pipe",
    correctAction: "check",
    waterSaved: 8,
    tip: "Water hammer can loosen joints—inspect brackets and pressure.",
    difficulty: 3,
  },
  {
    id: "spray-mist",
    text: "Irrigation misting in wind",
    icon: "sprinkler",
    correctAction: "measure",
    waterSaved: 6,
    tip: "Pause watering on windy days to keep droplets on plants.",
    difficulty: 2,
  },
  {
    id: "slab-warm",
    text: "Warm spot on slab floor",
    icon: "pipe",
    correctAction: "measure",
    waterSaved: 22,
    tip: "Possible hot water slab leak—check meter and call a pro.",
    difficulty: 4,
  },
  {
    id: "old-water-heater",
    text: "15-year-old water heater rusting",
    icon: "pipe",
    correctAction: "replace",
    waterSaved: 14,
    tip: "Old tanks leak suddenly—replace before flooding starts.",
    difficulty: 4,
  },
  {
    id: "drip-echo",
    text: "Can hear drip behind wall at night",
    icon: "pipe",
    correctAction: "check",
    waterSaved: 15,
    tip: "Use a moisture meter or open a small inspection hole quickly.",
    difficulty: 3,
  },
  {
    id: "meter-lid",
    text: "Meter box full of water",
    icon: "meter",
    correctAction: "check",
    waterSaved: 10,
    tip: "Could be rainwater or a service line leak—inspect before calling utility.",
    difficulty: 2,
  },
  {
    id: "kinked-hose",
    text: "Garden hose split near nozzle",
    icon: "faucet",
    correctAction: "replace",
    waterSaved: 5,
    tip: "Replace damaged hoses to avoid bursts wasting water.",
    difficulty: 1,
  },
  {
    id: "pool-level",
    text: "Pool level drops an inch overnight",
    icon: "meter",
    correctAction: "measure",
    waterSaved: 17,
    tip: "Perform a bucket test to confirm a leak before refilling.",
    difficulty: 4,
  },
  {
    id: "gutter-drip",
    text: "Water dripping from soffit after showers",
    icon: "pipe",
    correctAction: "check",
    waterSaved: 9,
    tip: "Look for vent stack flashing or supply line leaks above.",
    difficulty: 3,
  },
  {
    id: "washer-supply",
    text: "Washer hoses are cracked",
    icon: "pipe",
    correctAction: "replace",
    waterSaved: 12,
    tip: "Braided steel hoses prevent bursts that flood rooms.",
    difficulty: 2,
  },
  {
    id: "sewer-smell",
    text: "Sewer smell near a floor drain",
    icon: "pipe",
    correctAction: "check",
    waterSaved: 7,
    tip: "Pour water to refill the trap and rule out cracked lines.",
    difficulty: 2,
  },
  {
    id: "silent-toilet",
    text: "Tiny silent toilet trickle",
    icon: "toilet",
    correctAction: "measure",
    waterSaved: 11,
    tip: "Drop food coloring in tank to confirm leaks before repairing.",
    difficulty: 2,
  },
  {
    id: "sprinkler-leak",
    text: "Valve box stays muddy",
    icon: "sprinkler",
    correctAction: "fix",
    waterSaved: 13,
    tip: "Replace leaking diaphragm or tighten fittings to stop seepage.",
    difficulty: 3,
  },
  {
    id: "aged-toilet",
    text: "1980s toilet using 3.5 gpf",
    icon: "toilet",
    correctAction: "replace",
    waterSaved: 20,
    tip: "Switching to 1.28 gpf can save thousands of gallons yearly.",
    difficulty: 4,
  },
  {
    id: "old-faucet",
    text: "Kitchen aerator clogged and spraying",
    icon: "faucet",
    correctAction: "fix",
    waterSaved: 6,
    tip: "Clean or replace the aerator to restore proper flow.",
    difficulty: 1,
  },
  {
    id: "smart-meter-alert",
    text: "Smart meter flags overnight usage",
    icon: "meter",
    correctAction: "measure",
    waterSaved: 15,
    tip: "Shut off fixtures one by one to isolate the leak path.",
    difficulty: 3,
  },
];

const LEVEL_LENGTH = 10;

const LEVEL_RULES = {
  1: { maxDifficulty: 2, minDifficulty: 1, timer: 5 },
  2: { maxDifficulty: 3, minDifficulty: 1, timer: 4 },
  3: { maxDifficulty: 4, minDifficulty: 2, timer: 3.5 },
};

function getRulesForLevel(level: number) {
  if (level >= 4) {
    return { maxDifficulty: 5, minDifficulty: 3, timer: 3 };
  }
  return LEVEL_RULES[level as keyof typeof LEVEL_RULES];
}

function shuffle<T>(items: T[]) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function formatGallons(value: number) {
  return `${value.toLocaleString()} gal saved`;
}

export default function LeakPatrol() {
  const [phase, setPhase] = useState<
    "start" | "playing" | "levelComplete" | "gameOver"
  >("start");
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [highestLevel, setHighestLevel] = useState(1);
  const [bestCombo, setBestCombo] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerDuration, setTimerDuration] = useState(5);
  const [timerRemaining, setTimerRemaining] = useState(5);
  const [recentGain, setRecentGain] = useState<number | null>(null);
  const [levelStats, setLevelStats] = useState({ correct: 0, total: 0 });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const intervalRef = useRef<number | null>(null);
  const answeredRef = useRef(false);

  useEffect(() => {
    const storedBest = Number(localStorage.getItem("leakPatrol_bestScore"));
    const storedLevel = Number(localStorage.getItem("leakPatrol_highestLevel"));
    if (!Number.isNaN(storedBest)) {
      setBestScore(storedBest);
    }
    if (!Number.isNaN(storedLevel) && storedLevel > 0) {
      setHighestLevel(storedLevel);
    }
  }, []);

  const currentScenario = scenarios[currentIndex];

  const livesDisplay = useMemo(
    () => "💧".repeat(Math.max(lives, 0)) || "✖",
    [lives],
  );

  const tankFill = useMemo(() => {
    const maxVisual = Math.min(score, 200);
    return Math.min(100, (maxVisual / 200) * 100);
  }, [score]);

  const levelAccuracy = useMemo(() => {
    if (levelStats.total === 0) return 0;
    return Math.round((levelStats.correct / levelStats.total) * 100);
  }, [levelStats]);

  useEffect(() => {
    if (phase !== "playing") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return () => {};
    }

    intervalRef.current = window.setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev <= 0) {
          return 0;
        }
        return Math.max(0, Number((prev - 0.1).toFixed(2)));
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [phase]);

  const startLevel = (nextLevel = 1) => {
    const rule = getRulesForLevel(nextLevel);
    const levelPool = SCENARIOS.filter(
      (scenario) =>
        scenario.difficulty >= rule.minDifficulty &&
        scenario.difficulty <= rule.maxDifficulty,
    );
    const selected = shuffle(levelPool).slice(0, LEVEL_LENGTH);
    setScenarios(selected);
    setCurrentIndex(0);
    setLevel(nextLevel);
    setTimerDuration(rule.timer);
    setTimerRemaining(rule.timer);
    setLevelStats({ correct: 0, total: 0 });
    setFeedback(null);
    setLastAction(null);
    setRecentGain(null);
    answeredRef.current = false;
    setPhase("playing");
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setComboCount(0);
    setComboMultiplier(1);
    setBestCombo(0);
    startLevel(1);
  };

  const proceedToNextScenario = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= scenarios.length) {
      const stillAlive = lives > 0;
      const passed = levelAccuracy >= 70 && stillAlive;
      if (passed) {
        setHighestLevel((prev) => {
          const updated = Math.max(prev, level + 1);
          localStorage.setItem("leakPatrol_highestLevel", String(updated));
          return updated;
        });
      }
      setPhase("levelComplete");
      return;
    }
    setCurrentIndex(nextIndex);
    const rule = getRulesForLevel(level);
    setTimerDuration(rule.timer);
    setTimerRemaining(rule.timer);
    setFeedback(null);
    setLastAction(null);
    answeredRef.current = false;
  };

  const handleDecision = (action: Action | "timeout") => {
    if (phase !== "playing" || !currentScenario || answeredRef.current) {
      return;
    }
    answeredRef.current = true;
    const isCorrect = action !== "timeout" && action === currentScenario.correctAction;
    const gained = isCorrect
      ? Math.round(currentScenario.waterSaved * Math.min(3, comboMultiplier + 0.1))
      : 0;
    setLevelStats((prev) => ({
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
    }));

    if (isCorrect) {
      setComboCount((prev) => {
        const next = prev + 1;
        setBestCombo((prevBest) => Math.max(prevBest, next));
        return next;
      });
      setComboMultiplier((prev) => Math.min(3, Number((prev + 0.1).toFixed(1))));
      setScore((prev) => prev + gained);
      setRecentGain(gained);
      setFeedback("Nice catch! Water saved.");
    } else {
      setLives((prev) => prev - 1);
      setComboCount(0);
      setComboMultiplier(1);
      setRecentGain(null);
      const tip = `Better choice: ${currentScenario.correctAction.toUpperCase()}. ${currentScenario.tip}`;
      setFeedback(tip);
    }

    setLastAction(
      action === "timeout" ? "Too late" : action === currentScenario.correctAction ? "Correct" : "Miss",
    );

    window.setTimeout(() => {
      if (lives - (isCorrect ? 0 : 1) <= 0) {
        handleGameOver();
        return;
      }
      proceedToNextScenario();
    }, 650);
  };

  useEffect(() => {
    if (phase === "playing" && timerRemaining === 0 && !answeredRef.current) {
      handleDecision("timeout");
    }
  }, [phase, timerRemaining]);

  const handleGameOver = () => {
    setPhase("gameOver");
    setHighestLevel((prev) => {
      const updated = Math.max(prev, level);
      localStorage.setItem("leakPatrol_highestLevel", String(updated));
      return updated;
    });
    setBestScore((prev) => {
      if (score > prev) {
        localStorage.setItem("leakPatrol_bestScore", String(score));
        return score;
      }
      return prev;
    });
  };

  const handleNextLevel = () => {
    if (lives <= 0) {
      handleGameOver();
      return;
    }
    startLevel(level + 1);
  };

  const handleReplay = () => {
    startGame();
  };

  const renderStart = () => (
    <div className="start-panel">
      <p className="eyebrow">New</p>
      <h1>Leak Patrol</h1>
      <p>Make split-second calls to stop leaks and save water.</p>
      <div className="stat-grid">
        <div className="stat-card">
          <strong>Best score</strong>
          <div>{formatGallons(bestScore)}</div>
        </div>
        <div className="stat-card">
          <strong>Highest level</strong>
          <div>{highestLevel}</div>
        </div>
      </div>
      <button className="primary-button" type="button" onClick={startGame}>
        Play
      </button>
    </div>
  );

  const renderLevelComplete = () => (
    <div className="level-panel">
      <h2>Level {level} Complete</h2>
      <p>You saved {formatGallons(score)} so far.</p>
      <div className="stat-grid">
        <div className="stat-card">
          <strong>Accuracy</strong>
          <div>{levelAccuracy}%</div>
        </div>
        <div className="stat-card">
          <strong>Lives left</strong>
          <div>{lives}</div>
        </div>
        <div className="stat-card">
          <strong>Best combo</strong>
          <div>x{bestCombo}</div>
        </div>
      </div>
      <div className="tip-card">
        Stay ahead of leaks: meter tests, morning watering, and fresh gaskets stop silent losses.
      </div>
      {levelAccuracy >= 70 && lives > 0 ? (
        <button className="primary-button" type="button" onClick={handleNextLevel}>
          Next Level
        </button>
      ) : (
        <button className="secondary-button" type="button" onClick={handleGameOver}>
          Game Over
        </button>
      )}
    </div>
  );

  const renderGameOver = () => (
    <div className="gameover-panel">
      <h2>Game Over</h2>
      <p>Final score: {formatGallons(score)}</p>
      <div className="stat-grid">
        <div className="stat-card">
          <strong>Highest level</strong>
          <div>{highestLevel}</div>
        </div>
        <div className="stat-card">
          <strong>Best combo</strong>
          <div>x{bestCombo}</div>
        </div>
        <div className="stat-card">
          <strong>Best score (browser)</strong>
          <div>{formatGallons(bestScore)}</div>
        </div>
      </div>
      <div className="hero-actions" style={{ justifyContent: "center" }}>
        <a className="primary-button" href="/">
          Analyze my real water bill
        </a>
        <button className="secondary-button" type="button" onClick={handleReplay}>
          Play Again
        </button>
      </div>
    </div>
  );

  const renderHUD = () => (
    <div className="leak-topbar">
      <a className="brand-link" href="/">
        ← WaterShortcut
      </a>
      <div className="meta">
        <span className="badge">Level {level}</span>
        <span className="badge muted">Score: {formatGallons(score)}</span>
        <span className="badge">
          Lives <span className="lives">{livesDisplay}</span>
        </span>
      </div>
    </div>
  );

  const renderScenario = () => (
    <div className="leak-main-card">
      <div className="leak-card-header">
        <div className="leak-icon">{ICON_MAP[currentScenario.icon]}</div>
        <div>
          <p className="eyebrow">Make the call</p>
          <h3>{currentScenario.text}</h3>
        </div>
      </div>
      <div className="timer-bar" aria-label="Timer">
        <div
          className="timer-fill"
          style={{ width: `${(timerRemaining / timerDuration) * 100}%` }}
        />
      </div>
      {feedback && <div className="feedback">{feedback}</div>}
      <div className="actions-grid">
        <button
          className="action-button"
          type="button"
          onClick={() => handleDecision("check")}
        >
          Check
        </button>
        <button
          className="action-button secondary"
          type="button"
          onClick={() => handleDecision("measure")}
        >
          Measure
        </button>
        <button
          className="action-button"
          type="button"
          onClick={() => handleDecision("fix")}
        >
          Fix
        </button>
        <button
          className="action-button secondary"
          type="button"
          onClick={() => handleDecision("replace")}
        >
          Replace
        </button>
      </div>
      <div className="leak-footer">
        Combo {comboCount ? <span className="combo-chip">x{comboMultiplier.toFixed(1)}</span> : "Ready"} · {lastAction || "Waiting"}
      </div>
    </div>
  );

  return (
    <div className="leak-app">
      <div className="leak-shell">
        {renderHUD()}
        {phase === "start" && renderStart()}
        {phase === "playing" && currentScenario && (
          <>
            {renderScenario()}
            <div className="score-panel">
              <div className="score-box">
                <div>
                  <p className="eyebrow">Water saved</p>
                  <div className={`score-value ${recentGain ? "score-pulse" : ""}`}>
                    {formatGallons(score)}
                  </div>
                  {recentGain ? <small>+{recentGain} gal</small> : <small>Keep the streak alive.</small>}
                </div>
                <div className="combo-chip">Combo x{comboMultiplier.toFixed(1)}</div>
              </div>
              <div className="water-tank" aria-label="Savings tank">
                <div className="tank-visual">
                  <div className="tank-fill" style={{ height: `${tankFill}%` }} />
                </div>
                <div>
                  <strong>Lives:</strong> <span className="lives">{livesDisplay}</span>
                  <br />
                  <strong>Accuracy:</strong> {levelAccuracy}%
                </div>
              </div>
            </div>
          </>
        )}
        {phase === "levelComplete" && renderLevelComplete()}
        {phase === "gameOver" && renderGameOver()}
      </div>
    </div>
  );
}

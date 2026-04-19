import { useEffect, useMemo, useRef, useState } from "react";

const ALL_CARDS = [
  {
    id: "apple",
    image:
      "https://images.unsplash.com/photo-1678942946279-c83e37f32304?w=200&auto=format&fit=crop",
    position: "center",
  },
  {
    id: "grapes",
    image:
      "https://images.unsplash.com/photo-1615485925763-86786288908a?w=200&auto=format&fit=crop",
    position: "center",
  },
  {
    id: "peach",
    image:
      "https://images.unsplash.com/photo-1642372849486-f88b963cb734?w=200&auto=format&fit=crop",
    position: "center",
  },
  {
    id: "banana",
    image:
      "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=200&auto=format&fit=crop",
    position: "center",
  },
  {
    id: "orange",
    image:
      "https://images.unsplash.com/photo-1642054016707-ec809a9c5ba0?w=200&auto=format&fit=crop",
    position: "center",
  },
  {
    id: "strawberry",
    image:
      "https://images.unsplash.com/photo-1677694682771-f2a1eaa7b8d9?w=200&auto=format&fit=crop",
    position: "center 45%",
  },
  {
    id: "watermelon",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&auto=format&fit=crop",
    position: "center",
  },
  {
    id: "lemon",
    image:
      "https://images.unsplash.com/photo-1582287104445-6754664dbdb2?w=200&auto=format&fit=crop",
    position: "center",
  },
  {
    id: "cherry",
    image:
      "https://images.unsplash.com/photo-1528821154947-1aa3d1b74941?w=200&auto=format&fit=crop",
    position: "center",
  },
];

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createCards(pairCount = 2) {
  const selectedCards = ALL_CARDS.slice(0, pairCount);

  const pairs = selectedCards.flatMap((card, i) => [
    {
      id: i * 2,
      cardId: card.id,
      image: card.image,
      position: card.position,
      matched: false,
    },
    {
      id: i * 2 + 1,
      cardId: card.id,
      image: card.image,
      position: card.position,
      matched: false,
    },
  ]);

  return shuffle(pairs);
}

function getGridColumns(pairCount) {
  if (pairCount <= 2) return 2;
  if (pairCount <= 4) return 2;
  if (pairCount <= 6) return 3;
  return 4;
}

function getCardSize(pairCount) {
  if (pairCount <= 2) return "clamp(150px, 16vw, 220px)";
  if (pairCount <= 4) return "clamp(130px, 13vw, 190px)";
  if (pairCount <= 6) return "clamp(110px, 10vw, 155px)";
  return "clamp(92px, 8vw, 132px)";
}

function average(values) {
  if (!values || values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function weightedBaseline(baselineGames) {
  const avg2 = average(baselineGames[2]);
  const avg3 = average(baselineGames[3]);

  if (avg2 !== null && avg3 !== null) {
    return avg2 * 0.4 + avg3 * 0.6;
  }
  if (avg3 !== null) return avg3;
  if (avg2 !== null) return avg2;
  return null;
}

function clampMinZero(value) {
  return Math.max(0, value);
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const asString = Array.isArray(value)
    ? value.join(" | ")
    : typeof value === "object"
    ? JSON.stringify(value)
    : String(value);

  return `"${asString.replace(/"/g, '""')}"`;
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function usePrefersDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event) => setIsDark(event.matches);

    setIsDark(media.matches);

    if (media.addEventListener) {
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    } else {
      media.addListener(handler);
      return () => media.removeListener(handler);
    }
  }, []);

  return isDark;
}

export default function App() {
  const isDarkMode = usePrefersDarkMode();

  const theme = useMemo(
    () => ({
      appBg: isDarkMode ? "#111315" : "#f7f7f7",
      text: isDarkMode ? "#f3f4f6" : "#111827",
      subText: isDarkMode ? "#a3a3a3" : "#8a8a8a",
      cardBack: isDarkMode ? "#2b3036" : "#dddddd",
      modalBg: isDarkMode ? "#1b1f24" : "#ffffff",
      modalText: isDarkMode ? "#f3f4f6" : "#333333",
      overlay: "rgba(0,0,0,0.35)",
      panelBg: isDarkMode ? "#16181c" : "#ffffff",
      panelBorder: isDarkMode ? "#2b3036" : "#e5e7eb",
      restartBg: isDarkMode ? "#3a4149" : "#6b7280",
      restartText: "#ffffff",
      continueBg: "#2e7d32",
      continueText: "#ffffff",
      easierBg: isDarkMode ? "#c98a2b" : "#b7791f",
      easierText: "#ffffff",
      harderBg: "#2e7d32",
      harderText: "#ffffff",
      exportBg: isDarkMode ? "#2a2f36" : "#f3f4f6",
      exportText: isDarkMode ? "#d1d5db" : "#555555",
      inputBg: isDarkMode ? "#252a31" : "#ffffff",
      inputBorder: isDarkMode ? "#3a4149" : "#cccccc",
    }),
    [isDarkMode]
  );

  const [pairCount, setPairCount] = useState(2);
  const [cards, setCards] = useState(createCards(2));
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const [showStats, setShowStats] = useState(false);
  const [hintedIds, setHintedIds] = useState([]);
  const [showCompletePopup, setShowCompletePopup] = useState(false);
  const [showDebugModal, setShowDebugModal] = useState(false);

  const [mode, setMode] = useState("learning");
  const [pairStartTime, setPairStartTime] = useState(null);
  const [pairTimes, setPairTimes] = useState([]);
  const [slowMoveCount, setSlowMoveCount] = useState(0);

  const [baselineGames, setBaselineGames] = useState({ 2: [], 3: [] });
  const [baselineTime, setBaselineTime] = useState(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [hintsUsedThisGame, setHintsUsedThisGame] = useState(0);

  const [levelProgress, setLevelProgress] = useState({});
  const [completionAction, setCompletionAction] = useState({
    label: "Continue",
    targetPairCount: 2,
    showEasier: false,
    showHarder: false,
  });

  const [lastGameInfo, setLastGameInfo] = useState({
    avgTime: null,
    slowMoveRatio: null,
    timeDifficulty: false,
    severeMistakeDifficulty: false,
    mistakeLoadDifficulty: false,
    hintDifficulty: false,
    hasDifficulty: false,
    outlierThreshold: 14,
    difficultyThreshold: 7,
  });

  const [previousGameInfo, setPreviousGameInfo] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);

  const [userName, setUserName] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [pendingName, setPendingName] = useState("");
  const [showUserPopup, setShowUserPopup] = useState(true);

  const timeoutRef = useRef(null);
  const hintTimeoutRef = useRef(null);
  const popupTimeoutRef = useRef(null);
  const suppressNextPairTimingRef = useRef(false);

  const isComplete = cards.length > 0 && cards.every((card) => card.matched);

  const currentLevelProgress = levelProgress[pairCount] || {
    goodStreak: 0,
    difficultyStreak: 0,
  };

  const effectiveDifficultyThreshold = Math.max(7, baselineTime || 0);
  const effectiveOutlierThreshold = Math.max(14, (baselineTime || 7) * 2);

  const gridColumns = getGridColumns(pairCount);
  const cardSize = getCardSize(pairCount);
  const compactStatusLetter = mode === "learning" ? "L" : "S";

  const clearProgressFromLevel = (minLevel) => {
    setLevelProgress((prev) => {
      const next = {};
      Object.entries(prev).forEach(([level, value]) => {
        if (Number(level) < minLevel) {
          next[level] = value;
        }
      });
      return next;
    });
  };

  const setLevelState = (level, updates) => {
    setLevelProgress((prev) => {
      const current = prev[level] || { goodStreak: 0, difficultyStreak: 0 };
      return {
        ...prev,
        [level]: {
          ...current,
          ...updates,
        },
      };
    });
  };

  const resetAllData = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);

    setPairCount(2);
    setCards(createCards(2));
    setFlipped([]);
    setMoves(0);
    setMistakes(0);
    setIsChecking(false);

    setShowStats(false);
    setHintedIds([]);
    setShowCompletePopup(false);
    setShowDebugModal(false);

    setMode("learning");
    setPairStartTime(null);
    setPairTimes([]);
    setSlowMoveCount(0);

    setBaselineGames({ 2: [], 3: [] });
    setBaselineTime(null);

    setGameStarted(false);
    setHintsUsedThisGame(0);

    setLevelProgress({});
    setCompletionAction({
      label: "Continue",
      targetPairCount: 2,
      showEasier: false,
      showHarder: false,
    });

    setLastGameInfo({
      avgTime: null,
      slowMoveRatio: null,
      timeDifficulty: false,
      severeMistakeDifficulty: false,
      mistakeLoadDifficulty: false,
      hintDifficulty: false,
      hasDifficulty: false,
      outlierThreshold: 14,
      difficultyThreshold: 7,
    });

    setPreviousGameInfo(null);
    setGameHistory([]);

    setUserName("");
    setSessionDate("");
    setPendingName("");
    setShowUserPopup(true);

    suppressNextPairTimingRef.current = false;
  };

  const exportDebugData = () => {
    const currentRow = {
      rowType: "current_state",
      exportedAt: new Date().toISOString(),
      userName,
      sessionDate,
      pairCount,
      mode,
      moves,
      mistakes,
      hintsUsedThisGame,
      pairTimes,
      avgTime: average(pairTimes),
      slowMoveCount,
      slowMoveRatio:
        pairTimes.length > 0 ? slowMoveCount / pairTimes.length : null,
      baselineTime,
      difficultyThreshold: effectiveDifficultyThreshold,
      outlierThreshold: effectiveOutlierThreshold,
      timeDifficulty: lastGameInfo.timeDifficulty,
      severeMistakeDifficulty: lastGameInfo.severeMistakeDifficulty,
      mistakeLoadDifficulty: lastGameInfo.mistakeLoadDifficulty,
      hintDifficulty: lastGameInfo.hintDifficulty,
      hasDifficulty: lastGameInfo.hasDifficulty,
      goodStreak: currentLevelProgress.goodStreak,
      difficultyStreak: currentLevelProgress.difficultyStreak,
      actionLabel: completionAction.label,
      targetPairCount: completionAction.targetPairCount,
    };

    const rows = [currentRow, ...gameHistory];

    const headers = [
      "rowType",
      "exportedAt",
      "userName",
      "sessionDate",
      "pairCount",
      "mode",
      "moves",
      "mistakes",
      "hintsUsedThisGame",
      "pairTimes",
      "avgTime",
      "slowMoveCount",
      "slowMoveRatio",
      "baselineTime",
      "difficultyThreshold",
      "outlierThreshold",
      "timeDifficulty",
      "severeMistakeDifficulty",
      "mistakeLoadDifficulty",
      "hintDifficulty",
      "hasDifficulty",
      "goodStreak",
      "difficultyStreak",
      "actionLabel",
      "targetPairCount",
    ];

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers.map((header) => csvEscape(row[header])).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `memory-game-data-${userName || "user"}-${
      sessionDate || todayString()
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const startGame = (newPairCount) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);

    setPairCount(newPairCount);
    setCards(createCards(newPairCount));
    setFlipped([]);
    setMoves(0);
    setMistakes(0);
    setIsChecking(false);
    setHintedIds([]);
    setShowCompletePopup(false);
    setPairStartTime(null);
    setPairTimes([]);
    setSlowMoveCount(0);
    setGameStarted(false);
    setHintsUsedThisGame(0);
    suppressNextPairTimingRef.current = false;
  };

  const restart = () => {
    startGame(pairCount);
  };

  const goEasierManual = () => {
    const newPairCount = Math.max(pairCount - 1, 2);
    clearProgressFromLevel(newPairCount);
    setMode("stable");
    startGame(newPairCount);
  };

  const goHarderManual = () => {
    const newPairCount = Math.min(pairCount + 1, ALL_CARDS.length);
    clearProgressFromLevel(newPairCount);
    setMode("stable");
    startGame(newPairCount);
  };

  const handleCompletionPrimaryAction = () => {
    startGame(completionAction.targetPairCount);
  };

  const handleStartSession = () => {
    const trimmed = pendingName.trim();
    if (!trimmed) return;

    setUserName(trimmed);
    setSessionDate(todayString());
    setShowUserPopup(false);
    startGame(2);
  };

  const showHint = () => {
    if (isChecking || isComplete || showUserPopup) return;

    const unmatched = cards.filter((card) => !card.matched);
    const pairMap = {};

    unmatched.forEach((card) => {
      if (!pairMap[card.cardId]) pairMap[card.cardId] = [];
      pairMap[card.cardId].push(card.id);
    });

    const availablePair = Object.values(pairMap).find(
      (ids) => ids.length === 2
    );
    if (!availablePair) return;

    setHintedIds(availablePair);

    if (gameStarted) {
      setHintsUsedThisGame((prev) => prev + 1);
      suppressNextPairTimingRef.current = true;
      setPairStartTime(null);
    }

    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = setTimeout(() => {
      setHintedIds([]);
    }, 1000);
  };

  const handleClick = (id) => {
    if (showUserPopup) return;
    if (isChecking || flipped.includes(id) || isComplete) return;

    if (!gameStarted) {
      setGameStarted(true);
    }

    if (flipped.length === 0 && !suppressNextPairTimingRef.current) {
      setPairStartTime(Date.now());
    }

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setIsChecking(true);

      if (pairStartTime && !suppressNextPairTimingRef.current) {
        const duration = (Date.now() - pairStartTime) / 1000;
        if (duration < effectiveOutlierThreshold) {
          setPairTimes((prev) => [...prev, duration]);

          if (duration > effectiveDifficultyThreshold) {
            setSlowMoveCount((prev) => prev + 1);
          }
        }
      }

      setPairStartTime(null);
      suppressNextPairTimingRef.current = false;

      const [a, b] = newFlipped;
      const first = cards.find((card) => card.id === a);
      const second = cards.find((card) => card.id === b);

      if (first.cardId === second.cardId) {
        setCards((prev) =>
          prev.map((card) =>
            card.id === a || card.id === b ? { ...card, matched: true } : card
          )
        );
        setFlipped([]);
        setIsChecking(false);
      } else {
        setMistakes((prev) => prev + 1);
        timeoutRef.current = setTimeout(() => {
          setFlipped([]);
          setIsChecking(false);
        }, 2500);
      }
    }
  };

  useEffect(() => {
    if (!isComplete) {
      setShowCompletePopup(false);
      return;
    }

    const avgTime = average(pairTimes);
    let nextBaselineGames = baselineGames;
    let nextMode = mode;

    if (
      mode === "learning" &&
      (pairCount === 2 || pairCount === 3) &&
      avgTime !== null
    ) {
      nextBaselineGames = {
        ...baselineGames,
        [pairCount]: [...baselineGames[pairCount], avgTime],
      };
      setBaselineGames(nextBaselineGames);

      const newBaseline = weightedBaseline(nextBaselineGames);
      if (newBaseline !== null) {
        setBaselineTime(newBaseline);
      }
    }

    const computedBaseline =
      weightedBaseline(nextBaselineGames) || baselineTime || 0;
    const latestDifficultyThreshold = Math.max(7, computedBaseline);
    const latestOutlierThreshold = Math.max(14, (computedBaseline || 7) * 2);

    const timeDifficulty =
      pairCount >= 4 && avgTime !== null && avgTime > latestDifficultyThreshold;

    const severeMistakeDifficulty =
      pairCount >= 4 && mistakes >= Math.ceil(pairCount * 2.2);

    const measuredMoveCount = pairTimes.length;
    const slowMoveRatio =
      measuredMoveCount > 0 ? slowMoveCount / measuredMoveCount : 0;

    const mistakeLoadDifficulty =
      pairCount >= 4 &&
      mistakes >= pairCount * 2 &&
      measuredMoveCount > 0 &&
      slowMoveRatio >= 0.4;

    const hintDifficulty = pairCount >= 4 && hintsUsedThisGame >= 2;

    const hasDifficulty =
      timeDifficulty ||
      severeMistakeDifficulty ||
      mistakeLoadDifficulty ||
      hintDifficulty;

    const completedGameInfo = {
      avgTime,
      slowMoveRatio,
      timeDifficulty,
      severeMistakeDifficulty,
      mistakeLoadDifficulty,
      hintDifficulty,
      hasDifficulty,
      outlierThreshold: latestOutlierThreshold,
      difficultyThreshold: latestDifficultyThreshold,
      pairCount,
      mode: nextMode,
      moves,
      mistakes,
      hintsUsedThisGame,
      slowMoveCount,
    };

    setPreviousGameInfo(completedGameInfo);
    setLastGameInfo(completedGameInfo);

    let actionLabel = "Continue";
    let targetPairCount = pairCount;
    let showEasier = pairCount > 2;
    let showHarder = false;

    if (mode === "learning") {
      if (pairCount <= 3) {
        targetPairCount = Math.min(pairCount + 1, ALL_CARDS.length);
        actionLabel = "Continue";
      } else if (hasDifficulty) {
        const easierLevel = Math.max(pairCount - 1, 2);
        nextMode = "stable";
        setMode("stable");
        clearProgressFromLevel(easierLevel);
        setLevelState(easierLevel, {
          goodStreak: 0,
          difficultyStreak: 0,
        });

        actionLabel = "Continue";
        targetPairCount = easierLevel;
        showEasier = pairCount > 2;
        showHarder = false;
      } else {
        targetPairCount = Math.min(pairCount + 1, ALL_CARDS.length);
        actionLabel = "Continue";
      }
    } else {
      const current = levelProgress[pairCount] || {
        goodStreak: 0,
        difficultyStreak: 0,
      };

      if (hasDifficulty) {
        const easierLevel = Math.max(pairCount - 1, 2);
        clearProgressFromLevel(easierLevel);
        setLevelState(easierLevel, {
          goodStreak: 0,
          difficultyStreak: 0,
        });

        actionLabel = "Continue";
        targetPairCount = easierLevel;
        showHarder = false;
      } else {
        const nextGoodStreak = current.goodStreak + 1;

        setLevelState(pairCount, {
          goodStreak: nextGoodStreak,
          difficultyStreak: 0,
        });

        if (nextGoodStreak >= 4 && pairCount < ALL_CARDS.length) {
          actionLabel = "Continue";
          targetPairCount = pairCount + 1;
          showHarder = true;
        } else {
          actionLabel = "Play Again";
          targetPairCount = pairCount;
          showHarder = true;
        }
      }
    }

    setCompletionAction({
      label: actionLabel,
      targetPairCount,
      showEasier,
      showHarder,
    });

    const progressSnapshot = levelProgress[targetPairCount] ||
      levelProgress[pairCount] || {
        goodStreak: 0,
        difficultyStreak: 0,
      };

    const gameRecord = {
      rowType: "history",
      exportedAt: new Date().toISOString(),
      userName,
      sessionDate,
      pairCount,
      mode: nextMode,
      moves,
      mistakes,
      hintsUsedThisGame,
      pairTimes,
      avgTime,
      slowMoveCount,
      slowMoveRatio,
      baselineTime: computedBaseline || null,
      difficultyThreshold: latestDifficultyThreshold,
      outlierThreshold: latestOutlierThreshold,
      timeDifficulty,
      severeMistakeDifficulty,
      mistakeLoadDifficulty,
      hintDifficulty,
      hasDifficulty,
      goodStreak: progressSnapshot.goodStreak,
      difficultyStreak: progressSnapshot.difficultyStreak,
      actionLabel,
      targetPairCount,
    };

    setGameHistory((prev) => [gameRecord, ...prev].slice(0, 100));

    popupTimeoutRef.current = setTimeout(() => {
      setShowCompletePopup(true);
    }, 500);

    return () => {
      if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
    };
  }, [isComplete]);

  const currentDebugColumn = {
    pairCount,
    mode,
    avgTime: average(pairTimes),
    hintsUsedThisGame,
    mistakes,
    timeDifficulty: lastGameInfo.timeDifficulty,
    severeMistakeDifficulty: lastGameInfo.severeMistakeDifficulty,
    mistakeLoadDifficulty: lastGameInfo.mistakeLoadDifficulty,
    hintDifficulty: lastGameInfo.hintDifficulty,
    hasDifficulty: lastGameInfo.hasDifficulty,
    goodStreak: currentLevelProgress.goodStreak,
    difficultyStreak: currentLevelProgress.difficultyStreak,
  };

  const previousDebugColumn = previousGameInfo;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.appBg,
        color: theme.text,
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      {showUserPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: theme.overlay,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
            padding: 20,
          }}
        >
          <div
            style={{
              background: theme.modalBg,
              color: theme.modalText,
              borderRadius: 20,
              padding: "28px 24px",
              maxWidth: 420,
              width: "100%",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 10 }}>Start Session</h2>
            <p style={{ color: theme.subText, marginBottom: 18 }}>
              Enter a name to begin.
            </p>

            <input
              value={pendingName}
              onChange={(e) => setPendingName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && pendingName.trim()) {
                  handleStartSession();
                }
              }}
              placeholder="Enter name"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                fontSize: 16,
                borderRadius: 10,
                border: `1px solid ${theme.inputBorder}`,
                background: theme.inputBg,
                color: theme.text,
                marginBottom: 16,
              }}
              autoFocus
            />

            <button
              onClick={handleStartSession}
              disabled={!pendingName.trim()}
              style={{
                background: pendingName.trim() ? theme.continueBg : "#9bb8df",
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "12px 18px",
                fontSize: 16,
                fontWeight: "bold",
                cursor: pendingName.trim() ? "pointer" : "default",
                minWidth: 140,
              }}
            >
              Start
            </button>
          </div>
        </div>
      )}

      {showDebugModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: theme.overlay,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
            padding: 20,
          }}
        >
          <div
            style={{
              background: theme.modalBg,
              color: theme.modalText,
              borderRadius: 20,
              padding: "20px 20px 18px 20px",
              maxWidth: 860,
              width: "100%",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              position: "relative",
              maxHeight: "85vh",
              overflow: "auto",
            }}
          >
            <button
              onClick={() => setShowDebugModal(false)}
              aria-label="Close debug"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 34,
                height: 34,
                borderRadius: 8,
                border: `1px solid ${theme.panelBorder}`,
                background: theme.exportBg,
                color: theme.exportText,
                cursor: "pointer",
                fontSize: 18,
              }}
            >
              ×
            </button>

            <h3 style={{ marginTop: 0, marginBottom: 14 }}>Debug</h3>

            <div
              style={{
                overflowX: "auto",
                border: `1px solid ${theme.panelBorder}`,
                borderRadius: 12,
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                }}
              >
                <thead>
                  <tr
                    style={{ background: isDarkMode ? "#22272e" : "#f8fafc" }}
                  >
                    <th
                      style={{ textAlign: "left", padding: 12, width: "36%" }}
                    >
                      Metric
                    </th>
                    <th style={{ textAlign: "left", padding: 12 }}>Current</th>
                    <th style={{ textAlign: "left", padding: 12 }}>Previous</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Mode",
                      currentDebugColumn.mode,
                      previousDebugColumn?.mode,
                    ],
                    [
                      "Pairs",
                      currentDebugColumn.pairCount,
                      previousDebugColumn?.pairCount,
                    ],
                    [
                      "Avg time",
                      currentDebugColumn.avgTime
                        ? currentDebugColumn.avgTime.toFixed(2)
                        : "n/a",
                      previousDebugColumn?.avgTime
                        ? previousDebugColumn.avgTime.toFixed(2)
                        : "n/a",
                    ],
                    [
                      "Hints",
                      currentDebugColumn.hintsUsedThisGame,
                      previousDebugColumn?.hintsUsedThisGame ?? "n/a",
                    ],
                    [
                      "Mistakes",
                      currentDebugColumn.mistakes,
                      previousDebugColumn?.mistakes ?? "n/a",
                    ],
                    [
                      "Time difficulty",
                      String(currentDebugColumn.timeDifficulty),
                      previousDebugColumn
                        ? String(previousDebugColumn.timeDifficulty)
                        : "n/a",
                    ],
                    [
                      "Severe mistakes",
                      String(currentDebugColumn.severeMistakeDifficulty),
                      previousDebugColumn
                        ? String(previousDebugColumn.severeMistakeDifficulty)
                        : "n/a",
                    ],
                    [
                      "Mistake load",
                      String(currentDebugColumn.mistakeLoadDifficulty),
                      previousDebugColumn
                        ? String(previousDebugColumn.mistakeLoadDifficulty)
                        : "n/a",
                    ],
                    [
                      "Hint difficulty",
                      String(currentDebugColumn.hintDifficulty),
                      previousDebugColumn
                        ? String(previousDebugColumn.hintDifficulty)
                        : "n/a",
                    ],
                    [
                      "Has difficulty",
                      String(currentDebugColumn.hasDifficulty),
                      previousDebugColumn
                        ? String(previousDebugColumn.hasDifficulty)
                        : "n/a",
                    ],
                    [
                      "Good streak",
                      currentDebugColumn.goodStreak,
                      previousDebugColumn?.goodStreak ?? "n/a",
                    ],
                    [
                      "Difficulty streak",
                      currentDebugColumn.difficultyStreak,
                      previousDebugColumn?.difficultyStreak ?? "n/a",
                    ],
                  ].map(([label, current, previous], index) => (
                    <tr
                      key={label}
                      style={{
                        borderTop:
                          index === 0
                            ? "none"
                            : `1px solid ${theme.panelBorder}`,
                      }}
                    >
                      <td style={{ padding: 12, fontWeight: 600 }}>{label}</td>
                      <td style={{ padding: 12 }}>{current}</td>
                      <td style={{ padding: 12 }}>{previous}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={exportDebugData}
                style={{
                  background: theme.exportBg,
                  color: theme.exportText,
                  border: `1px solid ${theme.panelBorder}`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                Export CSV
              </button>

              <button
                onClick={resetAllData}
                style={{
                  background: "#6a1b1b",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompletePopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: theme.overlay,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            style={{
              background: theme.modalBg,
              color: theme.modalText,
              borderRadius: 20,
              padding: "28px 24px",
              maxWidth: 520,
              width: "100%",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                display: "flex",
                gap: 8,
              }}
            >
              <button
                onClick={exportDebugData}
                title="Export CSV"
                aria-label="Export CSV"
                style={{
                  background: theme.exportBg,
                  color: theme.exportText,
                  border: `1px solid ${theme.panelBorder}`,
                  borderRadius: 8,
                  width: 34,
                  height: 34,
                  cursor: "pointer",
                  fontSize: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                📄
              </button>

              <button
                onClick={() => setShowDebugModal(true)}
                title="Open debug"
                aria-label="Open debug"
                style={{
                  background: theme.exportBg,
                  color: theme.exportText,
                  border: `1px solid ${theme.panelBorder}`,
                  borderRadius: 8,
                  width: 34,
                  height: 34,
                  cursor: "pointer",
                  fontSize: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🛠️
              </button>
            </div>

            <div style={{ fontSize: 42, marginBottom: 10 }}>🎉</div>

            <p
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "#2e7d32",
                margin: "0 0 10px 0",
              }}
            >
              Great job!
            </p>

            <p
              style={{
                fontSize: 18,
                color: theme.modalText,
                margin: "0 0 22px 0",
              }}
            >
              You finished the game.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {completionAction.showEasier && (
                <button
                  onClick={goEasierManual}
                  style={{
                    background: theme.easierBg,
                    color: theme.easierText,
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 18px",
                    fontSize: 16,
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    minWidth: 140,
                  }}
                >
                  <span aria-hidden="true">←</span>
                  <span>Easier</span>
                </button>
              )}

              <button
                onClick={handleCompletionPrimaryAction}
                style={{
                  background:
                    completionAction.label === "Continue"
                      ? theme.continueBg
                      : theme.restartBg,
                  color:
                    completionAction.label === "Continue"
                      ? theme.continueText
                      : theme.restartText,
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 18px",
                  fontSize: 16,
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  minWidth: 140,
                }}
              >
                <span aria-hidden="true">
                  {completionAction.label === "Play Again" ? "↺" : "→"}
                </span>
                <span>{completionAction.label}</span>
              </button>

              {mode === "stable" &&
                completionAction.showHarder &&
                completionAction.targetPairCount < ALL_CARDS.length && (
                  <button
                    onClick={goHarderManual}
                    style={{
                      background: theme.harderBg,
                      color: theme.harderText,
                      border: "none",
                      borderRadius: 12,
                      padding: "12px 18px",
                      fontSize: 16,
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      minWidth: 140,
                    }}
                  >
                    <span>Harder</span>
                    <span aria-hidden="true">→</span>
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      <h1 style={{ margin: "0 0 16px 0", textAlign: "center" }}>Memory Game</h1>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 20,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <label style={{ fontSize: 14, cursor: "pointer", color: theme.text }}>
          <input
            type="checkbox"
            checked={showStats}
            onChange={() => setShowStats(!showStats)}
            style={{ marginRight: 8 }}
          />
          Show stats
        </label>

        <button
          onClick={() => setShowDebugModal(true)}
          style={{
            background: theme.exportBg,
            color: theme.exportText,
            border: `1px solid ${theme.panelBorder}`,
            borderRadius: 8,
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Open debug
        </button>
      </div>

      {showStats && (
        <p style={{ marginBottom: 16, textAlign: "center", color: theme.text }}>
          Moves: {moves} | Mistakes: {mistakes}
        </p>
      )}

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 28,
        }}
      >
        <div
          style={{
            flex: "0 1 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: `calc(${cardSize} * ${gridColumns} + 60px)`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: theme.subText,
              fontSize: 12,
              marginBottom: 8,
              padding: "0 4px",
              boxSizing: "border-box",
            }}
          >
            <span>{userName || ""}</span>
            <span>{compactStatusLetter}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gridColumns}, ${cardSize})`,
                gap: "12px",
                justifyContent: "center",
              }}
            >
              {cards.map((card) => {
                const isHinted = hintedIds.includes(card.id);
                const isRevealed = flipped.includes(card.id) || card.matched;

                return (
                  <div
                    key={card.id}
                    onClick={() => handleClick(card.id)}
                    style={{
                      width: cardSize,
                      aspectRatio: "1 / 1",
                      background: card.matched ? "transparent" : theme.cardBack,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor:
                        isComplete || card.matched ? "default" : "pointer",
                      borderRadius: 14,
                      overflow: "hidden",
                      border: card.matched
                        ? "2px solid transparent"
                        : isHinted
                        ? "4px solid #ffd54f"
                        : "2px solid transparent",
                      boxShadow: card.matched
                        ? "none"
                        : isHinted
                        ? "0 0 0 4px rgba(255, 213, 79, 0.4), 0 0 16px rgba(255, 213, 79, 0.9)"
                        : "0 1px 4px rgba(0,0,0,0.05)",
                      animation:
                        !card.matched && isHinted
                          ? "hintBlink 0.35s ease-in-out 3"
                          : "none",
                      transition: "all 0.2s ease",
                      boxSizing: "border-box",
                    }}
                  >
                    {card.matched ? null : isRevealed ? (
                      <img
                        src={card.image}
                        alt={card.cardId}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: card.position || "center",
                          display: "block",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: "clamp(26px, 3vw, 38px)",
                          color: isDarkMode ? "#d1d5db" : "#444",
                        }}
                      >
                        ?
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {!isComplete && !showUserPopup && (
              <button
                onClick={showHint}
                aria-label="Show hint"
                title="Show hint"
                style={{
                  marginTop: 4,
                  background: "#fbc02d",
                  color: "#222",
                  border: "none",
                  borderRadius: 16,
                  width: "clamp(52px, 5vw, 64px)",
                  height: "clamp(52px, 5vw, 64px)",
                  fontSize: "clamp(26px, 3vw, 34px)",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                💡
              </button>
            )}
          </div>

          {!isComplete && !showUserPopup && (
            <div
              style={{
                marginTop: 22,
                display: "flex",
                justifyContent: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {pairCount > 2 && (
                <button
                  onClick={goEasierManual}
                  style={{
                    background: theme.easierBg,
                    color: theme.easierText,
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 18px",
                    fontSize: 16,
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <span aria-hidden="true">←</span>
                  <span>Easier</span>
                </button>
              )}

              <button
                onClick={restart}
                style={{
                  background: theme.restartBg,
                  color: theme.restartText,
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 18px",
                  fontSize: 16,
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <span aria-hidden="true">↺</span>
                <span>Restart</span>
              </button>

              {mode === "stable" && pairCount < ALL_CARDS.length && (
                <button
                  onClick={goHarderManual}
                  style={{
                    background: theme.harderBg,
                    color: theme.harderText,
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 18px",
                    fontSize: 16,
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <span>Harder</span>
                  <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes hintBlink {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { QUIZ_DATA, TOTAL_QUESTIONS, TIME_PER_QUESTION, MAX_SCORE } from "./data/quizData";
import "./App.css";

function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(MAX_SCORE);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [answered, setAnswered] = useState(false);
  const [quizOver, setQuizOver] = useState(false);
  // Per-question result: null | 'correct' | 'wrong' | 'timeout'
  const [answers, setAnswers] = useState(() => Array(TOTAL_QUESTIONS).fill(null));

  const currentQuestion = QUIZ_DATA[currentIndex];

  const advanceQuestion = useCallback(() => {
    if (currentIndex >= TOTAL_QUESTIONS - 1) {
      setQuizOver(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setTimeLeft(TIME_PER_QUESTION);
    setAnswered(false);
  }, [currentIndex]);

  // Timer: count down every second; at 0, penalize and advance if not answered
  useEffect(() => {
    if (!quizStarted || quizOver || answered) return;

    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          setScore((s) => Math.max(0, s - 1));
          setAnswers((prev) => {
            const next = [...prev];
            next[currentIndex] = "timeout";
            return next;
          });
          setAnswered(true);
          setTimeout(advanceQuestion, 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [quizStarted, quizOver, answered, advanceQuestion, currentIndex]);

  const handleSelectOption = (optionIndex) => {
    if (answered) return;
    setAnswered(true);

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    if (!isCorrect) {
      setScore((s) => Math.max(0, s - 1));
    }
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = isCorrect ? "correct" : "wrong";
      return next;
    });

    setTimeout(advanceQuestion, 400);
  };

  const handleStart = () => {
    setQuizStarted(true);
    setCurrentIndex(0);
    setScore(MAX_SCORE);
    setTimeLeft(TIME_PER_QUESTION);
    setAnswered(false);
    setQuizOver(false);
    setAnswers(Array(TOTAL_QUESTIONS).fill(null));
  };

  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <div className="quiz-card start-screen">
          <h1>Quiz Challenge</h1>
          <p>{TOTAL_QUESTIONS} questions · 60 seconds per question</p>
          <p className="rules">Wrong answer or no answer in time = −1 point. Total score: {MAX_SCORE}.</p>
          <button className="btn-primary" onClick={handleStart}>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizOver) {
    const perfect = score === MAX_SCORE;
    return (
      <div className="quiz-container">
        <div className={`quiz-card results-screen ${perfect ? "perfect" : ""}`}>
          <h1>{perfect ? "Congratulations!" : "Quiz Complete"}</h1>
          {perfect ? (
            <p className="congrats-message">
              You got every answer correct. Outstanding performance!
            </p>
          ) : (
            <>
              <p className="nice-try-message">Nice try! Go try again.</p>
              <p className="results-sub">Check your score and the correct answers below.</p>
            </>
          )}
          <div className="score-display">
            <span className="score-value">{score}</span>
            <span className="score-label"> / {MAX_SCORE}</span>
          </div>

          <div className="answers-list">
            <h3>Questions & correct answers</h3>
            <ul>
              {QUIZ_DATA.map((q, i) => (
                <li key={q.id} className={`answer-item answer-${answers[i] ?? "timeout"}`}>
                  <span className="answer-q">{i + 1}. {q.question}</span>
                  <span className="answer-correct">Correct: {q.options[q.correctIndex]}</span>
                  <span className={`answer-badge ${answers[i] ?? "timeout"}`}>
                    {answers[i] === "correct" ? "✓ Correct" : answers[i] === "wrong" ? "✗ Wrong" : "⏱ Time out"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button className="btn-primary" onClick={handleStart}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <span className="question-counter">
            Question {currentIndex + 1} of {TOTAL_QUESTIONS}
          </span>
          <div className="timer" data-warning={timeLeft <= 10}>
            <span className="timer-label">Time</span>
            <span className="timer-value">{timeLeft}s</span>
          </div>
        </div>

        <h2 className="question-text">{currentQuestion.question}</h2>

        <div className="options-grid">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              className="option-btn"
              onClick={() => handleSelectOption(idx)}
              disabled={answered}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

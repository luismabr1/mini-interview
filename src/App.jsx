import { useState, useEffect } from 'react';
import questionsData from './questions.json';
import './App.css';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [fade, setFade] = useState(true);

  // Selecciona una pregunta aleatoria
  const getRandomQuestion = () => {
    const randomCategory = questionsData[Math.floor(Math.random() * questionsData.length)];
    const randomQuestion = randomCategory.questions[Math.floor(Math.random() * randomCategory.questions.length)];
    return { category: randomCategory.category, ...randomQuestion };
  };

  // Cambia a una nueva pregunta con efecto de transición
  const nextQuestion = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentQuestion(getRandomQuestion());
      setShowAnswer(false);
      setTimeLeft(30);
      setScore((prevScore) => prevScore + 1);
      setFade(true);
    }, 300); // Duración del fade-out
  };

  // Reinicia el juego
  const resetGame = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentQuestion(getRandomQuestion());
      setShowAnswer(false);
      setTimeLeft(30);
      setScore(0);
      setFade(true);
    }, 300);
  };

  // Temporizador
  useEffect(() => {
    setCurrentQuestion(getRandomQuestion());
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          nextQuestion();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Alternar visibilidad de la respuesta
  const toggleAnswer = () => {
    setFade(false);
    setTimeout(() => {
      setShowAnswer(!showAnswer);
      setFade(true);
    }, 300);
  };

  return (
    <div className="app-container">
      <h1 className="title">Interview Practice Game</h1>
      <div className="stats">
        <p>Time Left: {timeLeft}s</p>
        <p>Questions Answered: {score}</p>
        <button onClick={resetGame} className="reset-btn">
          Reset Game
        </button>
      </div>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${(timeLeft / 30) * 100}%` }}
        ></div>
      </div>
      {currentQuestion && (
        <div className={`card ${fade ? 'fade-in' : 'fade-out'}`}>
          <h2 className="category">{currentQuestion.category}</h2>
          <p className="question">{currentQuestion.question}</p>
          {showAnswer && (
            <div className={`answer ${fade ? 'fade-in' : 'fade-out'}`}>
              <strong>Sample Answer:</strong> {currentQuestion.answer}
            </div>
          )}
          <div className="button-group">
            <button onClick={toggleAnswer} className="toggle-answer-btn">
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
            <button onClick={nextQuestion} className="next-btn">
              Next Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
import { useState, useEffect } from 'react';
import questionsData from './questions.json';
import './App.css';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalTime, setTotalTime] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [fade, setFade] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [timeExceeded, setTimeExceeded] = useState(false);

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
      // Sumar 1 punto si el tiempo no se agotó
      if (!timeExceeded) {
        setScore((prevScore) => prevScore + 1);
      }
      setCurrentQuestion(getRandomQuestion());
      setShowAnswer(false);
      setTimeLeft(30);
      setTotalTime(0);
      setTimeExceeded(false);
      setIsPaused(false);
      setFade(true);
    }, 300);
  };

  // Reinicia el juego
  const resetGame = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentQuestion(getRandomQuestion());
      setShowAnswer(false);
      setTimeLeft(30);
      setTotalTime(0);
      setScore(0);
      setTimeExceeded(false);
      setIsPaused(false);
      setFade(true);
    }, 300);
  };

  // Alternar pausa
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Temporizador
  useEffect(() => {
    // Inicializa la primera pregunta
    if (!currentQuestion) {
      setCurrentQuestion(getRandomQuestion());
    }

    const timer = setInterval(() => {
      setTotalTime((prev) => prev + 1); // Incrementa tiempo total siempre
      setTimeLeft((prev) => {
        if (prev <= 0) {
          return 0; // Mantiene timeLeft en 0, no hace nada más
        }
        const newTime = prev - 1;
        if (newTime === 0 && !timeExceeded) {
          // Penalizar solo una vez cuando timeLeft llega a 0
          setScore((prevScore) => {
            console.log('Penalización: -1 punto'); // Para depuración
            return prevScore - 1;
          });
          setTimeExceeded(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion]); // Solo depende de currentQuestion

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
        <p>Time Left: {timeLeft}s {timeExceeded && "(Time Exceeded!)"}</p>
        <p>Total Time: {totalTime}s</p>
        <p>Score: {score}</p>
        <button onClick={resetGame} className="reset-btn">
          Reset Game
        </button>
      </div>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: timeLeft > 0 ? `${(timeLeft / 30) * 100}%` : '0%' }}
        ></div>
      </div>
      {currentQuestion && (
        <div className={`card ${fade ? 'fade-in' : 'fade-out'} ${isPaused ? 'paused' : ''}`}>
          <h2 className="category">{currentQuestion.category}</h2>
          <p className="question">{currentQuestion.question}</p>
          {showAnswer && (
            <div className={`answer ${fade ? 'fade-in' : 'fade-out'}`}>
              <strong>Sample Answer:</strong> {currentQuestion.answer}
            </div>
          )}
          <div className="button-group">
            <button onClick={togglePause} className="pause-btn">
              {isPaused ? 'Resume' : 'Pause'}
            </button>
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
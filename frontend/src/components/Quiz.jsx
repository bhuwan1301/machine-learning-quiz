import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const username = localStorage.getItem('username');

  useEffect(() => {
    // Check if user is logged in
    if (!username) {
      navigate('/login');
      return;
    }

    // Fetch questions from backend
    fetchQuestions();

    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          handleSubmit(true); // Auto-submit when time runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [username, navigate]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/questions');
      const data = await response.json();
      setQuestions(data);
      
      // Initialize answers object with empty strings
      const initialAnswers = {};
      data.forEach((q) => {
        initialAnswers[q.id] = '';
      });
      setAnswers(initialAnswers);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Failed to load questions. Please try again.');
      navigate('/login');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (e) => {
    const questionId = questions[currentQuestion].id;
    setAnswers({
      ...answers,
      [questionId]: e.target.value,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (submitting) return;

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Check if user has answered all questions
    const unansweredCount = Object.values(answers).filter(a => !a.trim()).length;
    
    if (!autoSubmit && unansweredCount > 0) {
      const confirm = window.confirm(
        `You have ${unansweredCount} unanswered question(s). Do you want to submit anyway?`
      );
      if (!confirm) return;
    }

    setSubmitting(true);

    try {
      // Prepare answers array in order
      const answersArray = questions.map((q) => answers[q.id] || '');

      const response = await fetch('http://localhost:5000/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          answers: answersArray,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store results in localStorage and navigate to results page
        localStorage.setItem('quizResults', JSON.stringify(data));
        navigate('/results');
      } else {
        alert('Failed to submit quiz. Please try again.');
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Server error. Please try again.');
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout? Your progress will be lost.')) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      localStorage.removeItem('username');
      localStorage.removeItem('isAdmin');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading">Loading questions...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="error">No questions available</div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isTimeRunningOut = timeLeft <= 60; // Last minute warning

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-info">
          <h1>Machine Learning Quiz</h1>
          <p>Welcome, <strong>{username}</strong>!</p>
        </div>
        <div className="timer-section">
          <div className={`timer ${isTimeRunningOut ? 'timer-warning' : ''}`}>
            ⏱️ {formatTime(timeLeft)}
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="quiz-content">
        <div className="question-header">
          <span className="question-number">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>

        <div className="question-card">
          <h2 className="question-text">{currentQ.question}</h2>
          
          <textarea
            className="answer-input"
            value={answers[currentQ.id] || ''}
            onChange={handleAnswerChange}
            placeholder="Type your answer here..."
            rows="8"
            disabled={submitting}
          />
        </div>

        <div className="navigation-buttons">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || submitting}
            className="nav-btn prev-btn"
          >
            ← Previous
          </button>

          <div className="answer-status">
            {answers[currentQ.id]?.trim() ? (
              <span className="answered">✓ Answered</span>
            ) : (
              <span className="not-answered">Not answered</span>
            )}
          </div>

          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={submitting}
              className="nav-btn next-btn"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="submit-btn-quiz"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>

        <div className="question-indicators">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className={`indicator ${index === currentQuestion ? 'active' : ''} ${
                answers[q.id]?.trim() ? 'answered' : ''
              }`}
              onClick={() => !submitting && setCurrentQuestion(index)}
              title={`Question ${index + 1}`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Quiz;

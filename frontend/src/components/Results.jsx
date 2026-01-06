import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Results.css';

function Results() {
  const [results, setResults] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const navigate = useNavigate();

  const username = localStorage.getItem('username');

  useEffect(() => {
    // Check if user is logged in
    if (!username) {
      navigate('/login');
      return;
    }

    // Get results from localStorage
    const savedResults = localStorage.getItem('quizResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    } else {
      // If no results found, redirect to quiz
      navigate('/quiz');
    }
  }, [username, navigate]);

  const handleRetakeQuiz = () => {
    localStorage.removeItem('quizResults');
    navigate('/quiz');
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('quizResults');
    navigate('/login');
  };

  if (!results) {
    return (
      <div className="results-container">
        <div className="loading">Loading results...</div>
      </div>
    );
  }

  const percentage = ((results.totalScore / results.maxScore) * 100).toFixed(1);
  const submittedDate = new Date(results.submittedAt || Date.now());

  // Determine performance category
  let performanceCategory = '';
  let performanceColor = '';
  if (percentage >= 80) {
    performanceCategory = 'Excellent! 🎉';
    performanceColor = '#28a745';
  } else if (percentage >= 60) {
    performanceCategory = 'Good Job! 👍';
    performanceColor = '#17a2b8';
  } else if (percentage >= 40) {
    performanceCategory = 'Fair 😊';
    performanceColor = '#ffc107';
  } else {
    performanceCategory = 'Keep Practicing 📚';
    performanceColor = '#dc3545';
  }

  return (
    <div className="results-container">
      <div className="results-content">
        {/* Header */}
        <div className="results-header">
          <h1>Quiz Results</h1>
          <p>Welcome, <strong>{username}</strong>!</p>
        </div>

        {/* Score Card */}
        <div className="score-card">
          <div className="score-circle" style={{ borderColor: performanceColor }}>
            <div className="score-percentage" style={{ color: performanceColor }}>
              {percentage}%
            </div>
            <div className="score-label">Score</div>
          </div>

          <div className="score-details">
            <h2 style={{ color: performanceColor }}>{performanceCategory}</h2>
            <div className="score-breakdown">
              <div className="score-item">
                <span className="label">Your Score:</span>
                <span className="value">{results.totalScore} / {results.maxScore}</span>
              </div>
              <div className="score-item">
                <span className="label">Questions:</span>
                <span className="value">{results.answers.length}</span>
              </div>
              <div className="score-item">
                <span className="label">Submitted:</span>
                <span className="value">
                  {submittedDate.toLocaleDateString()} at {submittedDate.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Review Section */}
        <div className="answers-section">
          <button 
            onClick={() => setShowAnswers(!showAnswers)}
            className="toggle-answers-btn"
          >
            {showAnswers ? '▼ Hide Detailed Results' : '▶ Show Detailed Results'}
          </button>

          {showAnswers && (
            <div className="answers-list">
              {results.answers.map((answer, index) => (
                <div key={index} className="answer-card">
                  <div className="answer-header">
                    <span className="question-num">Question {index + 1}</span>
                    <span className={`score-badge ${answer.score >= 4 ? 'high' : answer.score >= 2.5 ? 'medium' : 'low'}`}>
                      {answer.score} / 5
                    </span>
                  </div>

                  <div className="question-text">
                    <strong>Q:</strong> {answer.question}
                  </div>

                  <div className="answer-comparison">
                    <div className="user-answer">
                      <h4>Your Answer:</h4>
                      <p>{answer.userAnswer || <em>No answer provided</em>}</p>
                    </div>

                    <div className="correct-answer">
                      <h4>Model Answer:</h4>
                      <p>{answer.correctAnswer}</p>
                    </div>
                  </div>

                  {/* Score indicator bar */}
                  <div className="score-bar">
                    <div 
                      className="score-bar-fill"
                      style={{ 
                        width: `${(answer.score / 5) * 100}%`,
                        backgroundColor: answer.score >= 4 ? '#28a745' : answer.score >= 2.5 ? '#ffc107' : '#dc3545'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={handleRetakeQuiz} className="retake-btn">
            🔄 Retake Quiz
          </button>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;

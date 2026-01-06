import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UserSubmissions.css';

function UserSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const navigate = useNavigate();
  const { username } = useParams();

  const adminUsername = localStorage.getItem('username');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    // Check if user is logged in and is admin
    if (!adminUsername || !isAdmin) {
      navigate('/login');
      return;
    }

    fetchSubmissions();
  }, [username, adminUsername, isAdmin, navigate]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/submissions/${username}`
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setSubmissions(data);
      } else {
        setError('Invalid data received from server');
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError('Failed to load submissions. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
  };

  const handleCloseDetails = () => {
    setSelectedSubmission(null);
  };

  if (loading) {
    return (
      <div className="submissions-container">
        <div className="loading">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="submissions-container">
      <div className="submissions-content">
        {/* Header */}
        <div className="submissions-header">
          <button onClick={handleBackToDashboard} className="back-btn">
            ← Back to Dashboard
          </button>
          <div className="header-info">
            <h1>📝 Submissions for {username}</h1>
            <p>Total Submissions: <strong>{submissions.length}</strong></p>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No submissions found for this user</p>
          </div>
        ) : (
          <div className="submissions-list">
            {submissions.map((submission, index) => {
              const submittedDate = new Date(submission.submittedAt);
              const percentage = (
                (submission.totalScore / submission.maxScore) *
                100
              ).toFixed(1);

              return (
                <div key={submission._id} className="submission-card">
                  <div className="submission-number">
                    Attempt #{submissions.length - index}
                  </div>

                  <div className="submission-info">
                    <div className="info-row">
                      <span className="label">📅 Date:</span>
                      <span className="value">
                        {submittedDate.toLocaleDateString()} at{' '}
                        {submittedDate.toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="label">📊 Score:</span>
                      <span className="value">
                        {submission.totalScore} / {submission.maxScore} (
                        {percentage}%)
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="label">❓ Questions:</span>
                      <span className="value">{submission.answers.length}</span>
                    </div>
                  </div>

                  <div className="submission-actions">
                    <div
                      className="score-badge"
                      style={{
                        background:
                          percentage >= 80
                            ? '#28a745'
                            : percentage >= 60
                            ? '#17a2b8'
                            : percentage >= 40
                            ? '#ffc107'
                            : '#dc3545',
                      }}
                    >
                      {percentage}%
                    </div>
                    <button
                      onClick={() => handleViewDetails(submission)}
                      className="details-btn"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedSubmission && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submission Details</h2>
              <button onClick={handleCloseDetails} className="close-btn">
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-summary">
                <div className="summary-item">
                  <span>Total Score:</span>
                  <strong>
                    {selectedSubmission.totalScore} /{' '}
                    {selectedSubmission.maxScore}
                  </strong>
                </div>
                <div className="summary-item">
                  <span>Submitted:</span>
                  <strong>
                    {new Date(
                      selectedSubmission.submittedAt
                    ).toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="answers-detail-list">
                {selectedSubmission.answers.map((answer, index) => (
                  <div key={index} className="answer-detail-card">
                    <div className="answer-detail-header">
                      <span className="question-num">Question {index + 1}</span>
                      <span
                        className={`score-badge-small ${
                          answer.score >= 4
                            ? 'high'
                            : answer.score >= 2.5
                            ? 'medium'
                            : 'low'
                        }`}
                      >
                        {answer.score} / 5
                      </span>
                    </div>

                    <div className="question-text-detail">
                      <strong>Q:</strong> {answer.question}
                    </div>

                    <div className="answer-comparison-detail">
                      <div className="user-answer-detail">
                        <h4>User's Answer:</h4>
                        <p>{answer.userAnswer || <em>No answer provided</em>}</p>
                      </div>

                      <div className="correct-answer-detail">
                        <h4>Model Answer:</h4>
                        <p>{answer.correctAnswer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserSubmissions;
